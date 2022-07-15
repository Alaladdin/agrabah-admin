<template>
  <div
    class="badge fixed top-3 right-3 !p-0 font-semibold select-none"
    :class="{
      'animate-pulse' : isLoading,
      '!bg-red-50' : isLoadingError,
    }"
  >
    <div class="px-3 py-1 cursor-pointer text-center" @click="toggleBadge">
      <fa class="mr-1" icon="code-branch" />
      <span>{{ packageData.version }}</span>
    </div>

    <div v-if="isOpened && isLoaded && !isLoading">
      <div class="py-3 text-center bg-gray-100">
        <b-avatar
          class="mb-2"
          :user="{ avatar: packageData.committer.avatar }"
          provider="ipx"
          size="extraSmall"
        />
        <p>{{ packageData.committer.name }}</p>
        <p class="text-gray-400">{{ packageData.committer.date }}</p>
      </div>

      <b-button
        class="!py-2 !text-xs"
        text="GitHub"
        variant="white"
        target="_blank"
        :href="packageData.committer.url"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import BAvatar from '@/components/b-avatar'
import BButton from '@/components/b-button'

export default {
  name      : 'b-app-version',
  components: {
    'b-button': BButton,
    'b-avatar': BAvatar,
  },
  data: () => ({
    isOpened      : false,
    isLoading     : false,
    isLoaded      : false,
    isLoadingError: false,
  }),
  computed: {
    ...mapGetters({ packageData: 'getPackageData' }),
  },
  created () {
    this.loadAppVersion()
  },
  methods: {
    ...mapActions(['loadAppVersion', 'loadBranchData']),

    toggleBadge () {
      this.isOpened = !this.isOpened

      if (!this.isLoaded && !this.isLoadingError) {
        this.isLoading = true

        this.loadBranchData()
          .then(() => {
            this.isLoaded = true
          })
          .catch(() => {
            this.isLoadingError = true
          })
          .finally(() => {
            this.isLoading = false
          })
      }
    },
  },
}
</script>
