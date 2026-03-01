// 배경 비디오 렌더링 공통 컴포넌트입니다.
import { memo } from 'react'
import styles from './VideoBackground.module.css'

interface VideoBackgroundProps {
  src: string
  ariaLabel: string
}

export const VideoBackground = memo(function VideoBackground({
  src,
  ariaLabel,
}: VideoBackgroundProps) {
  return (
    <div className={styles.wrapper} aria-label={ariaLabel}>
      <video
        className={styles.video}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
    </div>
  )
})
