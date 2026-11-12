/**
 * @file main.jsx
 * @description Entry point utama aplikasi Semarang Census Viz menggunakan React DOM dan StrictMode.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Inisialisasi React root element pada container #root di index.html
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
