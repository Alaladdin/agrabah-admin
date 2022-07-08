<template>
  <div class="flex space-x-5">
    <div v-if="data.marks.length" class="bars__table">
      <div
        v-for="mark in data.marks"
        :key="mark.discipline"
        class="bars__table-row"
      >
        <p class="bars__table-row__header">{{ mark.discipline }}</p>
        <p
          v-for="(semesterMark, i) in mark.semester"
          :key="`semesterMark__${i}`"
          class="bars__table-row__mark bars__table-row__mark--semester"
          v-html="semesterMark"
        />
        <p
          v-for="(finalMark, i) in mark.final"
          :key="`finalMark__${i}`"
          class="bars__table-row__mark bars__table-row__mark--final"
        >
          {{ finalMark }}
        </p>
      </div>
    </div>

    <div class="bars__info-bar">
      <div class="flex items-center mb-5">
        <b-avatar class="mr-4" :user="currentUser" size="extraSmall" />
        <div>
          <p class="text-sm font-semibold text-gray-700">{{ data.username }}</p>
          <p class="text-xs text-gray-500">{{ data.updatedAt }}</p>
        </div>
      </div>

      <b-button
        class="mb-2"
        text="Update"
        variant="indigo"
        :disabled="data.isCredentialsError || isUpdating"
        @click="refreshBarsMarks"
      />

      <b-button
        text="Delete"
        variant="danger"
        :disabled="isUpdating"
        @click="removeBarsUser"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import BButton from '@/components/b-button'
import BAvatar from '@/components/b-avatar'

export default {
  name      : 'b-bars-content',
  components: {
    'b-button': BButton,
    'b-avatar': BAvatar,
  },
  props: {
    data: {
      type   : Object,
      default: () => ({}),
    },
    isUpdating: {
      type   : Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters({ currentUser: 'getUserData' }),
  },
  methods: {
    ...mapActions('bars', ['refreshMarks', 'removeUser']),

    refreshBarsMarks () {
      this.refreshMarks()
        .catch(this.$handleError)
    },
    removeBarsUser () {
      this.removeUser()
        .catch(this.$handleError)
    },
  },
}
</script>
