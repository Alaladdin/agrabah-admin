<template>
  <div>
    <div class="flex justify-end mb-5 text-sm">
      <Button class="mr-5" text="Current week" @click="applyInitialScheduleDates" />
      <Button class="mr-3" btn-style="white" icon-before="chevron-left" @click="changeWeek(false)" />
      <Button btn-style="white" icon-after="chevron-right" @click="changeWeek(true)" />
    </div>

    <div class="schedule">
      <div v-for="(weekDay, index) in ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ']" :key="index" class="schedule__item">
        <p class="schedule__header-item">{{ weekDays[index] }}</p>
        <div class="p-3 mh-10">
          <p class="schedule__date">{{ weekDates[index] }}</p>
          <div v-for="(s, scheduleIndex) in getScheduleForWeekDay(weekDay)" :key="scheduleIndex" class="mb-4 rounded text-sm">
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

const SERVER_DATE_FORMAT = 'YYYY.MM.DD'

export default {
  name: 'Schedule',
  data () {
    return {
      scheduleOffset: { start: null, finish: null },
      weekDays      : moment.weekdaysShort().splice(1),
      requestId     : null,
    }
  },
  computed: {
    ...mapGetters('schedule', { schedule: 'getSchedule' }),

    weekDates () {
      const { start } = this.scheduleOffset
      const dates = []

      for (let i = 0; i < 5; i++) {
        const date = moment(start, SERVER_DATE_FORMAT).add(i, 'days').format('DD.MM')

        dates.push(date)
      }

      return dates
    },
  },
  watch: {
    scheduleOffset: {
      deep: true,
      handler () {
        this.loadScheduleData()
      },
    },
  },
  created () {
    this.applyInitialScheduleDates()
  },
  beforeDestroy () {
    this.$store.commit('schedule/CLEAR_DATA')
  },
  methods: {
    ...mapActions({
      loadSchedule: 'schedule/loadSchedule',
      sendMessage : 'vk/sendMessage',
    }),

    applyInitialScheduleDates () {
      const start = moment().startOf('isoWeek').format(SERVER_DATE_FORMAT)
      const finish = moment().endOf('isoWeek').format(SERVER_DATE_FORMAT)

      this.scheduleOffset.start = start
      this.scheduleOffset.finish = finish
    },
    loadScheduleData () {
      this.requestId = generateSmallId()
      const data = assign({}, this.scheduleOffset, { requestId: this.requestId })

      this.loadSchedule(data)
        .catch(this.onFail)
    },
    getScheduleForWeekDay (weekDay) {
      return filter(this.schedule, s => s.dayOfWeekString.toLowerCase() === weekDay.toLowerCase())
    },
    changeWeek (isNext = true) {
      const { start, finish } = this.scheduleOffset
      const amount = isNext ? 7 : -7

      this.scheduleOffset.start = moment(start, SERVER_DATE_FORMAT).add(amount, 'days').format(SERVER_DATE_FORMAT)
      this.scheduleOffset.finish = moment(finish, SERVER_DATE_FORMAT).add(amount, 'days').format(SERVER_DATE_FORMAT)
    },
    onFail (error) {
      this.$store.commit('PUSH_ERROR', parseError(error))
    },
  },
}
</script>
