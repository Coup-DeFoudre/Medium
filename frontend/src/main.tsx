import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { UserProvider } from './context/UserContext.tsx'
import { Analytics } from "@vercel/analytics/next"


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
    <App />
    <Analytics/>
   
    </UserProvider>
  </StrictMode>,
)
