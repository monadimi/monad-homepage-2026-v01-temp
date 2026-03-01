// 페이지 내 공통 CTA 버튼 컴포넌트입니다.
import { memo, type ButtonHTMLAttributes } from 'react'
import styles from './CTAButton.module.css'

type CTAButtonVariant = 'outline' | 'solid'

interface CTAButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  variant?: CTAButtonVariant
}

const variantClassNameMap: Record<CTAButtonVariant, string> = {
  outline: styles.outline,
  solid: styles.solid,
}

export const CTAButton = memo(function CTAButton({
  label,
  variant = 'outline',
  type = 'button',
  ...rest
}: CTAButtonProps) {
  return (
    <button
      type={type}
      className={`${styles.button} ${variantClassNameMap[variant]}`}
      {...rest}
    >
      {label}
    </button>
  )
})
