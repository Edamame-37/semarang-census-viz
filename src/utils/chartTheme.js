export const COLORS = Object.freeze({
  primary: '#245e98',
  primarySoft: '#dbe9f6',
  neutral: '#9babbc',
  benchmark: '#566779',
  text: '#17263c',
  textMuted: '#4b5d71',
  grid: '#d7e0e9',
  selected: '#0b63c9',
  A: '#a5531c',
  B: '#315f91',
  C: '#147268',
  D: '#667085',
})

export const baseChartOptions = {
  animationDuration: 180,
  toolbox: {
    right: 0,
    top: 0,
    feature: { saveAsImage: { title: 'Simpan grafik sebagai PNG', name: 'dashboard-demografi-semarang', pixelRatio: 2, backgroundColor: '#ffffff' } },
  },
  textStyle: { fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif", color: COLORS.text, fontSize: 12 },
  tooltip: {
    trigger: 'item',
    confine: true,
    backgroundColor: '#ffffff',
    borderColor: COLORS.grid,
    textStyle: { color: COLORS.text, fontSize: 13, lineHeight: 20 },
    extraCssText: 'box-shadow: 0 6px 18px rgba(23,38,60,.12); border-radius:4px;',
  },
}
