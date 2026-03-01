// 전역 디자인 토큰의 단일 접근 지점입니다.
import { tokens, type ThemeTokens } from './tokens'

export class Theme {
  public static readonly tokens: ThemeTokens = tokens
}
