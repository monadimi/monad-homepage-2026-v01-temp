// 프로젝트 전역 디자인 토큰입니다.
// 컴포넌트에서 직접 하드코딩하지 않고 이 파일의 값을 사용합니다.
export type PrimitiveToken = string | number

export interface ThemeTokens {
  colors: {
    backgroundPrimary: string
    backgroundDeepBlack: string
    backgroundSecondary: string
    headerBackground: string
    tickerBackground: string
    cardBackground: string
    cardBorder: string
    accentGreen: string
    mutedGray: string
    deepBlack: string
    overlayDark: string
    svgGrayStroke: string
    graySoft: string
    textPrimary: string
    textSecondary: string
    textMuted: string
    accent: string
    divider: string
    patternLine: string
    placeholderBackground: string
  }
  typography: {
    fontFamilyPrimary: string
    fontFamilyDisplay: string
    fontFamilyMono: string
    fontFamilySerif: string
    heroSerif: string
    sectionTitle: string
    body: string
    small: string
    cycleHighlight: string
    weightLight: string
    weightRegular: string
    weightMedium: string
    letterSpacingNav: string
    letterSpacingTicker: string
    lineHeightBody: string
    scale: {
      nav: string
      ticker: string
      sectionHeading: string
      body: string
      caption: string
      heroSerifLarge: string
      heroSerifMedium: string
      bodySmall: string
      cardTitle: string
      cardSubtitle: string
    }
  }
  spacing: {
    xxs: string
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    xxl: string
    section: string
    pageHorizontal: string
    gridGap: string
    sectionPadding: string
    heroPadding: string
    monad2026SectionGap: string
    monad2026CardGap: string
    monad2026FaqGap: string
  }
  radius: {
    sm: string
    md: string
    lg: string
  }
  shadow: {
    subtle: string
    strong: string
  }
  zIndex: {
    base: string
    content: string
    header: string
  }
  breakpoints: {
    compact: string
    mobile: string
    tablet: string
    desktop: string
  }
  layout: {
    maxWidth: string
    headerHeight: string
    tickerHeight: string
    possibilityHeight: string
    possibilityHeightMobile: string
    whatIsHeight: string
    whatIsHeightMobile: string
    achievementsHeroHeight: string
    achievementsCardHeight: string
    monad2026PageWidth: string
    monad2026SectionMaxWidth: string
    monad2026ProofMaxWidth: string
    monad2026FaqMaxWidth: string
    monad2026ImageMaxWidth: string
    monad2026HeroHeight: string
    monad2026IntroMediaSize: string
    monad2026CycleCardHeight: string
    monad2026JoinHeight: string
    footerHeight: string
    comingSoonMinHeight: string
  }
  animation: {
    fadeDuration: string
  }
  motion: {
    tickerDuration: string
    tickerTiming: string
    fadeDuration: string
  }
}

export const tokens: ThemeTokens = {
  // 색상 토큰
  colors: {
    backgroundPrimary: '#02050b',
    backgroundDeepBlack: '#000000',
    backgroundSecondary: '#050913',
    headerBackground: '#010204',
    tickerBackground: '#010101',
    cardBackground: '#14181f',
    cardBorder: 'rgba(255, 255, 255, 0.12)',
    accentGreen: '#2be9cb',
    mutedGray: 'rgba(208, 214, 224, 0.68)',
    deepBlack: '#000000',
    overlayDark: 'rgba(0, 0, 0, 0.72)',
    svgGrayStroke: '#8f949f',
    graySoft: '#8f949f',
    textPrimary: '#f4f7fb',
    textSecondary: 'rgba(233, 240, 249, 0.62)',
    textMuted: 'rgba(231, 238, 247, 0.42)',
    accent: '#2be9cb',
    divider: 'rgba(255, 255, 255, 0.1)',
    patternLine: 'rgba(41, 71, 98, 0.18)',
    placeholderBackground: '#070c17',
  },
  // 타이포그래피 토큰
  typography: {
    fontFamilyPrimary: '"D2Coding", "D2Coding ligature", "SFMono-Regular", Consolas, monospace',
    fontFamilyDisplay: '"D2Coding", "D2Coding ligature", "SFMono-Regular", Consolas, monospace',
    fontFamilyMono: '"D2Coding", "D2Coding ligature", "SFMono-Regular", Consolas, monospace',
    fontFamilySerif: '"Cormorant Garamond", "Times New Roman", serif',
    heroSerif: 'clamp(52px, 5.2vw, 78px)',
    sectionTitle: 'clamp(22px, 2.2vw, 30px)',
    body: '15px',
    small: '11px',
    cycleHighlight: 'clamp(32px, 3.2vw, 46px)',
    weightLight: '300',
    weightRegular: '400',
    weightMedium: '500',
    letterSpacingNav: '0.07em',
    letterSpacingTicker: '0.015em',
    lineHeightBody: '1.55',
    scale: {
      nav: '18px',
      ticker: '21px',
      sectionHeading: 'clamp(34px, 4.3vw, 52px)',
      body: '14px',
      caption: '15px',
      heroSerifLarge: 'clamp(46px, 3.8vw, 68px)',
      heroSerifMedium: 'clamp(38px, 3.2vw, 54px)',
      bodySmall: '11px',
      cardTitle: '28px',
      cardSubtitle: '11px',
    },
  },
  // 간격 토큰
  spacing: {
    xxs: '2px',
    xs: '6px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
    section: '56px',
    pageHorizontal: '10px',
    gridGap: '8px',
    sectionPadding: '24px',
    heroPadding: '48px',
    monad2026SectionGap: '52px',
    monad2026CardGap: '14px',
    monad2026FaqGap: '8px',
  },
  // 모서리 반경 토큰
  radius: {
    sm: '2px',
    md: '4px',
    lg: '8px',
  },
  // 그림자 토큰
  shadow: {
    subtle: '0 10px 24px rgba(0, 0, 0, 0.22)',
    strong: 'none',
  },
  // 레이어 우선순위 토큰
  zIndex: {
    base: '1',
    content: '10',
    header: '100',
  },
  // 반응형 브레이크포인트 토큰
  breakpoints: {
    compact: '420px',
    mobile: '768px',
    tablet: '1024px',
    desktop: '1440px',
  },
  // 레이아웃 높이/폭 토큰
  layout: {
    maxWidth: '1440px',
    headerHeight: '51px',
    tickerHeight: '42px',
    possibilityHeight: 'clamp(420px, 52vw, 620px)',
    possibilityHeightMobile: 'clamp(300px, 58vw, 420px)',
    whatIsHeight: 'clamp(220px, 26vw, 300px)',
    whatIsHeightMobile: 'clamp(260px, 56vw, 320px)',
    achievementsHeroHeight: 'clamp(460px, 52vw, 720px)',
    achievementsCardHeight: '174px',
    monad2026PageWidth: '378px',
    monad2026SectionMaxWidth: '760px',
    monad2026ProofMaxWidth: '720px',
    monad2026FaqMaxWidth: '760px',
    monad2026ImageMaxWidth: '1440px',
    monad2026HeroHeight: 'clamp(280px, 44vw, 520px)',
    monad2026IntroMediaSize: '96px',
    monad2026CycleCardHeight: '118px',
    monad2026JoinHeight: 'clamp(240px, 36vw, 420px)',
    footerHeight: '102px',
    comingSoonMinHeight: 'calc(100vh - var(--layout-header-height) - var(--layout-footer-height))',
  },
  animation: {
    fadeDuration: '300ms',
  },
  // 애니메이션 속도 토큰
  motion: {
    tickerDuration: '24s',
    tickerTiming: 'linear',
    fadeDuration: '180ms',
  },
}
