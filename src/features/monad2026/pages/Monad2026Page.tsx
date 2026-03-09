// MONAD 2026 페이지를 조립하는 루트 컴포넌트입니다.
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Hero2026Section } from '../sections/Hero2026Section/Hero2026Section'
import { ITIntroSection } from '../sections/ITIntroSection/ITIntroSection'
import { SwAiIntroSection } from '../sections/SwAiIntroSection/SwAiIntroSection'
import { ProofSection } from '../sections/ProofSection/ProofSection'
import { EducationSection } from '../sections/EducationSection/EducationSection'
import { CycleDynamicSection } from '../sections/CycleDynamicSection/CycleDynamicSection'
import { ActivitySection } from '../sections/ActivitySection/ActivitySection'
import { JoinEndSection } from '../sections/JoinEndSection/JoinEndSection'
import { FaqSection } from '../sections/FaqSection/FaqSection'
// import { ApplyTicketTransition } from '../components/ApplyTicketTransition/ApplyTicketTransition'
import { cycleItems } from '../data/cycleData'
import styles from './Monad2026Page.module.css'

const DESKTOP_MEDIA_QUERY = '(min-width: 1101px)'
const MOBILE_MEDIA_QUERY = '(max-width: 1100px)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

const HIJACK_LOCK_MS = 720
const CYCLE_STEP_LOCK_MS = 420
const MOBILE_CYCLE_INTERVAL_MS = 3200
const WHEEL_DELTA_THRESHOLD = 92
const WHEEL_IDLE_RESET_MS = 160
const PANE_SCALE_MIN = 0.74
const PANE_SCALE_MAX = 1
const INTRO_SPLIT_MIN_WIDTH = 1500
const INTRO_SPLIT_MIN_HEIGHT = 920
const CYCLE_LAST_INDEX = cycleItems.length - 1
const APPLY_REDIRECT_URL = 'https://mnad.im/apply'
// const APPLY_REDIRECT_URL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export const Monad2026Page = memo(function Monad2026Page() {
  const pageRef = useRef<HTMLElement>(null)
  const scrollUnlockTimerRef = useRef<number | null>(null)
  const wheelResetTimerRef = useRef<number | null>(null)
  const isTransitioningRef = useRef(false)
  const activeCycleIndexRef = useRef(0)
  const wheelDeltaAccumulatorRef = useRef(0)

  const [isDesktopHijackEnabled, setIsDesktopHijackEnabled] = useState(false)
  const [isMobileViewport, setIsMobileViewport] = useState(false)
  const [isIntroSplitDesktop, setIsIntroSplitDesktop] = useState(false)
  const [activePaneIndex, setActivePaneIndex] = useState(0)
  const [activeCycleIndex, setActiveCycleIndex] = useState(0)
  // const [isApplyTransitionOpen, setIsApplyTransitionOpen] = useState(false)

  const shouldSplitIntroForDesktop = isDesktopHijackEnabled && isIntroSplitDesktop

  const desktopPaneIndexes = useMemo(() => {
    const introFirst = 1
    const introSecond = shouldSplitIntroForDesktop ? 2 : null
    const proof = shouldSplitIntroForDesktop ? 3 : 2
    const education = proof + 1
    const cycle = education + 1
    const activity = cycle + 1
    const join = activity + 1

    return {
      introFirst,
      introSecond,
      proof,
      education,
      cycle,
      activity,
      join,
    } as const
  }, [shouldSplitIntroForDesktop])

  useEffect(() => {
    activeCycleIndexRef.current = activeCycleIndex
  }, [activeCycleIndex])

  const lockHijackTransition = useCallback((durationMs: number) => {
    isTransitioningRef.current = true

    if (scrollUnlockTimerRef.current !== null) {
      window.clearTimeout(scrollUnlockTimerRef.current)
    }

    scrollUnlockTimerRef.current = window.setTimeout(() => {
      isTransitioningRef.current = false
    }, durationMs)
  }, [])

  const resetWheelAccumulator = useCallback(() => {
    wheelDeltaAccumulatorRef.current = 0
    if (wheelResetTimerRef.current !== null) {
      window.clearTimeout(wheelResetTimerRef.current)
      wheelResetTimerRef.current = null
    }
  }, [])

  const getPanes = useCallback(() => {
    return Array.from(
      pageRef.current?.querySelectorAll<HTMLElement>('[data-hijack-pane]') ?? [],
    )
  }, [])

  const getNearestPaneIndex = useCallback((panes: HTMLElement[]) => {
    if (panes.length === 0) {
      return 0
    }

    const anchorY = window.scrollY + window.innerHeight * 0.35
    let nearestIndex = 0

    panes.forEach((pane, index) => {
      if (pane.offsetTop <= anchorY) {
        nearestIndex = index
      }
    })

    return clamp(nearestIndex, 0, panes.length - 1)
  }, [])

  const scrollToPane = useCallback(
    (targetIndex: number, panes: HTMLElement[]) => {
      const boundedIndex = clamp(targetIndex, 0, desktopPaneIndexes.join)
      const targetPane = panes[boundedIndex]
      if (!targetPane) {
        return
      }

      setActivePaneIndex(boundedIndex)
      lockHijackTransition(HIJACK_LOCK_MS)
      window.scrollTo({ top: targetPane.offsetTop, behavior: 'smooth' })
    },
    [desktopPaneIndexes.join, lockHijackTransition],
  )

  const consumeDesktopHijackStep = useCallback(
    (direction: 1 | -1, panes: HTMLElement[]) => {
      if (panes.length === 0) {
        return false
      }

      const currentIndex = getNearestPaneIndex(panes)
      const joinPaneTop =
        panes[desktopPaneIndexes.join]?.offsetTop ?? Number.POSITIVE_INFINITY
      const inHijackZone = window.scrollY <= joinPaneTop + 2

      // Join us 이후(Faq/푸터)는 자연 스크롤로 동작합니다.
      if (!inHijackZone) {
        return false
      }

      const currentCycleIndex = activeCycleIndexRef.current
      const cyclePaneTop =
        panes[desktopPaneIndexes.cycle]?.offsetTop ?? Number.POSITIVE_INFINITY
      const afterCyclePaneTop =
        panes[desktopPaneIndexes.cycle + 1]?.offsetTop ?? Number.POSITIVE_INFINITY
      const isInsideCyclePane =
        window.scrollY >= cyclePaneTop - 2 && window.scrollY < afterCyclePaneTop - 2
      const canMoveCycleInner =
        (direction > 0 && currentCycleIndex < CYCLE_LAST_INDEX) ||
        (direction < 0 && currentCycleIndex > 0)

      // 사이클 섹션에서는 페이지 전환 대신 텍스트/카드만 순환시킵니다.
      if ((currentIndex === desktopPaneIndexes.cycle || isInsideCyclePane) && canMoveCycleInner) {
        // 트랙패드 관성 스크롤로 인한 미세 이동을 막기 위해 섹션 시작점에 고정합니다.
        if (Number.isFinite(cyclePaneTop) && Math.abs(window.scrollY - cyclePaneTop) > 1) {
          window.scrollTo({ top: cyclePaneTop, behavior: 'auto' })
        }

        if (direction > 0) {
          if (isTransitioningRef.current) {
            return true
          }
          setActivePaneIndex(desktopPaneIndexes.cycle)
          setActiveCycleIndex((previous) => clamp(previous + 1, 0, CYCLE_LAST_INDEX))
          lockHijackTransition(CYCLE_STEP_LOCK_MS)
          return true
        }

        if (direction < 0) {
          if (isTransitioningRef.current) {
            return true
          }
          setActivePaneIndex(desktopPaneIndexes.cycle)
          setActiveCycleIndex((previous) => clamp(previous - 1, 0, CYCLE_LAST_INDEX))
          lockHijackTransition(CYCLE_STEP_LOCK_MS)
          return true
        }
      }

      if (direction > 0 && currentIndex >= desktopPaneIndexes.join) {
        return false
      }

      const nextIndex = clamp(currentIndex + direction, 0, desktopPaneIndexes.join)
      if (nextIndex === currentIndex) {
        return false
      }

      if (isTransitioningRef.current) {
        return true
      }

      if (nextIndex === desktopPaneIndexes.cycle) {
        setActiveCycleIndex(direction > 0 ? 0 : CYCLE_LAST_INDEX)
      }

      scrollToPane(nextIndex, panes)
      return true
    },
    [desktopPaneIndexes, getNearestPaneIndex, lockHijackTransition, scrollToPane],
  )

  useEffect(() => {
    const desktopQuery = window.matchMedia(DESKTOP_MEDIA_QUERY)
    const mobileQuery = window.matchMedia(MOBILE_MEDIA_QUERY)
    const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY)

    const handleMediaQueryChange = () => {
      setIsDesktopHijackEnabled(desktopQuery.matches && !reducedMotionQuery.matches)
      setIsMobileViewport(mobileQuery.matches)
    }

    handleMediaQueryChange()
    desktopQuery.addEventListener('change', handleMediaQueryChange)
    mobileQuery.addEventListener('change', handleMediaQueryChange)
    reducedMotionQuery.addEventListener('change', handleMediaQueryChange)

    return () => {
      desktopQuery.removeEventListener('change', handleMediaQueryChange)
      mobileQuery.removeEventListener('change', handleMediaQueryChange)
      reducedMotionQuery.removeEventListener('change', handleMediaQueryChange)
    }
  }, [])

  useEffect(() => {
    if (!isMobileViewport) {
      return
    }

    const intervalId = window.setInterval(() => {
      setActiveCycleIndex((previous) => (previous + 1) % cycleItems.length)
    }, MOBILE_CYCLE_INTERVAL_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [isMobileViewport])

  useEffect(() => {
    const evaluateIntroSplit = () => {
      const viewportWidth = window.visualViewport?.width ?? window.innerWidth
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight

      // 화면/확대 비율에 따라 intro를 1페이지(통합) 또는 2페이지(분리)로 전환합니다.
      setIsIntroSplitDesktop(
        viewportWidth < INTRO_SPLIT_MIN_WIDTH || viewportHeight < INTRO_SPLIT_MIN_HEIGHT,
      )
    }

    evaluateIntroSplit()
    window.addEventListener('resize', evaluateIntroSplit)
    window.visualViewport?.addEventListener('resize', evaluateIntroSplit)

    return () => {
      window.removeEventListener('resize', evaluateIntroSplit)
      window.visualViewport?.removeEventListener('resize', evaluateIntroSplit)
    }
  }, [])

  useEffect(() => {
    if (!isDesktopHijackEnabled) {
      isTransitioningRef.current = false
      return
    }

    const initialSyncFrameId = window.requestAnimationFrame(() => {
      const panes = getPanes()
      if (panes.length === 0) {
        return
      }
      setActivePaneIndex(getNearestPaneIndex(panes))
    })

    const handleScroll = () => {
      const panes = getPanes()
      if (panes.length === 0) {
        return
      }
      setActivePaneIndex(getNearestPaneIndex(panes))
    }

    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY === 0) {
        return
      }

      const panes = getPanes()
      if (panes.length === 0) {
        return
      }

      const currentIndex = getNearestPaneIndex(panes)
      const joinPaneTop =
        panes[desktopPaneIndexes.join]?.offsetTop ?? Number.POSITIVE_INFINITY
      const inHijackZone = window.scrollY <= joinPaneTop + 2
      if (!inHijackZone) {
        resetWheelAccumulator()
        return
      }

      // Join us 아래로 내려가는 스크롤은 자연 스크롤을 허용합니다.
      if (event.deltaY > 0 && currentIndex >= desktopPaneIndexes.join) {
        resetWheelAccumulator()
        return
      }

      event.preventDefault()

      if (isTransitioningRef.current) {
        return
      }

      wheelDeltaAccumulatorRef.current += event.deltaY

      if (wheelResetTimerRef.current !== null) {
        window.clearTimeout(wheelResetTimerRef.current)
      }

      wheelResetTimerRef.current = window.setTimeout(() => {
        wheelDeltaAccumulatorRef.current = 0
      }, WHEEL_IDLE_RESET_MS)

      if (Math.abs(wheelDeltaAccumulatorRef.current) < WHEEL_DELTA_THRESHOLD) {
        return
      }

      const direction: 1 | -1 = wheelDeltaAccumulatorRef.current > 0 ? 1 : -1
      resetWheelAccumulator()
      consumeDesktopHijackStep(direction, panes)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      resetWheelAccumulator()

      const targetElement = event.target as HTMLElement | null
      if (
        targetElement &&
        ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(targetElement.tagName)
      ) {
        return
      }

      let direction: 1 | -1 | null = null
      if (event.key === 'ArrowDown' || event.key === 'PageDown') {
        direction = 1
      } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
        direction = -1
      } else if (event.key === ' ') {
        direction = event.shiftKey ? -1 : 1
      }

      if (direction === null) {
        return
      }

      const panes = getPanes()
      const didConsume = consumeDesktopHijackStep(direction, panes)
      if (didConsume) {
        event.preventDefault()
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.cancelAnimationFrame(initialSyncFrameId)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
      resetWheelAccumulator()
    }
  }, [
    consumeDesktopHijackStep,
    desktopPaneIndexes.join,
    getNearestPaneIndex,
    getPanes,
    isDesktopHijackEnabled,
    resetWheelAccumulator,
  ])

  useEffect(() => {
    return () => {
      if (scrollUnlockTimerRef.current !== null) {
        window.clearTimeout(scrollUnlockTimerRef.current)
      }
      if (wheelResetTimerRef.current !== null) {
        window.clearTimeout(wheelResetTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const pageElement = pageRef.current
    if (!pageElement) {
      return
    }

    let frameId: number | null = null

    const applyPaneFitScale = () => {
      const paneCenters = Array.from(
        pageElement.querySelectorAll<HTMLElement>('[data-pane-center]'),
      )

      paneCenters.forEach((paneCenter) => {
        const paneContent = paneCenter.firstElementChild as HTMLElement | null
        if (
          !paneContent ||
          !isDesktopHijackEnabled ||
          paneCenter.hasAttribute('data-no-fit-scale')
        ) {
          paneCenter.style.setProperty('--pane-fit-scale', '1')
          return
        }

        const availableWidth = Math.max(paneCenter.clientWidth - 8, 1)
        const availableHeight = Math.max(paneCenter.clientHeight - 8, 1)
        const contentWidth = Math.max(paneContent.scrollWidth, 1)
        const contentHeight = Math.max(paneContent.scrollHeight, 1)

        const widthScale = availableWidth / contentWidth
        const heightScale = availableHeight / contentHeight
        const fittedScale = clamp(
          Math.min(widthScale, heightScale, PANE_SCALE_MAX),
          PANE_SCALE_MIN,
          PANE_SCALE_MAX,
        )

        paneCenter.style.setProperty('--pane-fit-scale', `${fittedScale}`)
      })
    }

    const requestApply = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId)
      }
      frameId = window.requestAnimationFrame(applyPaneFitScale)
    }

    requestApply()

    window.addEventListener('resize', requestApply)
    window.visualViewport?.addEventListener('resize', requestApply)

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId)
      }
      window.removeEventListener('resize', requestApply)
      window.visualViewport?.removeEventListener('resize', requestApply)
    }
  }, [activeCycleIndex, isDesktopHijackEnabled, shouldSplitIntroForDesktop])

  const getPaneClassName = useCallback(
    (index: number) => {
      const activeClassName =
        !isDesktopHijackEnabled || index === activePaneIndex ? styles.hijackPaneActive : ''
      return `${styles.hijackPane} ${activeClassName}`.trim()
    },
    [activePaneIndex, isDesktopHijackEnabled],
  )

  // 현재는 티켓 연출 대신 외부 지원 링크로 바로 이동합니다.
  const handleApplyClick = useCallback(() => {
    window.location.assign(APPLY_REDIRECT_URL)
  }, [])

  // const handleApplyTransitionComplete = useCallback(() => {
  //   setIsApplyTransitionOpen(false)
  //   window.location.assign(APPLY_REDIRECT_URL)
  // }, [])

  const activityPaneIndex = isDesktopHijackEnabled ? desktopPaneIndexes.activity : 5
  const joinPaneIndex = isDesktopHijackEnabled ? desktopPaneIndexes.join : 6

  return (
    <article
      ref={pageRef}
      className={`${styles.page} ${!isDesktopHijackEnabled ? styles.pageNoHijack : ''}`.trim()}
    >
      <div className={styles.pageInner}>
        <div className={getPaneClassName(0)} data-hijack-pane>
          <div
            className={`${styles.paneCenter} ${styles.fullBleedPaneCenter}`}
            data-pane-center
            data-no-fit-scale
          >
            <div className={`${styles.paneFxLayer} ${styles.paneFxLayerHero} ${styles.paneFxLayerFullBleed}`}>
              <Hero2026Section onApplyClick={handleApplyClick} />
            </div>
          </div>
        </div>

        {isDesktopHijackEnabled && shouldSplitIntroForDesktop ? (
          <>
            <div
              className={`${getPaneClassName(desktopPaneIndexes.introFirst)} ${styles.introPane}`}
              data-hijack-pane
            >
              <div className={styles.paneCenter} data-pane-center>
                <div className={`${styles.paneFxLayer} ${styles.paneFxLayerDockRight}`}>
                  <ITIntroSection dock="right" />
                </div>
              </div>
            </div>

            <div
              className={`${getPaneClassName(desktopPaneIndexes.introSecond ?? 2)} ${styles.introPane}`}
              data-hijack-pane
            >
              <div className={styles.paneCenter} data-pane-center>
                <div className={`${styles.paneFxLayer} ${styles.paneFxLayerDockLeft}`}>
                  <SwAiIntroSection dock="left" />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className={`${getPaneClassName(1)} ${styles.introPane}`} data-hijack-pane>
            <div className={styles.paneCenter} data-pane-center>
              <div className={styles.introStack}>
                <div className={`${styles.paneFxLayer} ${styles.paneFxLayerDockRight}`}>
                  <ITIntroSection dock="right" />
                </div>
                <div className={`${styles.paneFxLayer} ${styles.paneFxLayerDockLeft}`}>
                  <SwAiIntroSection dock="left" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={getPaneClassName(desktopPaneIndexes.proof)} data-hijack-pane>
          <div className={styles.paneCenter} data-pane-center>
            <div className={styles.paneFxLayer}>
              <ProofSection />
            </div>
          </div>
        </div>

        <div className={getPaneClassName(desktopPaneIndexes.education)} data-hijack-pane>
          <div className={styles.paneCenter} data-pane-center>
            <div className={styles.paneFxLayer}>
              <EducationSection />
            </div>
          </div>
        </div>

        {isDesktopHijackEnabled ? (
          <div className={getPaneClassName(desktopPaneIndexes.cycle)} data-hijack-pane>
            <div className={styles.paneCenter} data-pane-center>
              <div className={`${styles.paneFxLayer} ${styles.paneFxLayerCycle}`}>
                <CycleDynamicSection activeIndex={activeCycleIndex} />
              </div>
            </div>
          </div>
        ) : (
          <div className={getPaneClassName(4)} data-hijack-pane>
            <div className={styles.paneCenter} data-pane-center>
              <div className={`${styles.paneFxLayer} ${styles.paneFxLayerCycle}`}>
                <CycleDynamicSection activeIndex={activeCycleIndex} />
              </div>
            </div>
          </div>
        )}

        <div className={getPaneClassName(activityPaneIndex)} data-hijack-pane>
          <div className={styles.paneCenter} data-pane-center>
            <div className={styles.paneFxLayer}>
              <ActivitySection />
            </div>
          </div>
        </div>

        <div className={getPaneClassName(joinPaneIndex)} data-hijack-pane>
          <div
            className={`${styles.paneCenter} ${styles.fullBleedPaneCenter}`}
            data-pane-center
            data-no-fit-scale
          >
            <div className={`${styles.paneFxLayer} ${styles.paneFxLayerFullBleed}`}>
              <JoinEndSection onApplyClick={handleApplyClick} />
            </div>
          </div>
        </div>

        <FaqSection />
      </div>

      {/* 지원하기 클릭 시 티켓/별 전환 연출은 코드만 유지하고 현재는 연결 해제 상태입니다. */}
      {/* {isApplyTransitionOpen ? (
        <ApplyTicketTransition onComplete={handleApplyTransitionComplete} />
      ) : null} */}
    </article>
  )
})
