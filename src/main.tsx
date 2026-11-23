import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// apply the saved theme before first paint
try {
  if (localStorage.getItem('cos333-theme') !== 'light') document.documentElement.classList.add('dark')
} catch {
  document.documentElement.classList.add('dark')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
