<template>
  <div v-if="data" class="changes">
    <b-alert v-if="!data.length" text="No changes" />

    <template v-if="data.length">
      <b-button
        v-if="user.isOwner"
        class="self-end mb-5"
        text="Clear history"
        variant="indigo"
        @click="clearChangesHistory"
      />

      <audit-body @open-change-modal="openChangeModal" />

      <b-change-info-plain-modal
        v-if="changeModalData"
        v-model="showChangeModal"
        :change="changeModalData"
        @closed="onCloseChangeModal"
      />
    </template>
  </div>
</template>

<script>
import { assign } from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import AuditBody from './audit-body'
import { setToLocalStorage } from '@/helpers'
import PageDefaultMixin from '@/mixins/m-page-default'
import BButton from '@/components/b-button'
import BChangeInfoPlainModal from '@/components/b-change-info-plain-modal'
import BAlert from '@/components/b-alert'

export default {
  name      : 'audit',
  components: {
    'audit-body'               : AuditBody,
    'b-alert'                  : BAlert,
    'b-button'                 : BButton,
    'b-change-info-plain-modal': BChangeInfoPlainModal,
  },
  mixins: [PageDefaultMixin('audit')],
  data  : () => ({
    changeModalData   : null,
    showChangeModal   : false,
    clearDataOnDestroy: false,
  }),
  computed: {
    ...mapGetters({ user: 'getUserData' }),
  },
  watch: {
    data: {
      immediate: true,
      handler (changes) {
        if (changes && changes.length) {
          setToLocalStorage('last_viewed_change_id', changes[0]._id)

          this.$setSideBarNotifications('audit', changes)
        }
      },
    },
  },
  methods: {
    ...mapActions('audit', ['clearChanges']),

    clearChangesHistory () {
      this.clearChanges()
        .catch(this.$handleError)
    },
    openChangeModal (change, changedAt) {
      this.changeModalData = assign({}, change, { changedAt })
      this.openModal('showChangeModal')
    },
    onCloseChangeModal () {
      this.changeModalData = null
    },
  },
}
</script>
