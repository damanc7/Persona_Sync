import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

async function prepare() {
  // MSW disabled — using real backend at http://localhost:8000 via Vite proxy
}

prepare().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
})
