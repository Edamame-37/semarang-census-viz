import { useEffect, useRef } from 'react'
import * as echarts from 'echarts/core'
import { BarChart, ScatterChart } from 'echarts/charts'
import { GridComponent, MarkLineComponent, TooltipComponent, AriaComponent, ToolboxComponent } from 'echarts/components'
import { SVGRenderer } from 'echarts/renderers'

echarts.use([BarChart, ScatterChart, GridComponent, MarkLineComponent, TooltipComponent, AriaComponent, ToolboxComponent, SVGRenderer])

export default function AccessibleChart({ option, ariaLabel, className = '', onSelect }) {
  const containerRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined
    const chart = echarts.init(container, null, { renderer: 'svg' })
    chartRef.current = chart
    const handleClick = (event) => event.data?.districtId && onSelect?.(event.data.districtId)
    chart.on('click', handleClick)
    const observer = new ResizeObserver(() => chart.resize())
    observer.observe(container)
    return () => {
      observer.disconnect()
      chart.off('click', handleClick)
      chart.dispose()
      chartRef.current = null
    }
  }, [onSelect])

  useEffect(() => {
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    chartRef.current?.setOption({
      ...option,
      animation: !reducedMotion,
      aria: { enabled: true, decal: { show: false }, description: ariaLabel },
    }, { notMerge: true, lazyUpdate: true })
  }, [option, ariaLabel])

  return <div ref={containerRef} className={`chart ${className}`} role="img" aria-label={ariaLabel} tabIndex="0" />
}
