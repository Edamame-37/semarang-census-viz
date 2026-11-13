import rawData from '../../data/processed/semarang-2023.json'
import { validateDashboardData } from './validators.js'

const validationErrors = validateDashboardData(rawData)

export const dashboardData = validationErrors.length
  ? { status: 'error', errors: validationErrors, districts: [], cityBenchmark: null, provenance: null }
  : { status: 'ready', errors: [], ...rawData }
