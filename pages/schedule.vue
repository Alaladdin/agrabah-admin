<template>
  <div>
    <div v-if="!schedule" class="py-2 mb-4 rounded text-center text-xl font-semibold text-gray-500 bg-white shadow-sm">
      Loading...
    </div>

    <div class="flex justify-between mb-4 text-sm">
      <div>
        <button class="btn mr-3" :disabled="schedule && !schedule.length" @click="postVK">
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

    <template v-if="schedule">
      <div class="grid grid-cols-5 rounded-lg overflow-hidden shadow-sm">
        <div v-for="(weekDay, index) in ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ']" :key="index" :class="['bg-white', { 'border-r-1 border-purple-200' : index !== 4 }]">
          <div class="py-3 bg-purple-200 text-purple-600 text-center">
            {{ weekDays[index] }}
          </div>

          <div class="p-3">
            <p class="mb-1 text-right text-xs text-gray-400 font-semibold">
              {{ weekDates[index] }}
            </p>

            <div v-for="(s, scheduleIndex) in getScheduleForWeekDay(weekDay)" :key="scheduleIndex" class="mb-3 rounded text-sm">
              <p class="truncate font-semibold mb-1">
                {{ getAbbreviation(s.discipline) }}
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
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import { each, filter } from 'lodash'
import { getAbbreviation } from '@/helpers'

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
        const date = moment(start, SERVER_DATE_FORMAT).add(i, 'days').format('DD.MM')

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
    ...mapActions({
      loadSchedule: 'schedule/loadSchedule',
      sendMessage : 'vk/sendMessage',
    }),

    getAbbreviation,
    loadScheduleData () {
      this.loadSchedule(this.scheduleOffset)
        .catch(console.error)
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
    postVK () {
      const message = this.getScheduleToPost()

      if (message.length) this.sendMessage({ message })
    },
    getScheduleToPost () {
      if (!this.schedule.length) return []

      const msg = []

      each(this.schedule, (s) => {
        const schedule = []
        const disciplineAbbr = this.getAbbreviation(s.discipline)

        schedule.push(`[${s.dayOfWeekString}] ${s.date} -  ${disciplineAbbr}`)
        schedule.push(`Тип: ${s.kindOfWork}`)

        if (s.group) schedule.push(`Группа: ${s.group}`)
        if (s.building !== '-') schedule.push(`Место сбора: ${s.auditorium} · ${s.building}`)

        msg.push(schedule.join('\n'))
      })

      return msg.join('\n\n')
    },
  },
}
</script>
