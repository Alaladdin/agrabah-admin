<template>
  <div>
    <b-user-info
      class="mr-10 text-sm"
      :user="change.changedBy"
      avatar-size="extraSmall"
    />

    <div class="changes__item-description">
      <p class="mr-2 font-semibold">Modified:</p>

      <div v-for="(description, i) in change.descriptions" :key="i" class="mr-1">
        <p v-if="!description.value" class="text-sm">
          {{ getChangeTitle(change, i) }}
        </p>

        <v-menu v-else :delay="{ show: 100, hide: 100 }">
          <b-button
            v-if="description.plain"
            :text="getChangeTitle(change, i)"
            variant="link"
            @click="openChangeModal(description, change.changedAt)"
          />

          <p v-else class="font-semibold text-purple-400">
            {{ getChangeTitle(change, i) }}
          </p>

          <template #popper>
            <b-change-info-plain v-if="description.plain" :change="description" />
            <template v-else>
              <p v-if="description.html" class="font-mono text-sm" v-html="description.value" />
              <p v-else class="font-mono text-sm">{{ description.value }}</p>
            </template>
          </template>
        </v-menu>
      </div>
    </div>

    <div class="flex items-center ml-auto">
      <div class="text-xs font-mono text-gray-400">{{ change.changedAt }}</div>
    </div>
  </div>
</template>

<script>
import BUserInfo from '@/components/b-user-info'
import BButton from '@/components/b-button'
import { BChangeInfoPlain } from '@/components/b-change-info-plain-modal'

export default {
  name      : 'b-change-item',
  components: {
    'b-user-info'        : BUserInfo,
    'b-button'           : BButton,
    'b-change-info-plain': BChangeInfoPlain,
  },
  props: {
    change: {
      type   : Object,
      default: () => ({}),
    },
  },
  methods: {
    getChangeTitle (change, index) {
      const description = change.descriptions[index]
      const needComma = index + 1 !== change.descriptions.length

      return description.title + (needComma ? ',' : '')
    },
    openChangeModal (change, changedAt) {
      this.$emit('open-change-modal', change, changedAt)
    },
  },
}
</script>
