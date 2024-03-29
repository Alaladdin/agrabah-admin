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

      <b-changes-body @open-change-modal="openChangeModal" />

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
import ChangesBody from '@/pages/index/components/b-changes-body'
import { setToLocalStorage } from '@/helpers'
import PageDefaultMixin from '@/mixins/m-page-default'
import Button from '@/components/b-button'
import ChangeInfoPlainModal from '@/components/b-change-info-plain-modal'
import Alert from '@/components/b-alert'

export default {
  name      : 'home',
  components: {
    'b-changes-body'           : ChangesBody,
    'b-alert'                  : Alert,
    'b-button'                 : Button,
    'b-change-info-plain-modal': ChangeInfoPlainModal,
  },
  mixins: [PageDefaultMixin('changes')],
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
        if (changes?.length) {
          setToLocalStorage('last_viewed_change_id', changes[0]._id)

          this.$setSideBarNotifications('index', changes)
        }
      },
    },
  },
  methods: {
    ...mapActions('changes', ['clearChanges']),

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
