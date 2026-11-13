import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('answers core CBQs and links table selection', async ({ page }, testInfo) => {
  const consoleErrors = []
  page.on('console', (message) => message.type() === 'error' && consoleErrors.push(message.text()))
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /Dashboard Demografi/ })).toBeVisible()
  await page.screenshot({ path: `docs/dashboard-${testInfo.project.name.startsWith('mobile') ? 'mobile' : 'desktop'}.png`, fullPage: true })
  await expect(page.getByText('1.694,74')).toBeVisible()
  await page.getByRole('button', { name: 'Mijen', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Mijen', exact: true })).toBeVisible()
  await expect(page.getByRole('complementary').getByText('3,93%')).toBeVisible()
  await expect(page.getByRole('complementary').getByRole('columnheader', { name: 'Kota Semarang' })).toBeVisible()
  await page.getByRole('combobox', { name: 'Filter kelompok', exact: true }).selectOption('A')
  await expect(page.getByText('Menampilkan 2 dari 16 kecamatan.')).toBeVisible()
  await expect(page.getByText('1.694,74')).toBeVisible()
  await page.getByRole('button', { name: 'Reset', exact: true }).click()
  await expect(page.getByText('Menampilkan 16 dari 16 kecamatan.')).toBeVisible()
  expect(consoleErrors).toEqual([])
})

test('supports empty group D and search feedback without page overflow', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('combobox', { name: 'Filter kelompok', exact: true }).selectOption('D')
  await expect(page.getByText(/Tidak ada kecamatan pada kelompok D/)).toBeVisible()
  await page.getByRole('button', { name: 'Reset', exact: true }).click()
  await page.getByLabel('Cari & sorot kecamatan').fill('Semarang Timur')
  await expect(page.getByText('Semarang Timur ditemukan')).toBeVisible()
  await page.getByRole('button', { name: 'Hapus pencarian' }).click()
  await expect(page.getByLabel('Cari & sorot kecamatan')).toHaveValue('')
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
  expect(overflow).toBe(false)
})

test('switches metrics, chart order, and keeps exports scoped correctly', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Pertumbuhan', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Pertumbuhan penduduk' })).toBeVisible()
  await page.getByRole('button', { name: 'Terendah' }).click()
  await expect(page.getByRole('button', { name: 'Terendah' })).toHaveAttribute('aria-pressed', 'true')

  const completeDownload = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Unduh dataset lengkap' }).click()
  expect((await completeDownload).suggestedFilename()).toBe('semarang_demografi_2023_all_16.csv')

  await page.getByRole('combobox', { name: 'Filter kelompok', exact: true }).selectOption('A')
  const filteredDownload = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Ekspor hasil filter (2)' }).click()
  expect((await filteredDownload).suggestedFilename()).toBe('semarang_demografi_2023_filtered_2.csv')
})

test('has no automatically detectable WCAG A/AA violations', async ({ page }) => {
  await page.goto('/')
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
  expect(results.violations).toEqual([])
})
