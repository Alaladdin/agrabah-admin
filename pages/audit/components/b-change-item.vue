<template>
  <div class="changes__item">
    <div class="changes__item-content">
      <b-user-info
        class="mr-10 text-sm"
        :user="change.changedBy"
        avatar-size="extraSmall"
      />

      <div class="changes__item-description">
        <p class="text-sm space-x-1">
          <b-button
            class="!inline-block font-bold"
            :class="{ 'text-gray-700 cursor-default': !change.route }"
            :text="change.title"
            :to="change.route || {}"
            :variant="change.route ? 'link' : 'icon'"
          />
        </p>

        <div v-for="(description, i) in change.descriptions" :key="i" class="mr-1">
          <p v-if="!description.value" class="text-sm">
            {{ getChangeTitle(change, i) }}
          </p>

          <b-button
            v-else-if="description.plain"
            :class="{ 'cursor-default': suppressModal }"
            :text="getChangeTitle(change, i)"
            :variant="suppressModal ? 'icon' : 'link'"
            @click="openChangeModal(description, change.changedAt)"
          />

          <v-menu v-else :delay="{ show: 100, hide: 100 }">
            <p class="font-semibold text-purple-400">
              {{ getChangeTitle(change, i) }}
            </p>

            <template #popper>
              <p v-if="description.html" class="font-mono text-sm" v-html="description.value" />
              <p v-else class="font-mono text-sm">{{ description.value }}</p>
            </template>
          </v-menu>
        </div>
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

export default {
  name      : 'b-change-item',
  components: {
    'b-user-info': BUserInfo,
    'b-button'   : BButton,
  },
  props: {
    change: {
      type   : Object,
      default: () => ({}),
    },
    suppressModal: {
      type   : Boolean,
      default: false,
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
