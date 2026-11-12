/**
 * @file App.jsx
 * @description Komponen root aplikasi visualisasi sensus Semarang.
 * Menampilkan halaman awal interaktif dengan React dan Vite.
 */

import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

/**
 * Komponen utama App
 * @returns {JSX.Element} Elemen tampilan utama aplikasi
 */
function App() {
  // State untuk menyimpan nilai penghitung interaktif
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="Hero background" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Semarang Census Viz</h1>
          <p>
            Aplikasi Visualisasi Data Sensus Kota Semarang berbasis React.js
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((prevCount) => prevCount + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Dokumentasi & Sumber Daya</h2>
          <p>Pelajari lebih lanjut tentang React dan Vite</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank" rel="noreferrer">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank" rel="noreferrer">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn React
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
