// 홈 화면 텍스트/아이콘 데이터를 한곳에서 관리합니다.
import dimiwikiIcon from '../../../assets/dimiwiki.svg'
import githubIcon from '../../../assets/github.svg'
import instagramIcon from '../../../assets/instagram.svg'
import surfingIcon from '../../../assets/surfing.svg'
import { text, textFormat } from '../../../content/text/textService'

export interface SocialIconItem {
  label: string
  iconSrc: string
  href: string
}

export class HomeContentModel {
  public static readonly tickerMessage = text(
    'home',
    'ticker.message',
    '모나드 1기 모집 중 Join Our 1st Generation',
  )

  public static readonly whatIsTitle = text('home', 'whatIs.title', 'what is MONAD?')

  public static readonly whatIsDescription = text(
    'home',
    'whatIs.description',
    [
      '단순히 코딩 실력을 키우는 것을 넘어, 기술로 사회적 문제를',
      '풀어내고 싶은 사람들이 모인 동아리입니다.',
      '인공지능부터 알고리즘, 웹 개발, 보안, 더 나아가',
      '양자 같은 미래 기술까지 폭 넓게 다룹니다.',
    ].join('\n'),
  )

  public static readonly footerCookieLabel = text(
    'global',
    'footer.cookiePolicy',
    'Cookie Policy',
  )

  public static readonly socialIcons: readonly SocialIconItem[] = [
    {
      label: text('home', 'social.surfing.label', 'Surfing'),
      iconSrc: surfingIcon,
      // 아직 공식 채널이 없어 임시로 비활성 링크를 유지합니다.
      href: text('home', 'social.surfing.href', '#'),
    },
    {
      label: text('home', 'social.dimiwiki.label', 'Dimiwiki'),
      iconSrc: dimiwikiIcon,
      href: text(
        'home',
        'social.dimiwiki.href',
        'https://wiki.dimigo.hs.kr/wiki/%EB%8F%99%EC%95%84%EB%A6%AC:%EB%AA%A8%EB%82%98%EB%93%9C',
      ),
    },
    {
      label: text('home', 'social.instagram.label', 'Instagram'),
      iconSrc: instagramIcon,
      href: text('home', 'social.instagram.href', 'https://www.instagram.com/monad_dimigo'),
    },
    {
      label: text('home', 'social.github.label', 'GitHub'),
      iconSrc: githubIcon,
      href: text('home', 'social.github.href', 'https://github.com/monadimi'),
    },
  ]

  public static getTickerItems(repeatCount = 6): readonly string[] {
    return Array.from({ length: repeatCount }, () => HomeContentModel.tickerMessage)
  }

  public static getSocialIcons(): readonly SocialIconItem[] {
    return HomeContentModel.socialIcons
  }

  public static getFooterCopyright(): string {
    return textFormat(
      'global',
      'footer.copyrightTemplate',
      { year: new Date().getFullYear() },
      `© ${new Date().getFullYear()} MONAD. All rights reserved.`,
    )
  }
}
