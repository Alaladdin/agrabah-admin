<template>
  <div class="changes">
    <template v-if="data">
      <t-alert v-if="!data.length" class="alert---bordered" :dismissible="false" show>
        No changes
      </t-alert>

      <template v-if="data.length">
        <b-change-info-plain-modal
          v-if="changeModalData"
          v-model="showChangeModal"
          :change="changeModalData"
          @closed="onCloseChangeModal"
        />

        <b-button
          v-if="user.isOwner"
          class="self-end mb-5"
          text="Clear history"
          variant="indigo"
          @click="clearChanges"
        />

        <div class="changes__body">
          <b-change-item
            v-for="change in data"
            :key="change._id"
            class="changes__item"
            :change="change"
            @open-change-modal="openChangeModal"
          />
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import { assign, map } from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import localMetadata from './metadata'
import BChangeItem from './b-change-item'
import { formatDate } from '@/helpers'
import PageDefaultMixin from '@/mixins/m-page-default'
import BButton from '@/components/b-button'
import BChangeInfoPlainModal from '@/components/b-change-info-plain-modal'

export default {
  name      : 'audit',
  components: {
    'b-change-item'            : BChangeItem,
    'b-button'                 : BButton,
    'b-change-info-plain-modal': BChangeInfoPlainModal,
  },
  mixins: [PageDefaultMixin('audit')],
  data () {
    return {
      fieldsInfo        : localMetadata.fieldsInfo,
      changeModalData   : null,
      showChangeModal   : false,
      clearDataOnDestroy: false,
    }
  },
  computed: {
    ...mapGetters({ user: 'getUserData' }),
  },
  watch: {
    data (changes) {
      if (changes)
        this.$setSideBarNotifications('audit', changes.length)
    },
  },
  methods: {
    ...mapActions('audit', ['clearChanges']),

    getPreparedData (changes) {
      return map(changes, (change) => {
        const changedAtDate = formatDate(change.changedAt, 'HH:mm DD.MM')
        const descriptions = map(change.descriptions, this.getFieldInfo)

        return assign({}, change, { descriptions, changedAt: changedAtDate })
      })
    },
    getFieldInfo (field) {
      const fieldInfo = this.fieldsInfo[field.id]

      if (fieldInfo) {
        if (fieldInfo.plain)
          return assign({}, fieldInfo, { value: field })

        if (!fieldInfo.valueGetter)
          return fieldInfo

        return {
          title: fieldInfo.title,
          html : !!fieldInfo.html,
          value: fieldInfo.valueGetter(field),
        }
      }

      return { title: field.id }
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
