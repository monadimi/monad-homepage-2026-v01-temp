// 지원하기 클릭 시 재생되는 "모나드행 티켓" 전환 연출 컴포넌트입니다.
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import { text } from '../../../../content/text/textService'
import styles from './ApplyTicketTransition.module.css'

type TransitionStage = 'ticket' | 'tear' | 'warp'
type WarpSpeed = 'slow' | 'medium' | 'fast'

interface ApplyTicketTransitionProps {
  onComplete: () => void
}

interface StarConfig {
  id: number
  tx: string
  ty: string
  duration: string
  delay: string
  size: string
  opacity: string
}

interface StreakConfig {
  id: number
  tx: string
  ty: string
  angle: string
  duration: string
  delay: string
  width: string
  length: string
  opacity: string
}

const TEAR_STAGE_MS = 760
const WARP_STAGE_MS = 1650
const STAR_COUNT = 148
const STREAK_COUNT = 56
const MAX_DRAG_DISTANCE = 130
const TEAR_TRIGGER_DISTANCE = 82

function createStarConfig(id: number): StarConfig {
  const angle = Math.random() * Math.PI * 2
  const distance = 260 + Math.random() * 860
  const tx = Math.cos(angle) * distance
  const ty = Math.sin(angle) * distance

  return {
    id,
    tx: `${tx.toFixed(2)}px`,
    ty: `${ty.toFixed(2)}px`,
    duration: `${(1 + Math.random() * 0.8).toFixed(2)}s`,
    delay: `${(Math.random() * 0.8).toFixed(2)}s`,
    size: `${(1.4 + Math.random() * 2).toFixed(2)}px`,
    opacity: `${(0.35 + Math.random() * 0.65).toFixed(3)}`,
  }
}

function createStreakConfig(id: number): StreakConfig {
  const angle = Math.random() * Math.PI * 2
  const distance = 360 + Math.random() * 1200
  const tx = Math.cos(angle) * distance
  const ty = Math.sin(angle) * distance
  const angleDeg = (angle * 180) / Math.PI

  return {
    id,
    tx: `${tx.toFixed(2)}px`,
    ty: `${ty.toFixed(2)}px`,
    angle: `${(angleDeg + 90).toFixed(2)}deg`,
    duration: `${(0.7 + Math.random() * 0.8).toFixed(2)}s`,
    delay: `${(Math.random() * 0.72).toFixed(2)}s`,
    width: `${(1.2 + Math.random() * 1.7).toFixed(2)}px`,
    length: `${(18 + Math.random() * 44).toFixed(2)}px`,
    opacity: `${(0.3 + Math.random() * 0.5).toFixed(3)}`,
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export const ApplyTicketTransition = memo(function ApplyTicketTransition({
  onComplete,
}: ApplyTicketTransitionProps) {
  const [stage, setStage] = useState<TransitionStage>('ticket')
  const [warpSpeed, setWarpSpeed] = useState<WarpSpeed>('slow')
  const [dragDistance, setDragDistance] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const stars = useMemo(() => {
    return Array.from({ length: STAR_COUNT }, (_, index) => createStarConfig(index))
  }, [])

  const streaks = useMemo(() => {
    return Array.from({ length: STREAK_COUNT }, (_, index) => createStreakConfig(index))
  }, [])

  const timersRef = useRef<number[]>([])
  const dragStartYRef = useRef<number | null>(null)
  const activePointerIdRef = useRef<number | null>(null)
  const hasTornRef = useRef(false)

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timerId) => {
      window.clearTimeout(timerId)
    })
    timersRef.current = []
  }, [])

  useEffect(() => {
    return () => {
      clearTimers()
    }
  }, [clearTimers])

  const startWarpSequence = useCallback(() => {
    clearTimers()

    timersRef.current.push(
      window.setTimeout(() => {
        setWarpSpeed('slow')
        setStage('warp')
      }, TEAR_STAGE_MS),
      window.setTimeout(() => {
        setWarpSpeed('medium')
      }, TEAR_STAGE_MS + 420),
      window.setTimeout(() => {
        setWarpSpeed('fast')
      }, TEAR_STAGE_MS + 860),
      window.setTimeout(() => {
        onComplete()
      }, TEAR_STAGE_MS + WARP_STAGE_MS),
    )
  }, [clearTimers, onComplete])

  const triggerTear = useCallback(() => {
    if (hasTornRef.current || stage !== 'ticket') {
      return
    }

    hasTornRef.current = true
    setIsDragging(false)
    setDragDistance(TEAR_TRIGGER_DISTANCE)
    setStage('tear')
    startWarpSequence()
  }, [stage, startWarpSequence])

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (stage !== 'ticket' || hasTornRef.current) {
        return
      }

      activePointerIdRef.current = event.pointerId
      dragStartYRef.current = event.clientY - dragDistance
      setIsDragging(true)
      event.currentTarget.setPointerCapture(event.pointerId)
    },
    [dragDistance, stage],
  )

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!isDragging || hasTornRef.current) {
        return
      }

      if (event.pointerId !== activePointerIdRef.current) {
        return
      }

      const dragStartY = dragStartYRef.current
      if (dragStartY === null) {
        return
      }

      const nextDistance = clamp(event.clientY - dragStartY, 0, MAX_DRAG_DISTANCE)
      setDragDistance(nextDistance)

      if (nextDistance >= TEAR_TRIGGER_DISTANCE) {
        triggerTear()
      }
    },
    [isDragging, triggerTear],
  )

  const handlePointerEnd = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerId !== activePointerIdRef.current) {
      return
    }

    activePointerIdRef.current = null
    dragStartYRef.current = null

    if (hasTornRef.current) {
      return
    }

    setIsDragging(false)
    setDragDistance(0)
  }, [])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        triggerTear()
      }
    },
    [triggerTear],
  )

  const tearProgress = clamp(dragDistance / TEAR_TRIGGER_DISTANCE, 0, 1)
  const airlineName = text('monad2026', 'ticket.airlineName', 'MONAD AIR')
  const boardingPassText = text('monad2026', 'ticket.boardingPassText', 'BOARDING PASS')
  const routeFromCode = text('monad2026', 'ticket.route.fromCode', 'NOW')
  const routeFromCity = text('monad2026', 'ticket.route.fromCity', '현재')
  const routeToCode = text('monad2026', 'ticket.route.toCode', 'MON')
  const routeToCity = text('monad2026', 'ticket.route.toCity', 'MONAD')
  const flightInfo = text('monad2026', 'ticket.info.flight', 'MN-2026')
  const dateInfo = text('monad2026', 'ticket.info.date', '2026.03.01')
  const zoneInfo = text('monad2026', 'ticket.info.zone', 'A')
  const stampText = text('monad2026', 'ticket.bottom.stamp', 'GATE 7 · BOARD 20:26')
  const seatText = text('monad2026', 'ticket.bottom.seat', '01A')
  const dragHintDefault = text(
    'monad2026',
    'ticket.dragHint.default',
    '아래로 드래그해서 절취선을 뜯으세요',
  )
  const dragHintReady = text('monad2026', 'ticket.dragHint.ready', '이제 놓으면 뜯깁니다')
  const ticketCode = text(
    'monad2026',
    'ticket.code',
    'PAX YOU · MONAD-2026-BOARDING',
  )

  const ticketStyle = {
    '--ticket-top-offset': `${(-tearProgress * 20).toFixed(2)}px`,
    '--ticket-bottom-offset': `${dragDistance.toFixed(2)}px`,
    '--ticket-bottom-rotate': `${(tearProgress * 6.8).toFixed(2)}deg`,
    '--hint-opacity': `${(1 - tearProgress * 0.72).toFixed(3)}`,
  } as CSSProperties

  const warpSpeedClassName =
    warpSpeed === 'fast'
      ? styles.warpFast
      : warpSpeed === 'medium'
        ? styles.warpMedium
        : styles.warpSlow

  return (
    <div className={styles.overlay} aria-hidden="true">
      <div className={styles.backdrop} />

      <div
        className={`${styles.ticketScene} ${stage !== 'ticket' ? styles.ticketSceneHidden : ''}`.trim()}
      >
        <article className={`${styles.ticket} ${isDragging ? styles.ticketDragging : ''}`.trim()} style={ticketStyle}>
          <span className={styles.ticketNotchLeft} />
          <span className={styles.ticketNotchRight} />

          <div className={styles.ticketTopHalf}>
            <div className={styles.ticketHeaderRow}>
              <p className={styles.airlineName}>{airlineName}</p>
              <p className={styles.boardingPassText}>{boardingPassText}</p>
            </div>

            <div className={styles.routeRow}>
              <div className={styles.routeCol}>
                <p className={styles.routeCode}>{routeFromCode}</p>
                <p className={styles.routeCity}>{routeFromCity}</p>
              </div>
              <span className={styles.routeArrow} aria-hidden="true">
                ✈
              </span>
              <div className={styles.routeCol}>
                <p className={styles.routeCode}>{routeToCode}</p>
                <p className={styles.routeCity}>{routeToCity}</p>
              </div>
            </div>

            <div className={styles.infoGrid}>
              <span className={styles.infoItem}>
                <b>FLIGHT</b> {flightInfo}
              </span>
              <span className={styles.infoItem}>
                <b>DATE</b> {dateInfo}
              </span>
              <span className={styles.infoItem}>
                <b>ZONE</b> {zoneInfo}
              </span>
            </div>
          </div>

          <div className={styles.perforationLine} aria-hidden="true" />

          <div
            className={styles.ticketBottomHalf}
            role="button"
            tabIndex={0}
            aria-label="티켓을 아래로 당겨 뜯기"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            onKeyDown={handleKeyDown}
          >
            <div className={styles.bottomTopRow}>
              <span className={styles.stamp}>{stampText}</span>
              <span className={styles.seatBadge}>{seatText}</span>
            </div>
            <p className={styles.dragHint}>
              {tearProgress >= 0.82 ? dragHintReady : dragHintDefault}
            </p>
            <div className={styles.barcode} aria-hidden="true" />
            <p className={styles.ticketCode}>{ticketCode}</p>
          </div>
        </article>
      </div>

      <div className={`${styles.tornParts} ${stage === 'ticket' ? styles.tornPartsHidden : ''}`.trim()}>
        <div
          className={`${styles.ticketPart} ${styles.ticketPartTop} ${
            stage === 'warp' ? styles.ticketPartLeaveTop : ''
          }`.trim()}
        >
          <span className={styles.partShadow} />
        </div>
        <div
          className={`${styles.ticketPart} ${styles.ticketPartBottom} ${
            stage === 'warp' ? styles.ticketPartLeaveBottom : ''
          }`.trim()}
        >
          <span className={styles.partShadow} />
        </div>
      </div>

      <div
        className={`${styles.warpLayer} ${stage === 'warp' ? styles.warpLayerVisible : ''} ${warpSpeedClassName}`.trim()}
      >
        <div className={styles.warpVignette} />
        <div className={styles.warpCoreGlow} />
        <div className={styles.warpRingTrack} aria-hidden="true">
          <span className={styles.warpRing} />
          <span className={styles.warpRing} />
          <span className={styles.warpRing} />
          <span className={styles.warpRing} />
        </div>

        {streaks.map((streak) => {
          const style = {
            '--tx': streak.tx,
            '--ty': streak.ty,
            '--angle': streak.angle,
            '--dur': streak.duration,
            '--delay': streak.delay,
            '--streak-width': streak.width,
            '--streak-length': streak.length,
            '--particle-opacity': streak.opacity,
          } as CSSProperties

          return <span key={`streak-${streak.id}`} className={styles.streak} style={style} />
        })}

        {stars.map((star) => {
          const style = {
            '--tx': star.tx,
            '--ty': star.ty,
            '--dur': star.duration,
            '--delay': star.delay,
            '--size': star.size,
            '--particle-opacity': star.opacity,
          } as CSSProperties

          return <span key={star.id} className={styles.star} style={style} />
        })}
      </div>
    </div>
  )
})
