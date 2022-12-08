<template>
  <div class="space-y-10">
    <div v-if="changes?.length">
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
import AuditBody from '@/pages/audit/audit-body'

export default {
  name      : 'home',
  components: {
    'audit-body': AuditBody,
  },
  computed: {
    ...mapGetters({
      changes: 'audit/getData',
    }),
  },
}
</script>
