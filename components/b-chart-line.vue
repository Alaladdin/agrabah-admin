<template>
  <div ref="chartWrapper" class="p-5 rounded shadow-sm w-full bg-white">
    <figure ref="chart" class="flex h-30" />

    <div class="text-sm font-mono">
      <div ref="chartHeading" class="mb-2 text-xs text-gray-600 font-semibold" />
      <p ref="chartTotal" />
    </div>
  </div>
</template>

<script>
import { reject, map, last } from 'lodash'
import { formatDate } from '@/helpers'

const d3 = (process.client) && require('d3')

export default {
  name : 'b-chart-line',
  props: {
    data: {
      type   : Array,
      default: () => ([]),
    },
    dataKey: {
      type   : String,
      default: '',
    },
    title: {
      type: String,
      default () {
        return this.dataKey
      },
    },
    getTotalText: {
      type: Function,
      default (item) {
        return item[this.dataKey]
      },
    },
  },
  data: () => ({
    currentData: [],
    areaWidth  : null,
    areaHeight : null,
    svg        : null,
    xScale     : null,
    yScale     : null,
    markerLine : null,
    markerDot  : null,
  }),
  watch: {
    data: {
      immediate: true,
      handler (v) {
        this.currentData = this.getSortedData(v)

        this.$nextTick(() => this.draw())
      },
    },
  },
  methods: {
    getSortedData () {
      const nonNullableData = reject(this.data, item => item[this.dataKey] === null)
      const formattedData = map(nonNullableData, item => ({
        [this.dataKey]: item[this.dataKey],
        date          : new Date(item.createdAt),
      }))

      return formattedData.sort((a, b) => d3.ascending(a.date, b.date))
    },
    draw () {
      const { chartWrapper, chart } = this.$refs
      const xDomain = d3.extent(this.currentData, this.getXAccessor)
      const yDomain = [0, d3.max(this.currentData, this.getYAccessor)]

      this.areaWidth = chartWrapper.clientWidth * 2
      this.areaHeight = chartWrapper.clientHeight - 70
      this.svg = d3.select(chart)
        .append('svg')
        .attr('width', this.areaWidth)
        .attr('height', this.areaHeight)
        .attr('viewBox', `0 0 ${this.areaWidth} ${this.areaHeight}`)
      this.xScale = d3.scaleTime().domain(xDomain).range([0, this.areaWidth])
      this.yScale = d3.scaleLinear().domain(yDomain).range([this.areaHeight, 0])

      this.drawArea()
      this.drawLine()
      this.drawMarkerLine()

      d3.select(this.$refs.chartHeading).text(this.title)
      d3.select(this.$refs.chartTotal).text(this.getTotalText(last(this.currentData)))

      this.svg.on('mousemove', this.onMouseMove)
      this.svg.on('mouseleave', this.onMouseLeave)
    },
    drawArea () {
      const areaGenerator = d3.area()
        .x(i => this.xScale(this.getXAccessor(i)))
        .y1(i => this.yScale(this.getYAccessor(i)))
        .y0(this.areaHeight)
        .curve(d3.curveBumpX)

      this.svg
        .append('path')
        .datum(this.currentData)
        .attr('d', areaGenerator)
        .attr('fill', 'var(--fill)')
    },
    drawLine () {
      const lineGenerator = d3.line()
        .x(i => this.xScale(this.getXAccessor(i)))
        .y(i => this.yScale(this.getYAccessor(i)))
        .curve(d3.curveBumpX)

      this.svg
        .append('path')
        .datum(this.currentData)
        .attr('d', lineGenerator)
        .attr('stroke', 'var(--stroke)')
        .attr('stroke-width', 5)
        .attr('stroke-linejoin', 'round')
        .attr('fill', 'none')
    },
    drawMarkerLine () {
      this.markerLine = this.svg
        .append('line')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', 0)
        .attr('y2', this.areaHeight)
        .attr('stroke-width', 3)
        .attr('stroke', 'var(--marker, var(--stroke))')
        .attr('opacity', 0)

      this.markerDot = this.svg
        .append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 8)
        .attr('fill', 'var(--marker, var(--stroke))')
        .attr('opacity', 0)
    },
    onMouseMove (e) {
      const { chartHeading, chartTotal } = this.$refs
      const [posX] = d3.pointer(e)
      const bisect = d3.bisector(this.getXAccessor)
      const date = this.xScale.invert(posX)
      const index = bisect.center(this.currentData, date)
      const d = this.currentData[index]

      const x = this.xScale(this.getXAccessor(d))
      const y = this.yScale(this.getYAccessor(d))

      this.markerLine
        .attr('x1', x)
        .attr('x2', x)
        .attr('opacity', 1)

      this.markerDot
        .attr('cx', x)
        .attr('cy', y)
        .attr('opacity', 1)

      d3.select(chartHeading).text(this.getHeadingText(d))
      d3.select(chartTotal).text(this.getTotalText(d))
    },
    getXAccessor (item) {
      return item.date
    },
    getYAccessor (item) {
      return item[this.dataKey]
    },
    getHeadingText (item) {
      return formatDate(item.date, 'HH:mm')
    },
    onMouseLeave () {
      const { chartHeading, chartTotal } = this.$refs
      const lastDatum = last(this.currentData)

      this.markerLine.attr('opacity', 0)
      this.markerDot.attr('opacity', 0)

      d3.select(chartHeading).text(this.title)
      d3.select(chartTotal).text(this.getTotalText(lastDatum))
    },
  },
}
</script>

<style lang='scss'>
:root {
  --stroke: #7a41eb;
  --fill: #ddd7fc;
  --marker: #403dc6;
}

svg {
  width: 100%;
  height: auto;
}
</style>
