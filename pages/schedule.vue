<template>
  <div>
    <div class="flex justify-end mb-5 text-sm">
      <t-button class="mr-5" text="Current week" @click="applyInitialScheduleDates" />
      <t-button class="mr-3" variant="white" @click="changeWeek(false)">
        <fa icon="chevron-left" />
      </t-button>
      <t-button variant="white" @click="changeWeek(true)">
        <fa icon="chevron-right" />
      </t-button>
    </div>
    <div class="schedule">
      <div v-for="(u, i) in 5" :key="i" class="schedule__item">
        <p class="schedule__header-item">{{ weekDays[i] }}</p>
        <div :class="getCellClasses(weekDates[i])">
          <p class="schedule__date">{{ weekDates[i] }}</p>
          <div v-for="(s, scheduleIndex) in getScheduleForDate(weekDates[i])" :key="scheduleIndex" class="mb-4 rounded text-sm">
            <p class="truncate font-semibold mb-1">{{ s.disciplineAbbr }}</p>
            <div class="text-xs text-gray-500">
              <p>{{ s.kindOfWork }}</p>
              <p v-if="s.group">{{ s.group }}</p>
              <p v-if="s.building !== '-'">{{ s.auditorium }} · ({{ s.building }})</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import { assign, filter } from 'lodash'
import { generateSmallId, parseError } from '@/helpers'

const DEFAULT_DATE_FORMAT = 'DD.MM'
const COMPARE_DATE_FORMAT = 'MM.DD'
const SERVER_DATE_FORMAT = 'YYYY.MM.DD'

export default {
  name: 'Schedule',
  data () {
    return {
      scheduleOffset    : { start: null, finish: null },
      weekDays          : moment.weekdaysShort().splice(1),
      todayDateFormatted: moment().format(COMPARE_DATE_FORMAT),
      isLoading         : false,
    }
  },
  computed: {
    ...mapGetters('schedule', { schedule: 'getSchedule' }),

    queryData () {
      return assign({}, this.scheduleOffset, { requestId: generateSmallId() })
    },
    weekDates () {
      const { start } = this.scheduleOffset
      const dates = []

      for (let i = 0; i < 5; i++) {
        const date = moment(start, SERVER_DATE_FORMAT).add(i, 'days').format(DEFAULT_DATE_FORMAT)

        dates.push(date)
      }

      return dates
    },
  },
  watch: {
    'scheduleOffset.start' (v) {
      if (v) this.loadScheduleData()
    },
  },
  created () {
    this.applyInitialScheduleDates()
  },
  beforeDestroy () {
    this.$store.commit('schedule/CLEAR_DATA')
  },
  methods: {
    ...mapActions('schedule', ['loadSchedule']),

    applyInitialScheduleDates () {
      this.scheduleOffset.start = moment().startOf('isoWeek').format(SERVER_DATE_FORMAT)
      this.scheduleOffset.finish = moment().endOf('isoWeek').format(SERVER_DATE_FORMAT)
    },
    loadScheduleData () {
      this.isLoading = true

      this.loadSchedule(this.queryData)
        .catch(this.onFail)
        .finally(() => {
          this.isLoading = false
        })
    },
    onFail (error) {
      this.$store.commit('PUSH_ERROR', parseError(error))
    },
    getScheduleForDate (date) {
      return filter(this.schedule, s => s.date === date)
    },
    changeWeek (isNext = true) {
      const { start, finish } = this.scheduleOffset
      const offsetAmount = isNext ? 7 : -7

      this.scheduleOffset.start = moment(start, SERVER_DATE_FORMAT).add(offsetAmount, 'days').format(SERVER_DATE_FORMAT)
      this.scheduleOffset.finish = moment(finish, SERVER_DATE_FORMAT).add(offsetAmount, 'days').format(SERVER_DATE_FORMAT)
    },
    getCellClasses (cellDate) {
      const fixedClasses = 'p-3 h-full transition duration-100'
      const cellDateFormatted = moment(cellDate, DEFAULT_DATE_FORMAT).format(COMPARE_DATE_FORMAT)

      return [
        fixedClasses, {
          'opacity-50'            : this.isLoading,
          'opacity-50 bg-gray-100': this.todayDateFormatted > cellDateFormatted,
          'bg-violet-50'          : this.todayDateFormatted === cellDateFormatted,
        },
      ]
    },
  },
}
</script>
