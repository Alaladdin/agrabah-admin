<template>
  <div>
    <div class="mb-5">
      <span class="px-2 py-1 mr-3 rounded bg-white shadow-sm">Start: {{ selectedDates.start }}</span>
      <span class="px-2 py-1 rounded bg-white shadow-sm">Finish: {{ selectedDates.finish }}</span>
    </div>

    <div v-if="!schedule" class="py-3 mb-5 rounded text-center text-xl font-semibold text-gray-500 bg-white shadow">
      Loading...
    </div>

    <template v-if="schedule">
      <div v-if="!schedule.length" class="py-3 mb-5 rounded text-center text-xl font-semibold text-red-500 bg-white shadow">
        No schedule for this date
      </div>

      <div v-for="(s, index) in schedule" :key="index" class="p-3 mb-5 rounded shadow-sm bg-white">
        <div class="pb-2 border-b">
          <span class="font-bold">{{ s.dayOfWeekString.toUpperCase() }}</span> –
          <span>{{ s.date }}</span>
          <span class="text-xs text-gray-600">[{{ s.kindOfWork }}]</span>
        </div>
        <div class="py-2 font-semibold">
          {{ s.discipline }}
        </div>
        <div class="mb-2 text-sm">
          {{ s.beginLesson }} - {{ s.endLesson }}
        </div>

        <div v-if="s.group" class="text-xs text-gray-500">
          Группа: {{ s.group }}
        </div>

        <div v-if="s.building !== '-'" class="text-sm text-gray-500">
          {{ s.auditorium }} · <span class="text-xs">({{ s.building }})</span>
        </div>
      </div>
    </template>

    <div class="flex justify-between">
      <div>
        <button class="btn mr-3">
          Post to VK
        </button>

        <button class="btn btn--indigo">
          Post to DIS
        </button>
      </div>

      <div>
        <button class="btn mr-3" @click="goPrevWeek">
          Prev
        </button>
        <button class="btn mr-3" @click="goNextWeek">
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { clone } from 'lodash'
import moment from 'moment'

const SERVER_DATE_FORMAT = 'YYYY.MM.DD'
const DEFAULT_DATE_FORMAT = 'DD.MM'

export default {
  name: 'Schedule',
  data () {
    const start = moment().startOf('isoWeek').format(SERVER_DATE_FORMAT)
    const finish = moment().endOf('isoWeek').format(SERVER_DATE_FORMAT)

    return {
      schedule      : null,
      scheduleOffset: { start, finish },
    }
  },
  computed: {
    ...mapGetters('schedule', { inSchedule: 'getSchedule' }),

    selectedDates () {
      const { start, finish } = this.scheduleOffset

      return {
        start : moment(start).format(DEFAULT_DATE_FORMAT),
        finish: moment(finish).format(DEFAULT_DATE_FORMAT),
      }
    },
  },
  watch: {
    scheduleOffset: {
      immediate: true,
      deep     : true,
      handler () {
        this.loadScheduleData()
      },
    },
  },
  methods: {
    ...mapActions('schedule', ['loadSchedule']),

    loadScheduleData () {
      this.loadSchedule(this.scheduleOffset)
        .then(this.getScheduleData)
        .catch(console.error)
    },
    getScheduleData () {
      this.schedule = clone(this.inSchedule)
    },
    goNextWeek () {
      const { start, finish } = this.scheduleOffset

      this.scheduleOffset.start = moment(start).add('7', 'days').format(SERVER_DATE_FORMAT)
      this.scheduleOffset.finish = moment(finish).add('7', 'days').format(SERVER_DATE_FORMAT)
    },
    goPrevWeek () {
      const { start, finish } = this.scheduleOffset

      this.scheduleOffset.start = moment(start).subtract('7', 'days').format(SERVER_DATE_FORMAT)
      this.scheduleOffset.finish = moment(finish).subtract('7', 'days').format(SERVER_DATE_FORMAT)
    },
  },
}
</script>
