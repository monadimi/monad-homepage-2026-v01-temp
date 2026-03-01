// 홈 화면 텍스트/아이콘 데이터를 한곳에서 관리합니다.
import dimiwikiIcon from '../../../assets/dimiwiki.svg'
import githubIcon from '../../../assets/github.svg'
import instagramIcon from '../../../assets/instagram.svg'
import surfingIcon from '../../../assets/surfing.svg'

export interface SocialIconItem {
  label: string
  iconSrc: string
  href: string
}

export class HomeContentModel {
  public static readonly tickerMessage =
    '모나드 1기 모집 중 Join Our 1st Generation'

  public static readonly whatIsTitle = 'what is MONAD?'

  public static readonly whatIsDescription = [
    '단순히 코딩 실력을 키우는 것을 넘어, 기술로 사회적 문제를',
    '풀어내고 싶은 사람들이 모인 동아리입니다.',
    '인공지능부터 알고리즘, 웹 개발, 보안, 더 나아가',
    '양자 같은 미래 기술까지 폭 넓게 다룹니다.',
  ].join('\n')

  public static readonly footerCookieLabel = 'Cookie Policy'

  public static readonly socialIcons: readonly SocialIconItem[] = [
    {
      label: 'Surfing',
      iconSrc: surfingIcon,
      href: '#',
    },
    {
      label: 'Dimiwiki',
      iconSrc: dimiwikiIcon,
      href: '#',
    },
    {
      label: 'Instagram',
      iconSrc: instagramIcon,
      href: '#',
    },
    {
      label: 'GitHub',
      iconSrc: githubIcon,
      href: '#',
    },
  ]

  public static getTickerItems(repeatCount = 6): readonly string[] {
    return Array.from({ length: repeatCount }, () => HomeContentModel.tickerMessage)
  }

  public static getSocialIcons(): readonly SocialIconItem[] {
    return HomeContentModel.socialIcons
  }

  public static getFooterCopyright(): string {
    return `© ${new Date().getFullYear()} MONAD. All rights reserved.`
  }
}
