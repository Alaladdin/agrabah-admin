<template>
  <div>
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

    <div class="flex justify-end">
      <button class="btn mr-3">
        Post to VK
      </button>

      <button class="btn btn--indigo">
        Post to DIS
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { clone } from 'lodash'

export default {
  name: 'Schedule',
  data () {
    return {
      schedule: [],
    }
  },
  computed: {
    ...mapGetters('schedule', { inSchedule: 'getSchedule' }),
  },
  created () {
    this.loadScheduleData()
  },
  methods: {
    ...mapActions('schedule', ['loadSchedule']),

    loadScheduleData () {
      this.loadSchedule()
        .then(this.getScheduleData)
        .catch(console.error)
    },
    getScheduleData () {
      this.schedule = clone(this.inSchedule)
    },
  },
}
</script>
