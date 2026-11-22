export const COLORS = Object.freeze({
  primary: '#0078D4',
  primarySoft: '#EBF3FC',
  neutral: '#94A3B8',
  benchmark: '#DC2626',
  text: '#1E293B',
  textMuted: '#64748B',
  grid: '#E2E8F0',
  selected: '#FFB900',
  A: '#0E7C7B',
  B: '#1F4E79',
  C: '#D97706',
  D: '#64748B',
  female: '#7C3AED',
  male: '#0284C7',
})

export const baseChartOptions = {
  animationDuration: 300,
  animationEasing: 'cubicOut',
  toolbox: {
    right: 4,
    top: 0,
    iconStyle: { borderColor: '#94A3B8' },
    emphasis: { iconStyle: { borderColor: '#1E293B' } },
    feature: { saveAsImage: { title: 'Simpan', name: 'semarang-dashboard', pixelRatio: 2, backgroundColor: '#ffffff' } },
  },
  textStyle: { fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", color: '#1E293B', fontSize: 11 },
  tooltip: {
    trigger: 'item',
    confine: true,
    backgroundColor: '#ffffff',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    textStyle: { color: '#1E293B', fontSize: 12, lineHeight: 18 },
    extraCssText: 'box-shadow: 0 4px 12px rgba(0,0,0,0.08); border-radius: 4px; padding: 10px 14px;',
  },
}
