// 앱의 React 진입점입니다.
// StrictMode를 유지해 잠재적인 사이드 이펙트를 개발 단계에서 빠르게 확인합니다.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import { GlobalStyles } from './core/theme/GlobalStyles'

GlobalStyles.initialize()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
