import { ArrowUpRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type Point = {
  x: number
  y: number
}

type SceneSize = {
  width: number
  height: number
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const easeOut = (value: number) => 1 - Math.pow(1 - clamp(value), 3)
const easeInOut = (value: number) => {
  const t = clamp(value)
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function cubicPoint(t: number, p0: Point, p1: Point, p2: Point, p3: Point) {
  const mt = 1 - t
  return {
    x: mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x,
    y: mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y,
  }
}

function routeSamples(size: SceneSize, surfaceY: number, count = 220) {
  const { width, height } = size
  const p0 = { x: width * 0.68, y: surfaceY - height * 0.015 }
  const p1 = { x: width * 0.65, y: surfaceY + height * 0.1 }
  const p2 = { x: width * 0.58, y: surfaceY + height * 0.23 }
  const p3 = { x: width * 0.47, y: surfaceY + height * 0.285 }
  const end = { x: width * 0.12, y: surfaceY + height * 0.3 }
  const curveCount = Math.floor(count * 0.46)
  const straightCount = count - curveCount
  const curve = Array.from({ length: curveCount }, (_, index) => cubicPoint(index / (curveCount - 1), p0, p1, p2, p3))
  const straight = Array.from({ length: straightCount }, (_, index) => {
    const t = index / (straightCount - 1)
    return {
      x: p3.x + (end.x - p3.x) * t,
      y: p3.y + (end.y - p3.y) * t,
    }
  })
  return [...curve, ...straight.slice(1)]
}

function drawPath(ctx: CanvasRenderingContext2D, points: Point[], progress = 1) {
  const visible = Math.max(2, Math.floor(points.length * clamp(progress)))
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  for (let index = 1; index < visible; index += 1) {
    ctx.lineTo(points[index].x, points[index].y)
  }
  ctx.stroke()
}

function pointAt(points: Point[], progress: number) {
  return points[Math.round((points.length - 1) * clamp(progress))]
}

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  const r = Math.min(radius, width / 2, height / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + width - r, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + r)
  ctx.lineTo(x + width, y + height - r)
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
  ctx.lineTo(x + r, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function drawLabel(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color = '#f8f6f1', size = 12) {
  ctx.save()
  ctx.font = `850 ${size}px Inter, system-ui, sans-serif`
  ctx.fillStyle = color
  ctx.fillText(text, x, y)
  ctx.restore()
}

function drawBoringRig(ctx: CanvasRenderingContext2D, size: SceneSize, surfaceY: number, progress: number) {
  const { width, height } = size
  const rigScale = Math.min(width, height) / 900
  const x = width * 0.73
  const y = surfaceY - 118 * rigScale
  const vibration = Math.sin(progress * 70) * 1.4 * clamp((progress - 0.18) / 0.16)

  ctx.save()
  ctx.translate(x, y + vibration)
  ctx.scale(rigScale, rigScale)

  ctx.fillStyle = 'rgba(0, 0, 0, 0.34)'
  ctx.beginPath()
  ctx.ellipse(118, 142, 196, 24, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#070809'
  drawRoundedRect(ctx, -12, 98, 315, 56, 10)
  ctx.fill()
  ctx.fillStyle = '#1d232a'
  drawRoundedRect(ctx, 6, 106, 278, 36, 18)
  ctx.fill()
  ctx.strokeStyle = '#4a5158'
  ctx.lineWidth = 6
  for (let i = 0; i < 7; i += 1) {
    ctx.beginPath()
    ctx.arc(35 + i * 36, 124, 11, 0, Math.PI * 2)
    ctx.stroke()
  }

  ctx.fillStyle = '#d9dde0'
  drawRoundedRect(ctx, 34, 26, 215, 76, 12)
  ctx.fill()
  ctx.fillStyle = '#bfc5c9'
  drawRoundedRect(ctx, 170, 2, 78, 72, 10)
  ctx.fill()
  ctx.fillStyle = '#2a3036'
  drawRoundedRect(ctx, 186, 14, 42, 30, 6)
  ctx.fill()
  ctx.fillStyle = '#e5091b'
  ctx.fillRect(62, 58, 88, 10)
  ctx.fillStyle = '#070809'
  ctx.fillRect(62, 76, 142, 8)

  ctx.save()
  ctx.translate(38, 100)
  ctx.rotate(-0.96)
  ctx.fillStyle = '#14181d'
  drawRoundedRect(ctx, -14, -12, 310, 24, 12)
  ctx.fill()
  ctx.fillStyle = '#e5091b'
  ctx.fillRect(112, -3, 128, 6)
  ctx.restore()

  ctx.strokeStyle = '#f8f6f1'
  ctx.globalAlpha = 0.55
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(66, 30)
  ctx.lineTo(140, 30)
  ctx.stroke()
  ctx.globalAlpha = 1
  ctx.restore()
}

function drawDrillHead(ctx: CanvasRenderingContext2D, point: Point, next: Point, size: SceneSize, progress: number) {
  const angle = Math.atan2(next.y - point.y, next.x - point.x)
  const scale = Math.min(size.width, size.height) / 900
  ctx.save()
  ctx.translate(point.x, point.y)
  ctx.rotate(angle)
  ctx.scale(scale, scale)
  ctx.fillStyle = '#070809'
  drawRoundedRect(ctx, -33, -16, 62, 32, 15)
  ctx.fill()
  ctx.fillStyle = '#e5091b'
  ctx.beginPath()
  ctx.moveTo(-44, 0)
  ctx.lineTo(-10, -24)
  ctx.lineTo(-10, 24)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = '#f8f6f1'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(14, 0, 19, progress * 28, progress * 28 + Math.PI * 1.35)
  ctx.stroke()
  ctx.restore()
}

function drawHeroScene(ctx: CanvasRenderingContext2D, size: SceneSize, rawProgress: number, staticMode: boolean) {
  const progress = staticMode ? 0.82 : clamp(rawProgress)
  const { width, height } = size
  const compact = width < 680
  const cutaway = easeInOut((progress - 0.08) / 0.22)
  const drillMotion = easeInOut((progress - 0.22) / 0.42)
  const conduit = easeInOut((progress - 0.62) / 0.24)
  const closeout = easeOut((progress - 0.84) / 0.16)
  const initialSurfaceY = height * (compact ? 0.76 : 0.76)
  const finalSurfaceY = height * (compact ? 0.54 : 0.42)
  const surfaceY = initialSurfaceY + (finalSurfaceY - initialSurfaceY) * cutaway
  const samples = routeSamples(size, surfaceY)

  ctx.clearRect(0, 0, width, height)

  const sky = ctx.createLinearGradient(0, 0, width, height)
  sky.addColorStop(0, '#ffffff')
  sky.addColorStop(0.34, '#ffffff')
  sky.addColorStop(0.68, '#fff1f2')
  sky.addColorStop(1, '#f04a56')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, width, height)

  ctx.save()
  ctx.globalAlpha = 0.28
  ctx.strokeStyle = '#d7dde3'
  ctx.lineWidth = 1
  for (let x = 0; x < width; x += compact ? 46 : 66) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }
  for (let y = 0; y < height; y += compact ? 46 : 66) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }
  ctx.restore()

  ctx.save()
  ctx.globalAlpha = 0.18
  ctx.fillStyle = '#e5091b'
  ctx.beginPath()
  ctx.moveTo(width * 0.52, 0)
  ctx.lineTo(width, 0)
  ctx.lineTo(width, height * 0.72)
  ctx.quadraticCurveTo(width * 0.79, height * 0.52, width * 0.66, height * 0.28)
  ctx.closePath()
  ctx.fill()
  ctx.restore()

  ctx.save()
  ctx.globalAlpha = 0.45
  const redWash = ctx.createLinearGradient(width * 0.34, 0, width, height)
  redWash.addColorStop(0, 'rgba(229, 9, 27, 0)')
  redWash.addColorStop(0.62, 'rgba(229, 9, 27, 0.12)')
  redWash.addColorStop(1, 'rgba(229, 9, 27, 0.24)')
  ctx.fillStyle = redWash
  ctx.fillRect(0, 0, width, height)
  ctx.restore()

  ctx.fillStyle = '#d9dde1'
  ctx.fillRect(0, surfaceY - height * 0.08, width, height * 0.08)
  ctx.fillStyle = '#23282e'
  ctx.fillRect(0, surfaceY - height * 0.026, width, height * 0.026)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.48)'
  ctx.lineWidth = 2
  for (let x = -80; x < width; x += compact ? 92 : 150) {
    ctx.beginPath()
    ctx.moveTo(x, surfaceY - height * 0.045)
    ctx.lineTo(x + (compact ? 54 : 82), surfaceY - height * 0.045)
    ctx.stroke()
  }

  const soilTop = surfaceY
  const layerHeight = (height - soilTop) / 4
  const soilColors = ['#d6d0c5', '#aaa49b', '#85827c', '#5d5f5d']
  soilColors.forEach((color, index) => {
    const y = soilTop + index * layerHeight
    ctx.globalAlpha = 0.12 + cutaway * 0.88
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(0, y)
    for (let x = 0; x <= width; x += width / 18) {
      ctx.lineTo(x, y + Math.sin(index + x * 0.008) * height * 0.006)
    }
    ctx.lineTo(width, y + layerHeight + 3)
    ctx.lineTo(0, y + layerHeight + 3)
    ctx.closePath()
    ctx.fill()
  })
  ctx.globalAlpha = 1

  if (cutaway > 0.08) {
    ctx.save()
    ctx.globalAlpha = cutaway * 0.26
    ctx.strokeStyle = '#070809'
    for (let index = 0; index < 110; index += 1) {
      const x = (index * 83) % width
      const y = soilTop + ((index * 47) % Math.max(1, height - soilTop))
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + 13, y + Math.sin(index) * 3)
      ctx.stroke()
    }
    ctx.restore()
  }

  const utilities = [
    { label: 'ELECTRIC', color: '#e5091b', y: soilTop + layerHeight * 0.55, x1: width * 0.08, x2: width * 0.46 },
    { label: 'GAS', color: '#f3c634', y: soilTop + layerHeight * 1.02, x1: width * 0.54, x2: width * 0.93 },
    { label: 'FIBER', color: '#f47b20', y: soilTop + layerHeight * 1.42, x1: width * 0.1, x2: width * 0.39 },
    { label: 'WATER', color: '#2e8fff', y: soilTop + layerHeight * 1.86, x1: width * 0.59, x2: width * 0.95 },
  ]
  utilities.forEach((utility) => {
    ctx.save()
    ctx.globalAlpha = cutaway
    ctx.strokeStyle = utility.color
    ctx.lineWidth = compact ? 4 : 7
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(utility.x1, utility.y)
    ctx.lineTo(utility.x2, utility.y)
    ctx.stroke()
    drawLabel(ctx, utility.label, utility.x1, utility.y - 11, utility.color, compact ? 9 : 12)
    ctx.restore()
  })

  ctx.save()
  ctx.globalAlpha = 0.12 + cutaway * 0.18
  ctx.strokeStyle = '#e5091b'
  ctx.lineWidth = compact ? 11 : 18
  ctx.lineCap = 'round'
  drawPath(ctx, samples, Math.max(0.18, drillMotion * 0.92))
  ctx.restore()

  ctx.save()
  ctx.globalAlpha = 0.38 + cutaway * 0.62
  ctx.strokeStyle = '#e5091b'
  ctx.lineWidth = compact ? 4 : 7
  ctx.lineCap = 'round'
  drawPath(ctx, samples, Math.max(0.18, drillMotion * 0.92))
  ctx.restore()

  if (conduit > 0) {
    ctx.save()
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#f8f6f1'
    ctx.lineWidth = compact ? 5 : 10
    drawPath(ctx, samples, conduit)
    ctx.strokeStyle = '#e5091b'
    ctx.lineWidth = compact ? 2 : 4
    drawPath(ctx, samples, conduit)
    ctx.restore()
  }

  if (cutaway > 0.2) {
    ctx.save()
    ctx.globalAlpha = cutaway * 0.8
    ctx.strokeStyle = '#111418'
    ctx.lineWidth = 1
    const tickCount = compact ? 4 : 7
    for (let index = 0; index < tickCount; index += 1) {
      const x = width * (0.12 + index * (compact ? 0.21 : 0.12))
      ctx.beginPath()
      ctx.moveTo(x, soilTop + 18)
      ctx.lineTo(x, height * 0.92)
      ctx.stroke()
      drawLabel(ctx, `STA ${String(index + 1).padStart(2, '0')}`, x + 5, soilTop + 36, '#111418', compact ? 8 : 10)
    }
    for (let index = 1; index <= 4; index += 1) {
      const y = soilTop + index * layerHeight * 0.78
      ctx.beginPath()
      ctx.moveTo(width * 0.035, y)
      ctx.lineTo(width * 0.085, y)
      ctx.stroke()
      drawLabel(ctx, `${index * 4} FT`, width * 0.04, y - 7, '#111418', compact ? 8 : 10)
    }
    ctx.restore()
  }

  drawBoringRig(ctx, size, surfaceY, progress)

  if (progress > 0.18 && conduit < 0.98) {
    const head = pointAt(samples, drillMotion)
    const next = pointAt(samples, Math.min(1, drillMotion + 0.02))
    drawDrillHead(ctx, head, next, size, progress)
    ctx.save()
    ctx.fillStyle = 'rgba(17, 20, 24, 0.32)'
    for (let index = 0; index < 18; index += 1) {
      const drift = index * 0.2 + progress * 12
      ctx.beginPath()
      ctx.arc(head.x + Math.cos(drift) * 14 - index * 2, head.y + Math.sin(drift) * 10, compact ? 1.4 : 2.4, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
  }

  if (cutaway > 0.55) {
    const callouts = compact
      ? [
          ['CLEARANCE', width * 0.43, soilTop + layerHeight * 1.08, width * 0.5, soilTop + layerHeight * 0.72],
          ['PULLBACK', width * 0.62, soilTop + layerHeight * 1.9, width * 0.67, soilTop + layerHeight * 2.38],
        ]
      : [
          ['UTILITY CLEARANCE WINDOW', width * 0.47, soilTop + layerHeight * 1.1, width * 0.56, soilTop + layerHeight * 0.72],
          ['VERTEX RED INSTALLED ROUTE', width * 0.58, soilTop + layerHeight * 1.85, width * 0.62, soilTop + layerHeight * 2.46],
          ['CLOSEOUT DEPTH LOG', width * 0.7, soilTop + layerHeight * 2.65, width * 0.58, soilTop + layerHeight * 2.35],
        ]
    ctx.save()
    ctx.strokeStyle = 'rgba(248, 246, 241, 0.78)'
    ctx.lineWidth = 1
    callouts.forEach(([text, x, y, tx, ty], index) => {
      const alpha = index === 0 ? cutaway : closeout || conduit
      ctx.globalAlpha = alpha
      ctx.beginPath()
      ctx.moveTo(x as number, y as number)
      ctx.lineTo(tx as number, ty as number)
      ctx.stroke()
      drawLabel(ctx, text as string, (tx as number) + 8, (ty as number) + 4, index === 1 ? '#e5091b' : '#f8f6f1', compact ? 9 : 11)
    })
    ctx.restore()
  }

  ctx.save()
  ctx.globalAlpha = 0.18 + closeout * 0.32
  ctx.strokeStyle = '#e5091b'
  ctx.lineWidth = 2
  ctx.strokeRect(width * 0.035, soilTop + height * 0.035, width * 0.93, height - soilTop - height * 0.075)
  ctx.restore()
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return reduced
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(max-width: 760px)')
    const update = () => setMobile(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return mobile
}

export default function BelowGradeBore() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const progressRef = useRef(0)
  const reducedMotion = useReducedMotion()
  const isMobile = useIsMobile()
  const [progressState, setProgressState] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return undefined

    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    let raf = 0
    let width = 1
    let height = 1

    const staticMode = reducedMotion || isMobile

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(1, Math.floor(rect.width))
      height = Math.max(1, Math.floor(rect.height))
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      drawHeroScene(ctx, { width, height }, progressRef.current, staticMode)
    }

    const update = () => {
      if (staticMode) {
        progressRef.current = 0.86
        setProgressState(0)
        return
      }

      const rect = section.getBoundingClientRect()
      const travel = Math.max(1, rect.height - window.innerHeight)
      const progress = clamp(-rect.top / travel)
      progressRef.current = progress
      setProgressState(progress)
    }

    const render = () => {
      update()
      drawHeroScene(ctx, { width, height }, progressRef.current, staticMode)
      raf = window.requestAnimationFrame(render)
    }

    resize()
    render()
    window.addEventListener('resize', resize)

    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [isMobile, reducedMotion])

  const staticMode = isMobile || reducedMotion
  const introExit = clamp((progressState - 0.04) / 0.22)
  const copyFade = staticMode ? 1 : 1 - introExit
  const copyShift = staticMode ? 0 : -52 * introExit

  return (
    <section
      ref={sectionRef}
      className="bore-hero-section"
      aria-labelledby="hero-title"
      data-static={staticMode ? 'true' : 'false'}
    >
      <div className="bore-hero-sticky">
        <canvas ref={canvasRef} className="bore-hero-canvas" aria-hidden="true" />
        <div className="bore-hero-shade" style={{ opacity: copyFade }} aria-hidden="true" />
        <div
          className="bore-hero-copy"
          style={{
            opacity: copyFade,
            visibility: !staticMode && copyFade <= 0.01 ? 'hidden' : 'visible',
            transform: `translateY(${copyShift}px)`,
          }}
        >
          <h1 id="hero-title">Utility infrastructure, installed with field precision.</h1>
          <p>
            Vertex IFG supports fiber, gas, electric, and water projects with trenchless installation,
            utility coordination, field documentation, and closeout discipline.
          </p>
          <div className="hero-actions">
            <a className="button button-red" href="#contact">
              Send project scope
              <ArrowUpRight aria-hidden="true" />
            </a>
            <a className="button button-dark" href="#capabilities">
              View capabilities
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
