import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../src/App.jsx'

vi.mock('../src/components/AccessibleChart.jsx', () => ({
  default: ({ ariaLabel }) => <div role="img" aria-label={ariaLabel} />,
}))

describe('dashboard application', () => {
  beforeEach(() => render(<App />))

  it('UI-01: shows four official scorecards', () => {
    const overview = screen.getByLabelText('Temuan terverifikasi seluruh kota').parentElement
    expect(within(overview).getByText('1.694,74')).toBeInTheDocument()
    expect(within(overview).getByText('4.534,07')).toBeInTheDocument()
    expect(within(overview).getByText('0,90%')).toBeInTheDocument()
    expect(within(overview).getByText('97,91')).toBeInTheDocument()
  })

  it('UI-02: switches comparison metric and keeps correct label', async () => {
    await userEvent.selectOptions(screen.getByLabelText('Pilih metrik perbandingan'), 'growthRatePct')
    expect(screen.getByRole('heading', { name: 'Pertumbuhan penduduk' })).toBeInTheDocument()
  })

  it('UI-04: group A filter leaves two table rows and preserves scorecards', async () => {
    await userEvent.selectOptions(screen.getByLabelText('Filter kelompok'), 'A')
    expect(screen.getByText('Menampilkan 2 dari 16 kecamatan.')).toBeInTheDocument()
    expect(screen.getByText('1.694,74')).toBeInTheDocument()
  })

  it('UI-05: group D presents an informative empty state', async () => {
    await userEvent.selectOptions(screen.getByLabelText('Filter kelompok'), 'D')
    expect(screen.getByText(/Tidak ada kecamatan pada kelompok D/)).toBeInTheDocument()
    expect(screen.getByText('Tidak ada kecamatan yang cocok dengan filter atau pencarian.')).toBeInTheDocument()
  })

  it('UI-06: search locates Semarang Timur and rejects unknown names clearly', async () => {
    const search = screen.getByLabelText('Cari & sorot kecamatan')
    await userEvent.type(search, 'Semarang Timur')
    expect(screen.getByText('Semarang Timur ditemukan')).toBeInTheDocument()
    await userEvent.clear(search)
    await userEvent.type(search, 'Atlantis')
    expect(screen.getByText('Tidak ada kecamatan yang cocok')).toBeInTheDocument()
  })

  it('UI-07: reset restores metric, rows, and filter', async () => {
    await userEvent.selectOptions(screen.getByLabelText('Filter kelompok'), 'A')
    await userEvent.selectOptions(screen.getByLabelText('Pilih metrik perbandingan'), 'growthRatePct')
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))
    expect(screen.getByText('Menampilkan 16 dari 16 kecamatan.')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Pangsa penduduk' })).toBeInTheDocument()
  })
})
