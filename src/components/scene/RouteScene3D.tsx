import { Html, Line } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { STATIONS } from './stations'
import './RouteScene3D.css'

export type SceneDriver = {
  /** scroll progress target written by ScrollTrigger */
  target: number
  /** set by the scene once mounted; pin onUpdate calls it to re-render */
  invalidate: () => void
}

type DriverRef = RefObject<SceneDriver>

type SceneProps = {
  driver: DriverRef
  onContextLost: () => void
}

/* Deterministic 2-octave value noise — no dependency needed for a survey-mesh terrain. */
function hash2(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return s - Math.floor(s)
}

function smoothNoise(x: number, y: number) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  const sx = xf * xf * (3 - 2 * xf)
  const sy = yf * yf * (3 - 2 * yf)
  const a = hash2(xi, yi)
  const b = hash2(xi + 1, yi)
  const c = hash2(xi, yi + 1)
  const d = hash2(xi + 1, yi + 1)
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy
}

function fbm(x: number, y: number) {
  return smoothNoise(x, y) * 0.7 + smoothNoise(x * 2.3, y * 2.3) * 0.3
}

// Scene geometry is deterministic — built once when the lazy chunk loads.
// Plan-view convention: the route line floats at a constant elevation above
// the survey mesh; the road-crossing depth is told by the station label.
const ROUTE_CURVE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-17, 0.32, 5.5),
  new THREE.Vector3(-9, 0.32, 3.6),
  new THREE.Vector3(-3, 0.26, 2.6),
  new THREE.Vector3(4, 0.26, 1.6),
  new THREE.Vector3(9, 0.32, 0.6),
  new THREE.Vector3(14, 0.32, -1.6),
  new THREE.Vector3(18, 0.36, -3.2),
])

const CAM_CURVE = new THREE.CatmullRomCurve3(
  ROUTE_CURVE.points.map((p) => new THREE.Vector3(p.x - 4, 10.5, p.z + 14)),
)

const ROUTE_SAMPLES = ROUTE_CURVE.getPoints(240)
const ROUTE_LENGTH = ROUTE_CURVE.getLength()
const STATION_TS = [0.02, 0.27, 0.52, 0.76, 0.985]
const STATION_POSITIONS = STATION_TS.map((t) => ROUTE_CURVE.getPointAt(t))
const UP = new THREE.Vector3(0, 1, 0)
const lookTarget = new THREE.Vector3()

function Terrain() {
  const { solid, wire } = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(120, 80, 150, 100)
    geometry.rotateX(-Math.PI / 2)
    const positions = geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < positions.count; i += 1) {
      const x = positions.getX(i)
      const z = positions.getZ(i)
      // flatten near the route corridor and the road
      const corridor = Math.min(1, Math.max(0, (Math.abs(z) - 6) / 14))
      const lift = fbm(x * 0.08 + 13.7, z * 0.08 + 7.3) * 1.6 * (0.25 + corridor * 0.75)
      positions.setY(i, lift - 0.55)
    }
    geometry.computeVertexNormals()
    return { solid: geometry, wire: geometry.clone() }
  }, [])

  useEffect(
    () => () => {
      solid.dispose()
      wire.dispose()
    },
    [solid, wire],
  )

  return (
    <group>
      <mesh geometry={solid}>
        <meshStandardMaterial color="#101216" roughness={0.96} metalness={0} />
      </mesh>
      <mesh geometry={wire} position={[0, 0.02, 0]}>
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.05} />
      </mesh>
    </group>
  )
}

function Road() {
  return (
    <group position={[3.4, 0, 0]} rotation={[0, 0.18, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <planeGeometry args={[5.2, 80]} />
        <meshStandardMaterial color="#1c2026" roughness={0.9} />
      </mesh>
      {[-2.4, 2.4].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.08, 0]}>
          <planeGeometry args={[0.14, 80]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.35} />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
        <planeGeometry args={[0.1, 80]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.14} />
      </mesh>
    </group>
  )
}

function RouteLine({ driver }: { driver: DriverRef }) {
  const lineRef = useRef<never>(null)
  const headRef = useRef<THREE.Mesh>(null)
  const tipRef = useRef<THREE.Mesh>(null)
  const labelsRef = useRef<THREE.Group>(null)
  const ringsRef = useRef<THREE.Group>(null)
  const progressRef = useRef(0)
  const invalidate = useThree((state) => state.invalidate)

  useEffect(() => {
    // The driver is a parent-owned mutable ref store bridging ScrollTrigger
    // (outside the Canvas) to R3F's demand-mode invalidate.
    // eslint-disable-next-line react-hooks/immutability
    driver.current.invalidate = invalidate
    invalidate()
  }, [driver, invalidate])

  useFrame(() => {
    const current = progressRef.current
    const target = driver.current.target
    const next = Math.abs(target - current) < 0.0008 ? target : current + (target - current) * 0.09
    progressRef.current = next

    // Positive offset reveals the dash from the ENTRY side, so the line
    // trails behind the head. (Negative revealed it from the exit — the
    // line appeared to grow toward the head from the wrong direction.)
    const material = (lineRef.current as { material?: { dashOffset: number } } | null)?.material
    if (material) material.dashOffset = ROUTE_LENGTH * (1 - next)

    if (headRef.current) {
      const t = Math.min(0.999, Math.max(0.001, next))
      headRef.current.position.copy(ROUTE_CURVE.getPointAt(t))
      headRef.current.quaternion.setFromUnitVectors(UP, ROUTE_CURVE.getTangentAt(t))
    }

    // steady white tip light at the head — eased in/out at the route ends
    if (tipRef.current && headRef.current) {
      tipRef.current.position.copy(headRef.current.position)
      const ramp =
        Math.min(1, Math.max(0, (next - 0.01) / 0.05)) *
        Math.min(1, Math.max(0, (0.99 - next) / 0.05))
      const tipMaterial = tipRef.current.material as THREE.MeshBasicMaterial
      tipMaterial.opacity = ramp * 0.8
    }

    // locate ripples: each station ring expands + fades as the head passes
    ringsRef.current?.children.forEach((child, index) => {
      const mesh = child as THREE.Mesh
      const ringMaterial = mesh.material as THREE.MeshBasicMaterial
      const r = (next - STATION_TS[index]) / 0.12
      if (r <= 0 || r >= 1) {
        ringMaterial.opacity = 0
      } else {
        mesh.scale.setScalar(0.6 + r * 3)
        ringMaterial.opacity = (1 - r) * 0.8
      }
    })

    if (next !== target) invalidate()
  })

  return (
    <group>
      <Line
        ref={lineRef}
        points={ROUTE_SAMPLES}
        color="#e5091b"
        lineWidth={4}
        dashed
        dashSize={ROUTE_LENGTH}
        gapSize={ROUTE_LENGTH}
        dashOffset={ROUTE_LENGTH}
      />
      <mesh ref={headRef}>
        <coneGeometry args={[0.28, 0.9, 12]} />
        <meshBasicMaterial color="#e5091b" />
      </mesh>
      <mesh ref={tipRef} scale={0.8}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} depthWrite={false} />
      </mesh>
      <group ref={ringsRef}>
        {STATION_POSITIONS.map((position, index) => (
          <mesh
            key={STATIONS[index][0]}
            position={[position.x, position.y - 0.08, position.z]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[0.72, 0.86, 48]} />
            <meshBasicMaterial color="#ff5a66" transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
      <group ref={labelsRef}>
        {STATION_POSITIONS.map((position, index) => (
          <Html
            key={STATIONS[index][0]}
            position={[position.x, position.y + 1.1, position.z]}
            center
            wrapperClass="route3d-label-wrap"
            className="route3d-label"
          >
            <span className="route3d-label-sta">{STATIONS[index][0]}</span>
            <span className="route3d-label-desc">{STATIONS[index][1]}</span>
          </Html>
        ))}
      </group>
    </group>
  )
}

function CameraRig({ driver }: { driver: DriverRef }) {
  const progressRef = useRef(0)

  useFrame(({ camera, invalidate }) => {
    const current = progressRef.current
    const target = driver.current.target
    const next = Math.abs(target - current) < 0.0008 ? target : current + (target - current) * 0.08
    progressRef.current = next

    const t = Math.min(0.999, Math.max(0, next))
    camera.position.copy(CAM_CURVE.getPointAt(t))
    lookTarget.copy(ROUTE_CURVE.getPointAt(Math.min(0.999, t + 0.08)))
    camera.lookAt(lookTarget)
    if (next !== target) invalidate()
  })

  return null
}

function RouteScene3D({ driver, onContextLost }: SceneProps) {
  return (
    <Canvas
      className="route3d-canvas"
      dpr={[1, 1.75]}
      frameloop="demand"
      camera={{ fov: 42, near: 0.1, far: 90, position: [-19, 7, 15] }}
      gl={{ powerPreference: 'high-performance', antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (event) => {
          event.preventDefault()
          onContextLost()
        })
      }}
    >
      {/* transparent canvas: the section's shared survey-grid ink shows
          through, so animations 1 and 2 sit on the SAME background */}
      <fog attach="fog" args={['#0a0b0d', 22, 58]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[-12, 14, 9]} intensity={1.25} />
      <Terrain />
      <Road />
      <RouteLine driver={driver} />
      <CameraRig driver={driver} />
    </Canvas>
  )
}

export default RouteScene3D
