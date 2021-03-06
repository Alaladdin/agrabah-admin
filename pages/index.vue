<template>
  <div class="space-y-10">
    <b-home-page-loader v-if="!updownStatus" />

    <div class="grid grid-cols-2 gap-4">
      <div v-for="(service, index) in updownStatus" :key="index" class="updown__item">
        <div class="font-semibold text-md text-gray-600">
          {{ service.title }}
          <span v-if="service.linkTitle">
            — <a class="text-blue-500" :href="service.url" target="_blank"> {{ service.linkTitle }}</a>
          </span>
        </div>

        <div class="flex justify-between items-center">
          <p :class="['mr-3', getTextOnlineClass(service.isOnline)]">
            {{ getIndicatorText(service.isOnline) }}
          </p>

          <span class="relative flex h-2.5 w-2.5">
            <span :class="['updown__online-indicator', getBgOnlineClass(service.isOnline)]" />
            <span v-if="service.isOnline" class="updown__online-pulse animate-ping bg-green-400" />
          </span>
        </div>
      </div>
    </div>

    <div v-if="changes && changes.length">
      <p class="mb-3 font-semibold text-gray-600">
        Last changes
      </p>

      <audit-body
        class="max-h-100 !overflow-y-auto"
        :limit="10"
        suppress-modal
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BHomePageLoader from './index/components/b-home-page-loader'
import AuditBody from '@/pages/audit/audit-body'

export default {
  name      : 'home',
  components: {
    'audit-body'        : AuditBody,
    'b-home-page-loader': BHomePageLoader,
  },
  computed: {
    ...mapGetters({
      updownStatus: 'updown/getUpdownStatus',
      changes     : 'audit/getData',
    }),
  },
  methods: {
    getIndicatorText (isOnline) {
      return isOnline ? 'online' : 'offline'
    },
    getBgOnlineClass (isOnline) {
      return isOnline ? 'bg-green-400' : 'bg-red-400'
    },
    getTextOnlineClass (isOnline) {
      return isOnline ? 'text-green-400' : 'text-red-400'
    },
  },
}
</script>
