<template>
  <div ref="chartWrapper" class="px-5 py-3 rounded shadow-sm w-full bg-white" :class="`theme-${theme}`">
    <div ref="chart" class="flex h-30" />

    <div class="space-y-1 text-xs font-mono">
      <p ref="chartTitle" class="text-gray-600 font-semibold" />
      <p ref="chartDesc" />
    </div>
  </div>
</template>

<script>
import { map, last, findIndex } from 'lodash'
import { formatDate } from '@/helpers'

const d3 = process.client && require('d3')

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
    theme: {
      type   : String,
      default: '',
    },
    valueGetter: {
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
    getSortedData (data) {
      const formattedData = map(data, item => ({
        [this.dataKey]: item[this.dataKey] || 0,
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
      this.xScale = d3.scaleLinear().domain(xDomain).range([0, this.areaWidth])
      this.yScale = d3.scaleLinear().domain(yDomain).range([this.areaHeight, 0])
      this.svg = d3
        .select(chart)
        .append('svg')
        .attr('width', this.areaWidth)
        .attr('height', this.areaHeight)
        .attr('viewBox', `0 0 ${this.areaWidth} ${this.areaHeight}`)

      this.drawArea()
      this.drawLine()
      this.drawMarkerLine()
      this.setChartInfo(last(this.currentData), this.title)

      this.svg.on('mousemove', this.onMouseMove)
      this.svg.on('mouseleave', this.onMouseLeave)
    },
    drawArea () {
      const areaGenerator = d3
        .area()
        .x(i => this.xScale(this.getXAccessor(i)))
        .y1(i => this.yScale(this.getYAccessor(i)))
        .y0(this.areaHeight)
        .curve(d3.curveBumpX)

      const area = this.svg
        .append('path')
        .datum(this.currentData)
        .attr('d', areaGenerator)
        .attr('width', 0)
        .attr('fill', 'var(--area)')

      area
        .transition()
        .ease(d3.easeSin)
        .duration(1000)
        .attr('width', this.areaWidth)
    },
    drawLine () {
      const lineGenerator = d3
        .line()
        .x(i => this.xScale(this.getXAccessor(i)))
        .y(i => this.yScale(this.getYAccessor(i)))
        .curve(d3.curveBumpX)

      const line = this.svg
        .append('path')
        .datum(this.currentData)
        .attr('d', lineGenerator)
        .attr('stroke', 'var(--line)')
        .attr('stroke-width', 5)
        .attr('fill', 'none')

      const lineLength = line.node().getTotalLength()

      line
        .attr('stroke-dashoffset', lineLength)
        .attr('stroke-dasharray', lineLength)
        .transition(this.getTransition())
        .attr('stroke-dashoffset', 0)
    },
    drawMarkerLine () {
      this.markerLine = this.svg
        .append('line')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', 0)
        .attr('y2', this.areaHeight)
        .attr('stroke-width', 3)
        .attr('stroke', 'var(--marker, var(--line))')
        .attr('opacity', 0)

      this.markerDot = this.svg
        .append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 8)
        .attr('fill', 'var(--marker, var(--line))')
        .attr('opacity', 0)
    },
    onMouseMove (e) {
      const { item, x, y } = this.getMovingData(e)
      const transition = this.getTransition(50)

      this.markerLine
        .attr('opacity', 1)
        .transition(transition)
        .attr('x1', x)
        .attr('x2', x)

      this.markerDot
        .attr('opacity', 1)
        .transition(transition)
        .attr('cx', x)
        .attr('cy', y)

      this.setChartInfo(item)
    },
    getMovingData (e) {
      const [posX] = d3.pointer(e)
      const date = this.xScale.invert(posX)
      const bisect = d3.bisector(this.getXAccessor)
      const index = bisect.center(this.currentData, date)
      const item = this.currentData[index]

      return {
        item,
        x: this.xScale(this.getXAccessor(item)),
        y: this.yScale(this.getYAccessor(item)),
      }
    },
    getXAccessor (item) {
      return findIndex(this.currentData, { date: item.date })
    },
    getYAccessor (item) {
      return item[this.dataKey]
    },
    getTransition (duration = 1500) {
      return d3.transition().ease(d3.easeSin).duration(duration)
    },
    onMouseLeave () {
      this.markerLine.attr('opacity', 0)
      this.markerDot.attr('opacity', 0)
      this.setChartInfo(last(this.currentData), this.title)
    },
    setChartInfo (item, title) {
      const { chartTitle, chartDesc } = this.$refs
      const newTitle = title || formatDate(item.date, 'DD.MM — HH:mm')

      d3.select(chartTitle).text(newTitle)
      d3.select(chartDesc).text(this.valueGetter(item))
    },
  },
}
</script>

<style lang='scss'>
@import 'b-chart-line';
</style>
