// 랜딩 상단 Hero 비디오 섹션입니다.
import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import heroVideo from '../../../../assets/hero.mp4'
import styles from './HeroSection.module.css'

const JS_DOS_SCRIPT_URL = '/js-dos/js-dos.js'
const JS_DOS_STYLE_URL = '/js-dos/js-dos.css'
const DOOM_BUNDLE_URL = '/doom.jsdos'

type HeroMode = 'idle' | 'loading' | 'running' | 'error'

interface JsDosPlayer {
  exit?: () => Promise<void> | void
  stop?: () => Promise<void> | void
}

interface JsDosOptions {
  backend?: string
  url: string
  autoStart?: boolean
  background?: string
  kiosk?: boolean
  mouseCapture?: boolean
  noCloud?: boolean
  noNetworking?: boolean
  pathPrefix?: string
  renderAspect?: string
  theme?: string
  workerThread?: boolean
}

type JsDosFactory = (
  element: HTMLElement,
  options: JsDosOptions,
) => JsDosPlayer | Promise<JsDosPlayer>

declare global {
  interface Window {
    Dos?: JsDosFactory
  }
}

let jsDosAssetsPromise: Promise<void> | null = null

function ensureJsDosAssets(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('js-dos can only load in a browser environment'))
  }

  if (window.Dos) {
    return Promise.resolve()
  }

  if (jsDosAssetsPromise) {
    return jsDosAssetsPromise
  }

  jsDosAssetsPromise = new Promise((resolve, reject) => {
    if (!document.querySelector('link[data-js-dos-styles="true"]')) {
      const stylesheet = document.createElement('link')
      stylesheet.rel = 'stylesheet'
      stylesheet.href = JS_DOS_STYLE_URL
      stylesheet.dataset.jsDosStyles = 'true'
      document.head.appendChild(stylesheet)
    }

    const existingScript = document.querySelector(
      'script[data-js-dos-script="true"]',
    ) as HTMLScriptElement | null

    const handleReady = () => {
      if (window.Dos) {
        resolve()
        return
      }

      reject(new Error('js-dos script loaded but window.Dos is unavailable'))
    }

    const handleError = () => {
      jsDosAssetsPromise = null
      reject(new Error('Failed to load js-dos assets'))
    }

    if (existingScript) {
      existingScript.addEventListener('load', handleReady, { once: true })
      existingScript.addEventListener('error', handleError, { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = JS_DOS_SCRIPT_URL
    script.async = true
    script.dataset.jsDosScript = 'true'
    script.addEventListener('load', handleReady, { once: true })
    script.addEventListener('error', handleError, { once: true })
    document.body.appendChild(script)
  })

  return jsDosAssetsPromise
}

export const HeroSection = memo(function HeroSection() {
  const playerHostRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<JsDosPlayer | null>(null)
  const [mode, setMode] = useState<HeroMode>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const focusPlayerSurface = useCallback(() => {
    const host = playerHostRef.current

    if (!host) {
      return
    }

    host.focus()

    const focusableTarget = host.querySelector(
      'canvas, iframe, [tabindex]',
    ) as HTMLElement | null

    if (!focusableTarget) {
      return
    }

    if (!focusableTarget.hasAttribute('tabindex')) {
      focusableTarget.setAttribute('tabindex', '0')
    }

    focusableTarget.focus()
  }, [])

  const launchDoom = useCallback(async () => {
    if (mode === 'loading') {
      return
    }

    if (mode === 'running') {
      focusPlayerSurface()
      return
    }

    const host = playerHostRef.current

    if (!host) {
      return
    }

    setMode('loading')
    setErrorMessage('')

    try {
      await ensureJsDosAssets()

      if (!window.Dos) {
        throw new Error('window.Dos is not available')
      }

      host.innerHTML = ''

      const maybePlayer = window.Dos(host, {
        backend: 'dosboxX',
        url: DOOM_BUNDLE_URL,
        autoStart: true,
        background: '#000000',
        kiosk: true,
        mouseCapture: false,
        noCloud: true,
        noNetworking: true,
        pathPrefix: '/js-dos/emulators/',
        renderAspect: 'Fit',
        theme: 'dark',
        workerThread: true,
      })

      playerRef.current = await Promise.resolve(maybePlayer)
      setMode('running')
      window.setTimeout(focusPlayerSurface, 300)
      window.setTimeout(focusPlayerSurface, 1200)
    } catch (error) {
      console.error(error)
      setErrorMessage('DOOM 실행에 실패했습니다. 다시 클릭해 주세요.')
      setMode('error')
    }
  }, [focusPlayerSurface, mode])

  useEffect(() => {
    return () => {
      const player = playerRef.current
      playerRef.current = null

      if (player && typeof player.stop === 'function') {
        void Promise.resolve(player.stop()).catch(() => {})
      } else if (player && typeof player.exit === 'function') {
        void Promise.resolve(player.exit()).catch(() => {})
      }
    }
  }, [])

  return (
    <section className={styles.section} aria-label="Monad hero">
      <div
        className={styles.playerSurface}
        onClick={() => {
          void launchDoom()
        }}
        onKeyDown={(event) => {
          if (event.key !== 'Enter' && event.key !== ' ') {
            return
          }

          event.preventDefault()
          void launchDoom()
        }}
        role={mode === 'running' ? 'application' : 'button'}
        tabIndex={0}
        aria-label={
          mode === 'running'
            ? 'DOOM player in MONAD hero area'
            : 'Click to launch DOOM in the MONAD hero area'
        }
      >
        {mode !== 'running' ? (
          <video
            className={styles.heroVideo}
            src={heroVideo}
            autoPlay
            muted
            playsInline
            preload="metadata"
            aria-label="Monad hero video"
          />
        ) : null}

        <div
          ref={playerHostRef}
          className={`${styles.doomHost} ${mode === 'running' ? styles.doomHostActive : ''}`.trim()}
        />

        {mode === 'running' ? (
          <button
            type="button"
            className={styles.focusButton}
            onClick={(event) => {
              event.stopPropagation()
              focusPlayerSurface()
            }}
          >
            입력 포커스
          </button>
        ) : null}

        {mode === 'loading' ? (
          <div className={styles.statusOverlay}>Loading DOOM…</div>
        ) : null}

        {mode === 'error' ? (
          <div className={styles.statusOverlay}>{errorMessage}</div>
        ) : null}
      </div>
    </section>
  )
})
