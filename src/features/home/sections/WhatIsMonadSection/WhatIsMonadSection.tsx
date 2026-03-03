// "what is MONAD?" 섹션을 Figma 기준 3열/5행 그리드로 구성합니다.
// 상/하단 레일 SVG, 중앙 로고, 우측 설명, 아이콘 슬롯 배치를 한 구조에서 관리합니다.
import { memo } from 'react'
import { MonadLogo } from '../../components/MonadLogo/MonadLogo'
import { HomeContentModel } from '../../models/HomeContentModel'
import styles from './WhatIsMonadSection.module.css'

const socialIcons = HomeContentModel.getSocialIcons().slice(0, 4)
const descriptionLines = HomeContentModel.whatIsDescription.split('\n')
const iconBySlotIndex: Record<number, (typeof socialIcons)[number] | undefined> = {
  0: socialIcons[0],
  2: socialIcons[1],
  4: socialIcons[2],
  6: socialIcons[3],
}

export const WhatIsMonadSection = memo(function WhatIsMonadSection() {
  return (
    <section className={styles.section} aria-label={HomeContentModel.whatIsTitle}>
      <div className={styles.frame}>
        <div className={styles.textureLayer} aria-hidden="true" />
        <div className={styles.overlayLayer} aria-hidden="true" />

        <div className={styles.outerGrid}>
          <div className={styles.sideColumn} aria-hidden="true" />

          <div className={styles.centerColumn}>
            <div className={`${styles.railRow} ${styles.topRailRow}`} aria-hidden="true">
              <svg
                className={styles.railSvg}
                viewBox="0 0 1320 260"
                fill="none"
                preserveAspectRatio="xMidYMid meet"
              >
                <path
                  d="M1319.57 150.587V182.786L166.124 181.637L165.943 181.636L165.824 181.771L96.8066 259.439L69.126 235.669L147.439 149.438L1319.57 150.587ZM130.403 129.818L28.2539 244.21L0.573242 220.439L82.9941 130.088L83.2402 129.818L82.9941 129.549L0.573242 39.1973L28.2539 15.4268L130.403 129.818ZM165.825 77.5059L165.944 77.6387H166.123L1319.57 78.7881V111.35L147.439 110.2L69.1279 23.9697L96.8066 0.555664L165.825 77.5059Z"
                  stroke="white"
                  strokeOpacity="0.15"
                  strokeWidth="0.8"
                />
              </svg>
              <svg
                className={styles.railSvg}
                viewBox="0 0 1320 260"
                fill="none"
                preserveAspectRatio="xMidYMid meet"
              >
                <path
                  d="M1319.57 150.587V182.786L166.124 181.637L165.943 181.636L165.824 181.771L96.8066 259.439L69.126 235.669L147.439 149.438L1319.57 150.587ZM130.403 129.818L28.2539 244.21L0.573242 220.439L82.9941 130.088L83.2402 129.818L82.9941 129.549L0.573242 39.1973L28.2539 15.4268L130.403 129.818ZM165.825 77.5059L165.944 77.6387H166.123L1319.57 78.7881V111.35L147.439 110.2L69.1279 23.9697L96.8066 0.555664L165.825 77.5059Z"
                  stroke="white"
                  strokeOpacity="0.15"
                  strokeWidth="0.8"
                />
              </svg>
            </div>

            <div className={styles.contentRow}>
              <div className={`${styles.contentGrid} ${styles.contentRowGrid}`}>
                <div className={`${styles.cell} ${styles.titleCell}`}>
                  <h2 className={styles.title}>{HomeContentModel.whatIsTitle}</h2>
                </div>

                <div className={`${styles.cell} ${styles.logoCell}`}>
                  <MonadLogo variant="section" className={styles.centerLogo} />
                </div>

                <div className={`${styles.cell} ${styles.descriptionCell}`}>
                  <div className={styles.description}>
                    {descriptionLines.map((line, index) => (
                      <p key={`${line}-${index}`}>
                        {index >= 2 ? <strong>{line}</strong> : line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.emptyRow} aria-hidden="true">
              <div className={`${styles.contentGrid} ${styles.emptyRowGrid}`}>
                <div className={styles.cell} />
                <div className={styles.cell} />
                <div className={styles.cell} />
              </div>
            </div>

            <div className={styles.iconRow}>
              <div className={`${styles.contentGrid} ${styles.iconRowGrid}`}>
                <div className={styles.cell} />
                <div className={`${styles.cell} ${styles.iconCell}`}>
                  <ul className={styles.iconSlots}>
                    {Array.from({ length: 7 }, (_, slotIndex) => {
                      const item = iconBySlotIndex[slotIndex]

                      if (!item) {
                        return <li key={`slot-${slotIndex}`} className={styles.iconSlot} aria-hidden="true" />
                      }

                      const isPlaceholderLink = item.href.trim() === '#'
                      const isExternalLink = /^https?:\/\//i.test(item.href)

                      return (
                        <li key={`${item.label}-${slotIndex}`} className={styles.iconSlot}>
                          <a
                            href={item.href}
                            aria-label={item.label}
                            className={styles.iconLink}
                            target={isExternalLink ? '_blank' : undefined}
                            rel={isExternalLink ? 'noopener noreferrer' : undefined}
                            onClick={
                              isPlaceholderLink
                                ? (event) => {
                                    event.preventDefault()
                                  }
                                : undefined
                            }
                          >
                            <img
                              src={item.iconSrc}
                              alt=""
                              className={styles.iconImage}
                              aria-hidden="true"
                            />
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </div>
                <div className={styles.cell} />
              </div>
            </div>

            <div className={`${styles.railRow} ${styles.bottomRailRow}`} aria-hidden="true">
              <svg
                className={styles.railSvg}
                viewBox="0 0 1320 260"
                fill="none"
                preserveAspectRatio="xMidYMid slice"
              >
                <path
                  d="M0.400391 178.367L1150.88 181.637H1151.06L1151.18 181.771L1220.19 259.439L1247.87 235.669L1169.56 149.437L0.400391 146.168V178.367ZM1186.6 129.818L1288.76 244.223L1318.91 220.43L1234.01 130.093L1233.75 129.818L1234.01 129.545L1318.91 39.207L1288.76 15.4141L1186.6 129.818ZM1151.17 77.5059L1151.05 77.6387H1150.88L0.400391 74.3691V106.931L1169.56 110.199L1247.87 23.9697L1220.19 0.555664L1151.17 77.5059Z"
                  stroke="white"
                  strokeOpacity="0.15"
                  strokeWidth="0.8"
                />
              </svg>
              <svg
                className={styles.railSvg}
                viewBox="0 0 1320 260"
                fill="none"
                preserveAspectRatio="xMidYMid slice"
              >
                <path
                  d="M0.400391 178.367L1150.88 181.637H1151.06L1151.18 181.771L1220.19 259.439L1247.87 235.669L1169.56 149.437L0.400391 146.168V178.367ZM1186.6 129.818L1288.76 244.223L1318.91 220.43L1234.01 130.093L1233.75 129.818L1234.01 129.545L1318.91 39.207L1288.76 15.4141L1186.6 129.818ZM1151.17 77.5059L1151.05 77.6387H1150.88L0.400391 74.3691V106.931L1169.56 110.199L1247.87 23.9697L1220.19 0.555664L1151.17 77.5059Z"
                  stroke="white"
                  strokeOpacity="0.15"
                  strokeWidth="0.8"
                />
              </svg>
            </div>
          </div>

          <div className={styles.sideColumn} aria-hidden="true" />
        </div>
      </div>
    </section>
  )
})
