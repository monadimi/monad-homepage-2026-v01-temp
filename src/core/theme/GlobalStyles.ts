import './GlobalStyles.css'
import { Theme } from './Theme'
import type { PrimitiveToken } from './tokens'

const TOKEN_SEPARATOR = '-'

// 앱 시작 시 디자인 토큰을 CSS 변수로 1회 등록합니다.
export class GlobalStyles {
  private static isInitialized = false

  public static initialize(): void {
    if (GlobalStyles.isInitialized || typeof document === 'undefined') {
      return
    }

    const root = document.documentElement
    const flattened = GlobalStyles.flattenTokenObject(
      Theme.tokens as unknown as Record<string, unknown>,
    )

    Object.entries(flattened).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, String(value))
    })

    GlobalStyles.isInitialized = true
  }

  private static flattenTokenObject(
    value: Record<string, unknown>,
    path: string[] = [],
    result: Record<string, PrimitiveToken> = {},
  ): Record<string, PrimitiveToken> {
    // 중첩 객체를 평탄화해 CSS 변수 키로 변환합니다.
    Object.entries(value).forEach(([key, nestedValue]) => {
      const normalizedKey = GlobalStyles.toKebabCase(key)
      const nextPath = [...path, normalizedKey]

      if (typeof nestedValue === 'string' || typeof nestedValue === 'number') {
        result[nextPath.join(TOKEN_SEPARATOR)] = nestedValue
        return
      }

      if (nestedValue && typeof nestedValue === 'object') {
        GlobalStyles.flattenTokenObject(
          nestedValue as Record<string, unknown>,
          nextPath,
          result,
        )
      }
    })

    return result
  }

  private static toKebabCase(value: string): string {
    // camelCase 키를 kebab-case CSS 변수 키로 변환합니다.
    return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
  }
}
