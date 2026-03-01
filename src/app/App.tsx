// 최상위 앱 컴포넌트입니다.
// 렌더링 전에 전역 토큰(CSS 변수)을 1회 주입합니다.
import { useEffect } from 'react'
import { Router } from './Router'
import { GlobalStyles } from '../core/theme/GlobalStyles'

function App() {
  useEffect(() => {
    GlobalStyles.initialize()
  }, [])

  return <Router />
}

export default App
