<template>
  <div>
    <div v-if="!schedule" class="py-3 mb-5 rounded text-center text-xl font-semibold text-gray-500 bg-white shadow">
      Loading...
    </div>

    <template v-if="schedule">
      <div v-if="!schedule.length" class="py-3 mb-5 rounded text-center text-xl font-semibold text-red-500 bg-white shadow">
        No schedule for this date
      </div>

      <div v-if="schedule.length" class="grid grid-cols-5 mb-4 rounded-lg overflow-hidden shadow-sm">
        <div v-for="(weekDay, index) in ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ']" :key="index" class="bg-white" :class="{ 'border-r-1 border-purple-200' : index !== 4 }">
          <div class="py-3 bg-purple-200 text-purple-600 text-center">
            {{ weekDays[index] }}
          </div>

          <div class="p-3">
            <p class="mb-1 text-right text-xs text-gray-400 font-semibold">
              {{ weekDates[index] }}
            </p>

            <div v-for="(s, scheduleIndex) in getScheduleForWeekDay(weekDay)" :key="scheduleIndex">
              <p v-if="s.noLessons" class="mt-2 p-2 rounded text-center text-sm bg-green-300 text-green-700">
                No lessons
              </p>

              <div v-if="!s.noLessons" class="mb-3 rounded text-sm">
                <p class="truncate font-semibold mb-1">
                  {{ s.discipline }}
                </p>

                <div class="text-xs text-gray-500">
                  <p>{{ s.kindOfWork }}</p>

                  <p v-if="s.group">
                    {{ s.group }}
                  </p>

                  <p v-if="s.building !== '-'">
                    {{ s.auditorium }} · ({{ s.building }})
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div class="flex justify-between text-sm">
      <div>
        <button class="btn mr-3" disabled>
          Post to VK
        </button>

        <button class="btn btn--indigo" disabled>
          Post to DIS
        </button>
      </div>

      <div>
        <button class="btn btn--white mr-3" @click="changeWeek(false)">
          <fa icon="chevron-left" />
        </button>

        <button class="btn btn--white" @click="changeWeek(true)">
          <fa icon="chevron-right" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import { filter } from 'lodash'

const SERVER_DATE_FORMAT = 'YYYY.MM.DD'

export default {
  name: 'Schedule',
  data () {
    const start = moment().startOf('isoWeek').format(SERVER_DATE_FORMAT)
    const finish = moment().endOf('isoWeek').format(SERVER_DATE_FORMAT)

    return {
      scheduleOffset: { start, finish },
      weekDays      : moment.weekdaysShort().splice(1),
    }
  },
  computed: {
    ...mapGetters('schedule', { schedule: 'getSchedule' }),

    weekDates () {
      const { start } = this.scheduleOffset
      const dates = []

      for (let i = 0; i < 5; i++) {
        const date = moment(start, SERVER_DATE_FORMAT).add(i, 'days').format('DD')

        dates.push(date)
      }

      return dates
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
      this.loadSchedule(this.scheduleOffset).catch(console.error)
    },
    getScheduleForWeekDay (weekDay) {
      const schedule = filter(this.schedule, s => s.dayOfWeekString.toLowerCase() === weekDay.toLowerCase())

      return schedule.length ? schedule : [{ noLessons: true }]
    },
    changeWeek (isNext = true) {
      const { start, finish } = this.scheduleOffset
      const amount = isNext ? 7 : -7

      this.scheduleOffset.start = moment(start, SERVER_DATE_FORMAT).add(amount, 'days').format(SERVER_DATE_FORMAT)
      this.scheduleOffset.finish = moment(finish, SERVER_DATE_FORMAT).add(amount, 'days').format(SERVER_DATE_FORMAT)
    },
  },
}
</script>
