import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../src/App.jsx'

const exportMocks = vi.hoisted(() => ({ complete: vi.fn(), filtered: vi.fn() }))

vi.mock('../src/utils/export.js', () => ({
  exportCompleteDataset: exportMocks.complete,
  exportFilteredDistricts: exportMocks.filtered,
}))

vi.mock('../src/components/AccessibleChart.jsx', () => ({
  default: ({ ariaLabel }) => <div role="img" aria-label={ariaLabel} />,
}))

describe('dashboard application', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    render(<App />)
  })

  it('UI-01: shows four official scorecards', () => {
    const overview = screen.getByLabelText('Temuan terverifikasi seluruh kota').parentElement
    expect(within(overview).getByText('1.694,74')).toBeInTheDocument()
    expect(within(overview).getByText('4.534,07')).toBeInTheDocument()
    expect(within(overview).getByText('0,90%')).toBeInTheDocument()
    expect(within(overview).getByText('97,91')).toBeInTheDocument()
  })

  it('UI-02: switches comparison metric and keeps correct label', async () => {
    await userEvent.click(within(screen.getByRole('group', { name: 'Pilih metrik perbandingan' })).getByRole('button', { name: 'Pertumbuhan' }))
    expect(screen.getByRole('heading', { name: 'Pertumbuhan penduduk' })).toBeInTheDocument()
  })

  it('derives executive findings from the canonical data', () => {
    expect(screen.getByText(/Mijen memiliki pertumbuhan tertinggi, 3,93%/)).toBeInTheDocument()
    expect(screen.getByText(/Tembalang dan Genuk berada pada kelompok A/)).toBeInTheDocument()
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
    await userEvent.click(screen.getByRole('button', { name: 'Hapus pencarian' }))
    expect(search).toHaveValue('')
  })

  it('shows district and city values side by side after selection', async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Mijen', exact: true }))
    const detail = screen.getByRole('complementary')
    expect(within(detail).getByRole('columnheader', { name: 'Kota Semarang' })).toBeInTheDocument()
    expect(within(detail).getByText('3,93%')).toBeInTheDocument()
    expect(within(detail).getByText('0,90%')).toBeInTheDocument()
  })

  it('keeps complete and filtered exports as separate actions', async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Unduh dataset lengkap' }))
    expect(exportMocks.complete).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ districtName: 'Mijen' })]))
    expect(exportMocks.complete.mock.calls[0][0]).toHaveLength(16)
    await userEvent.selectOptions(screen.getByLabelText('Filter kelompok'), 'A')
    await userEvent.click(screen.getByRole('button', { name: 'Ekspor hasil filter (2)' }))
    expect(exportMocks.filtered.mock.calls[0][0]).toHaveLength(2)
  })

  it('supports ascending and descending chart sorting', async () => {
    const ascending = screen.getByRole('button', { name: 'Terendah' })
    await userEvent.click(ascending)
    expect(ascending).toHaveAttribute('aria-pressed', 'true')
  })

  it('UI-07: reset restores metric, rows, and filter', async () => {
    await userEvent.selectOptions(screen.getByLabelText('Filter kelompok'), 'A')
    await userEvent.click(within(screen.getByRole('group', { name: 'Pilih metrik perbandingan' })).getByRole('button', { name: 'Pertumbuhan' }))
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))
    expect(screen.getByText('Menampilkan 16 dari 16 kecamatan.')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Pangsa penduduk' })).toBeInTheDocument()
  })
})
