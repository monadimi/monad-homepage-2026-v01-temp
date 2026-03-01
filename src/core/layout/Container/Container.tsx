// 페이지 공통 가로 폭을 제한하는 래퍼입니다.
import { memo, type PropsWithChildren } from 'react'
import styles from './Container.module.css'

export const Container = memo(function Container({
  children,
}: PropsWithChildren) {
  return <div className={styles.root}>{children}</div>
})
