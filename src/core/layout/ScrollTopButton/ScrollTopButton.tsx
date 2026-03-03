import { memo, useEffect, useState } from 'react'
import { text } from '../../../content/text/textService'
import styles from './ScrollTopButton.module.css'

const SHOW_THRESHOLD_PX = 220

// 우측 하단 고정 '맨 위로' 버튼입니다.
export const ScrollTopButton = memo(function ScrollTopButton() {
  const [isVisible, setIsVisible] = useState(false)
  const ariaLabel = text('global', 'scrollTop.ariaLabel', '맨 위로 이동')
  const tooltipTitle = text('global', 'scrollTop.title', '맨 위로')

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > SHOW_THRESHOLD_PX)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      className={`${styles.scrollTopButton} ${isVisible ? styles.visible : ''}`.trim()}
      onClick={handleClick}
      aria-label={ariaLabel}
      title={tooltipTitle}
    >
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M12 5.5L4.5 13M12 5.5L19.5 13M12 5.5V20"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
})
