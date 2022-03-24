<template>
  <div>
    <div class="flex justify-between mb-5 text-sm">
      <b-checkbox v-model="isShowHiddenFields" class="select-none" text="Show hidden fields" />

      <div class="flex space-x-3">
        <b-button before-icon="chevron-left" variant="white" @click="changeWeek(false)" />
        <b-button variant="white" text="Current week" @click="applyInitialData" />
        <b-button variant="white" before-icon="chevron-right" @click="changeWeek(true)" />
      </div>
    </div>

    <div class="schedule">
      <div v-for="(_, i) in 5" :key="i" class="schedule__item">
        <p class="schedule__header-item">{{ weekDays[i] }}</p>
        <div :class="getCellClasses(weekDates[i])">
          <p class="schedule__date">{{ weekDates[i] }}</p>
          <div v-if="isLoading" class="rounded w-full bg-gray-300 animate-pulse" :class="isShowHiddenFields ? 'h-26' : 'h-18'" />
          <div v-for="(s, scheduleIndex) in getScheduleForDate(weekDates[i])" :key="scheduleIndex" class="mb-4 rounded text-sm">
            <p class="truncate font-semibold mb-1">{{ s.disciplineAbbr }}</p>
            <div class="text-xs text-gray-500">
              <p>{{ s.kindOfWork }}</p>
              <template v-if="isShowHiddenFields">
                <p>{{ s.beginLesson }} - {{ s.endLesson }}</p>
                <p>{{ s.lecturer }}</p>
              </template>
              <p v-if="s.group" class="font-medium">{{ s.group }}</p>
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
import { filter } from 'lodash'
import { getFromLocalStorage, setToLocalStorage } from '@/helpers'
import BButton from '@/components/b-button'
import BCheckbox from '@/components/b-checkbox'

const DEFAULT_DATE_FORMAT = 'DD.MM'
const COMPARE_DATE_FORMAT = 'MM.DD'
const SERVER_DATE_FORMAT = 'YYYY.MM.DD'
const HIDDEN_LABELS_KEY = 'schedule__show_hidden_fields'

export default {
  name      : 'schedule',
  components: {
    'b-button'  : BButton,
    'b-checkbox': BCheckbox,
  },
  data () {
    return {
      scheduleOffset    : { start: null, finish: null },
      isShowHiddenFields: false,
      isLoading         : false,
    }
  },
  computed: {
    ...mapGetters('schedule', { schedule: 'getSchedule' }),

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
    isShowHiddenFields (v) {
      setToLocalStorage(HIDDEN_LABELS_KEY, v)
    },
  },
  created () {
    this.applyInitialData()
  },
  beforeDestroy () {
    this.cancelLoading()
    this.$store.commit('schedule/CLEAR_DATA')
  },
  methods: {
    ...mapActions('schedule', ['loadSchedule', 'cancelLoading']),

    applyInitialData () {
      this.todayFormattedDate = moment().format(COMPARE_DATE_FORMAT)
      this.weekDays = moment.weekdaysShort().splice(1)
      this.scheduleOffset.start = moment().add(2, 'days').startOf('isoWeek').format(SERVER_DATE_FORMAT)
      this.scheduleOffset.finish = moment().add(2, 'days').endOf('isoWeek').format(SERVER_DATE_FORMAT)
      this.isShowHiddenFields = getFromLocalStorage(HIDDEN_LABELS_KEY, false)
    },
    loadScheduleData () {
      this.isLoading = true

      this.loadSchedule(this.scheduleOffset)
        .catch(this.$handleError)
        .finally(() => {
          this.isLoading = false
        })
    },
    getScheduleForDate (date) {
      return filter(this.schedule, { date })
    },
    changeWeek (isNext = true) {
      const { start, finish } = this.scheduleOffset
      const offsetAmount = isNext ? 1 : -1

      this.scheduleOffset.start = moment(start, SERVER_DATE_FORMAT).add(offsetAmount, 'weeks').format(SERVER_DATE_FORMAT)
      this.scheduleOffset.finish = moment(finish, SERVER_DATE_FORMAT).add(offsetAmount, 'weeks').format(SERVER_DATE_FORMAT)
    },
    getCellClasses (cellDate) {
      const fixedClasses = 'p-3 h-full transition duration-100'
      const cellFormattedDate = moment(cellDate, DEFAULT_DATE_FORMAT).format(COMPARE_DATE_FORMAT)

      return [
        fixedClasses, {
          'opacity-50'            : this.isLoading,
          'opacity-50 bg-gray-100': this.todayFormattedDate > cellFormattedDate,
          'bg-purple-50'          : this.todayFormattedDate === cellFormattedDate,
        },
      ]
    },
  },
}
</script>
