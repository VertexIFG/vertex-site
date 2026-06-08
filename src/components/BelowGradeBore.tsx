import { useEffect, useRef, useState } from 'react'

const beats = [
  {
    range: '00-01',
    title: 'Plan the route before the first cut.',
    body: 'Surface access, stations, depths, and existing utility windows are mapped before equipment moves.',
  },
  {
    range: '01-02',
    title: 'Directional drilling reduces surface disruption.',
    body: 'The entry angle sends the drill path below the worksite while the road surface stays intact.',
  },
  {
    range: '02-03',
    title: 'Existing utilities stay visible in the plan.',
    body: 'Electric, gas, communications, water, and drainage stay legible as the bore passes below them.',
  },
  {
    range: '03-04',
    title: 'The route becomes an installed utility pathway.',
    body: 'Pullback converts the pilot bore into a clean conduit route ready for the new utility.',
  },
  {
    range: '04-05',
    title: 'Built below grade. Documented above it.',
    body: 'Depth, station, utility, and closeout records resolve into a finished field package.',
  },
]

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const easeOut = (value: number) => 1 - Math.pow(1 - clamp(value), 3)
const easeInOut = (value: number) => {
  const t = clamp(value)
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}
const beatFromProgress = (progress: number) => {
  if (progress < 0.12) return 0
  if (progress < 0.3) return 1
  if (progress < 0.58) return 2
  if (progress < 0.82) return 3
  return 4
}

type Point = {
  x: number
  y: number
}

type SceneSize = {
  width: number
  height: number
}

function cubicPoint(t: number, p0: Point, p1: Point, p2: Point, p3: Point) {
  const mt = 1 - t
  return {
    x: mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x,
    y: mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y,
  }
}

function routeSamples(size: SceneSize, count = 140) {
  const { width, height } = size
  const p0 = { x: width * 0.18, y: height * 0.305 }
  const p1 = { x: width * 0.27, y: height * 0.56 }
  const p2 = { x: width * 0.58, y: height * 0.61 }
  const p3 = { x: width * 0.84, y: height * 0.48 }
  return Array.from({ length: count }, (_, index) => cubicPoint(index / (count - 1), p0, p1, p2, p3))
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
  const index = Math.round((points.length - 1) * clamp(progress))
  return points[index]
}

function drawLabel(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color = '#f8f6f1') {
  ctx.save()
  ctx.font = '700 12px Inter, system-ui, sans-serif'
  ctx.fillStyle = color
  ctx.fillText(text, x, y)
  ctx.restore()
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

function drawScene(ctx: CanvasRenderingContext2D, size: SceneSize, rawProgress: number, reducedMotion: boolean) {
  const progress = reducedMotion ? 0.92 : clamp(rawProgress)
  const { width, height } = size
  const compact = width < 640
  const surfaceY = height * 0.27
  const samples = routeSamples(size)
  const planProgress = easeOut(progress / 0.14)
  const drillProgress = easeInOut((progress - 0.12) / 0.48)
  const utilityOpacity = 0.32 + 0.68 * easeOut((progress - 0.22) / 0.24)
  const conduitProgress = easeInOut((progress - 0.58) / 0.28)
  const closeoutProgress = easeOut((progress - 0.82) / 0.18)

  ctx.clearRect(0, 0, width, height)

  const bg = ctx.createLinearGradient(0, 0, 0, height)
  bg.addColorStop(0, '#0a0c0f')
  bg.addColorStop(0.22, '#111418')
  bg.addColorStop(1, '#070809')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, width, height)

  ctx.save()
  ctx.globalAlpha = 0.28
  ctx.strokeStyle = '#f8f6f1'
  ctx.lineWidth = 1
  for (let x = 0; x < width; x += 58) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }
  for (let y = 0; y < height; y += 58) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }
  ctx.restore()

  ctx.fillStyle = '#2e3338'
  ctx.fillRect(0, 0, width, surfaceY)
  ctx.fillStyle = '#171a1f'
  ctx.fillRect(0, surfaceY - height * 0.055, width, height * 0.055)
  ctx.strokeStyle = '#f8f6f1'
  ctx.globalAlpha = 0.16
  ctx.lineWidth = 2
  for (let x = -width * 0.2; x < width; x += width * 0.18) {
    ctx.beginPath()
    ctx.moveTo(x, surfaceY - height * 0.035)
    ctx.lineTo(x + width * 0.1, surfaceY - height * 0.035)
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  const layers = [
    ['#d7d0c5', surfaceY, height * 0.18],
    ['#b8b0a6', surfaceY + height * 0.18, height * 0.17],
    ['#8f8a83', surfaceY + height * 0.35, height * 0.19],
    ['#6b6b68', surfaceY + height * 0.54, height * 0.19],
  ] as const

  layers.forEach(([color, y, layerHeight], index) => {
    ctx.fillStyle = color
    ctx.globalAlpha = 0.9 - index * 0.08
    ctx.beginPath()
    ctx.moveTo(0, y)
    for (let x = 0; x <= width; x += width / 18) {
      ctx.lineTo(x, y + Math.sin(x * 0.009 + index) * height * 0.008)
    }
    ctx.lineTo(width, y + layerHeight)
    ctx.lineTo(0, y + layerHeight)
    ctx.closePath()
    ctx.fill()
  })
  ctx.globalAlpha = 1

  ctx.save()
  ctx.globalAlpha = 0.2
  ctx.strokeStyle = '#070809'
  ctx.lineWidth = 1
  for (let index = 0; index < 120; index += 1) {
    const x = (index * 73) % width
    const y = surfaceY + ((index * 47) % Math.round(height - surfaceY))
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + 14, y + Math.sin(index) * 3)
    ctx.stroke()
  }
  ctx.restore()

  const utilities = [
    { y: height * 0.39, color: '#e5091b', label: 'ELECTRIC', x1: width * 0.1, x2: width * 0.46 },
    { y: height * 0.44, color: '#f3c634', label: 'GAS', x1: width * 0.55, x2: width * 0.92 },
    { y: height * 0.51, color: '#f47b20', label: 'FIBER', x1: width * 0.12, x2: width * 0.34 },
    { y: height * 0.57, color: '#2e8fff', label: 'WATER', x1: width * 0.66, x2: width * 0.95 },
    { y: height * 0.67, color: '#2da665', label: 'DRAIN', x1: width * 0.16, x2: width * 0.48 },
  ]

  utilities.forEach((utility) => {
    ctx.save()
    ctx.globalAlpha = utilityOpacity
    ctx.strokeStyle = utility.color
    ctx.lineWidth = Math.max(5, height * 0.008)
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(utility.x1, utility.y)
    ctx.lineTo(utility.x2, utility.y)
    ctx.stroke()
    ctx.globalAlpha = 0.95 * utilityOpacity
    drawLabel(ctx, utility.label, utility.x1, utility.y - 12, utility.color)
    ctx.restore()
  })

  ctx.save()
  ctx.globalAlpha = 0.76
  ctx.strokeStyle = '#111418'
  ctx.lineWidth = 1
  for (let index = 0; index < 7; index += 1) {
    const x = width * (0.15 + index * 0.115)
    ctx.beginPath()
    ctx.moveTo(x, surfaceY + height * 0.03)
    ctx.lineTo(x, height * 0.92)
    ctx.stroke()
    ctx.fillStyle = '#111418'
    ctx.font = `${compact ? '800 9px' : '800 11px'} Inter, system-ui, sans-serif`
    if (!compact || index % 2 === 0) {
      ctx.fillText(`STA ${String(index + 1).padStart(2, '0')}`, x + 7, surfaceY + height * 0.06)
    }
  }
  for (let index = 1; index <= 5; index += 1) {
    if (compact && index !== 1 && index !== 3 && index !== 5) {
      continue
    }
    const y = surfaceY + height * (0.12 * index)
    ctx.beginPath()
    ctx.moveTo(width * 0.04, y)
    ctx.lineTo(width * 0.095, y)
    ctx.stroke()
    ctx.fillText(`${index * 4} FT`, width * 0.045, y - 8)
  }
  ctx.restore()

  ctx.save()
  ctx.lineCap = 'round'
  ctx.strokeStyle = 'rgba(229, 9, 27, 0.28)'
  ctx.lineWidth = Math.max(10, height * 0.018)
  drawPath(ctx, samples, planProgress)
  ctx.strokeStyle = '#e5091b'
  ctx.lineWidth = Math.max(4, height * 0.007)
  drawPath(ctx, samples, Math.max(planProgress, drillProgress * 0.9))
  ctx.restore()

  if (conduitProgress > 0) {
    ctx.save()
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#f8f6f1'
    ctx.lineWidth = Math.max(7, height * 0.011)
    drawPath(ctx, samples, conduitProgress)
    ctx.strokeStyle = '#e5091b'
    ctx.lineWidth = Math.max(3, height * 0.005)
    drawPath(ctx, samples, conduitProgress)
    ctx.restore()
  }

  const rigX = width * 0.075
  const rigY = surfaceY - height * 0.12
  ctx.save()
  ctx.fillStyle = '#070809'
  drawRoundedRect(ctx, rigX, rigY + height * 0.055, width * 0.13, height * 0.048, 5)
  ctx.fill()
  ctx.fillStyle = '#d5d8da'
  drawRoundedRect(ctx, rigX + width * 0.022, rigY + height * 0.012, width * 0.11, height * 0.055, 6)
  ctx.fill()
  ctx.fillStyle = '#e5091b'
  ctx.fillRect(rigX + width * 0.034, rigY + height * 0.032, width * 0.045, height * 0.01)
  ctx.strokeStyle = '#111418'
  ctx.lineWidth = Math.max(5, height * 0.009)
  ctx.beginPath()
  ctx.moveTo(rigX + width * 0.118, rigY + height * 0.058)
  ctx.lineTo(samples[0].x, samples[0].y)
  ctx.stroke()
  if (!compact) {
    ctx.fillStyle = '#f8f6f1'
    ctx.font = '900 11px Inter, system-ui, sans-serif'
    ctx.fillText('VERTEX RIG', rigX + width * 0.026, rigY + height * 0.049)
  }
  ctx.restore()

  if (progress > 0.12 && conduitProgress < 0.98) {
    const head = pointAt(samples, drillProgress)
    const next = pointAt(samples, Math.min(1, drillProgress + 0.02))
    const angle = Math.atan2(next.y - head.y, next.x - head.x)
    ctx.save()
    ctx.translate(head.x, head.y)
    ctx.rotate(angle)
    ctx.fillStyle = '#111418'
    drawRoundedRect(ctx, -width * 0.021, -height * 0.012, width * 0.05, height * 0.024, height * 0.012)
    ctx.fill()
    ctx.fillStyle = '#e5091b'
    ctx.beginPath()
    ctx.moveTo(width * 0.03, 0)
    ctx.lineTo(width * 0.005, -height * 0.018)
    ctx.lineTo(width * 0.005, height * 0.018)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = 'rgba(248, 246, 241, 0.9)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(-width * 0.008, 0, height * 0.017, progress * 24, progress * 24 + Math.PI * 1.25)
    ctx.stroke()
    ctx.restore()

    ctx.save()
    ctx.fillStyle = 'rgba(7, 8, 9, 0.25)'
    for (let index = 0; index < 10; index += 1) {
      const offset = index * 0.19 + progress * 8
      ctx.beginPath()
      ctx.arc(head.x - Math.cos(angle) * (18 + index * 3), head.y + Math.sin(offset) * 10, 2 + (index % 3), 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
  }

  ctx.save()
  ctx.globalAlpha = 0.75 + closeoutProgress * 0.25
  ctx.strokeStyle = '#f8f6f1'
  ctx.lineWidth = 1
  const callouts = compact
    ? [
        { text: 'CLEARANCE', x: width * 0.46, y: height * 0.48, tx: width * 0.52, ty: height * 0.38 },
        { text: 'PULLBACK', x: width * 0.66, y: height * 0.53, tx: width * 0.68, ty: height * 0.7 },
        { text: 'DEPTH LOG', x: width * 0.72, y: height * 0.76, tx: width * 0.58, ty: height * 0.72 },
      ]
    : [
        { text: 'CLEARANCE WINDOW', x: width * 0.45, y: height * 0.47, tx: width * 0.53, ty: height * 0.38 },
        { text: 'PULLBACK PATH', x: width * 0.69, y: height * 0.52, tx: width * 0.72, ty: height * 0.68 },
        { text: 'CLOSEOUT DEPTH LOG', x: width * 0.78, y: height * 0.78, tx: width * 0.62, ty: height * 0.72 },
      ]
  callouts.forEach((item, index) => {
    const alpha = clamp((progress - (0.28 + index * 0.18)) / 0.16)
    ctx.globalAlpha = alpha
    ctx.beginPath()
    ctx.moveTo(item.x, item.y)
    ctx.lineTo(item.tx, item.ty)
    ctx.stroke()
    drawLabel(ctx, item.text, item.tx + 8, item.ty + 4, index === 1 ? '#e5091b' : '#111418')
  })
  ctx.restore()

  ctx.save()
  ctx.globalAlpha = 0.9
  ctx.fillStyle = '#e5091b'
  for (let index = 0; index < 7; index += 1) {
    const x = width * (0.16 + index * 0.105)
    ctx.beginPath()
    ctx.moveTo(x, surfaceY - height * 0.09)
    ctx.lineTo(x + width * 0.012, surfaceY - height * 0.067)
    ctx.lineTo(x, surfaceY - height * 0.067)
    ctx.closePath()
    ctx.fill()
    ctx.fillRect(x, surfaceY - height * 0.067, 2, height * 0.045)
  }
  ctx.restore()

  ctx.save()
  ctx.globalAlpha = 0.18 + closeoutProgress * 0.22
  ctx.strokeStyle = '#e5091b'
  ctx.lineWidth = 2
  ctx.strokeRect(width * 0.035, height * 0.055, width * 0.93, height * 0.875)
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
  const [activeBeat, setActiveBeat] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) {
      return undefined
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return undefined
    }

    let frame = 0
    let width = 0
    let height = 0

    const setCanvasSize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(1, Math.floor(rect.width))
      height = Math.max(1, Math.floor(rect.height))
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      drawScene(ctx, { width, height }, progressRef.current, reducedMotion || isMobile)
    }

    const updateProgress = () => {
      if (reducedMotion || isMobile) {
        progressRef.current = 0.92
        setActiveBeat(4)
        return
      }

      const rect = section.getBoundingClientRect()
      const travel = Math.max(1, rect.height - window.innerHeight)
      const progress = clamp(-rect.top / travel)
      progressRef.current = progress
      setActiveBeat(beatFromProgress(progress))
    }

    const render = () => {
      updateProgress()
      drawScene(ctx, { width, height }, progressRef.current, reducedMotion || isMobile)
      frame = window.requestAnimationFrame(render)
    }

    setCanvasSize()
    updateProgress()
    render()

    window.addEventListener('resize', setCanvasSize)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', setCanvasSize)
    }
  }, [isMobile, reducedMotion])

  return (
    <section
      ref={sectionRef}
      className="bore-scroll-section"
      aria-labelledby="bore-scroll-title"
      data-static={isMobile || reducedMotion ? 'true' : 'false'}
    >
      <div className="bore-sticky">
        <div className="bore-copy">
          <span className="bore-kicker">Below-grade route control</span>
          <h2 id="bore-scroll-title">Below grade, the route stays visible.</h2>
          <div className="bore-beats" aria-label="Boring animation story beats">
            {beats.map((beat, index) => (
              <article className={activeBeat === index ? 'is-active' : ''} key={beat.title}>
                <span>{beat.range}</span>
                <strong>{beat.title}</strong>
                <p>{beat.body}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="bore-stage" aria-hidden="true">
          <canvas ref={canvasRef} />
          <div className="bore-stage-label bore-label-surface">Road / worksite surface</div>
          <div className="bore-stage-label bore-label-depth">Depth markers</div>
          <div className="bore-stage-label bore-label-route">Vertex route line</div>
        </div>
      </div>
    </section>
  )
}
