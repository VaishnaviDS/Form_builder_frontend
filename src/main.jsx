import { StrictMode,React } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
export const server="http://localhost:10000"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
