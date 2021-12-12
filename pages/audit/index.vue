<template>
  <div class="changes">
    <template v-if="changes && !changes.length">
      <t-alert class="alert---bordered" :dismissible="false" show>No changes</t-alert>
    </template>

    <t-modal v-if="changeModalData" v-model="showChangeModal" :header="capitalize(changeModalData.title)" @closed="onCloseChangeModal">
      <ChangeInfoPlain :change="changeModalData" type="modal" />
    </t-modal>

    <div v-for="change in changes" :key="change._id" class="changes__item">
      <UserInfo class="mr-10 text-sm" :user="change.changedBy" avatar-size="extraSmall" />

      <div class="changes__item-description">
        <p class="mr-2 font-semibold">Modified:</p>

        <div v-for="(diff, i) in change.diffs" :key="i" class="mr-1">
          <p v-if="!diff.value" class="text-sm">{{ getDiffTitle(change, i) }}</p>
          <VMenu v-else :delay="{ show: 100, hide: 100 }">
            <t-button v-if="diff.plain" variant="link" :text="getDiffTitle(change, i)" @click="openChangeModal(diff)" />
            <p v-else class="font-semibold text-purple-400">{{ getDiffTitle(change, i) }}</p>

            <template #popper>
              <ChangeInfoPlain v-if="diff.plain" :change="diff" />
              <template v-else>
                <p v-if="diff.html" class="font-mono text-sm" v-html="diff.value" />
                <p v-else class="font-mono text-sm">{{ diff.value }}</p>
              </template>
            </template>
          </VMenu>
        </div>
      </div>

      <div class="flex items-center ml-auto">
        <t-button class="mr-5" text="rollback" variant="link" disabled />
        <div class="text-xs font-mono text-gray-400">{{ change.changedAt }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { assign, map, capitalize } from 'lodash'
import localMetadata from './metadata'
import { formatDate } from '@/helpers'

export default {
  name: 'Audit',
  data () {
    return {
      fieldsInfo     : localMetadata.fieldsInfo,
      changes        : null,
      changeModalData: null,
      showChangeModal: false,
    }
  },
  computed: {
    ...mapGetters('audit', { inChanges: 'getChanges' }),
  },
  watch: {
    inChanges (changes) {
      this.changes = this.prepareChanges(changes)
    },
  },
  beforeDestroy () {
    this.$store.commit('audit/CLEAR_DATA')
  },
  created () {
    this.loadChanges()
  },
  methods: {
    ...mapActions('audit', ['loadChanges']),

    capitalize,
    prepareChanges (changes) {
      return map(changes, (change) => {
        const changedAtDate = formatDate(change.changedAt, 'HH:mm DD.MM')
        const diffs = map(change.diffs, this.getFieldInfo)

        return assign({}, change, { diffs, changedAt: changedAtDate })
      })
    },
    getFieldInfo (field) {
      const fieldInfo = this.fieldsInfo[field.id]

      if (fieldInfo) {
        if (fieldInfo.plain)
          return assign({}, fieldInfo, { value: field })

        if (!fieldInfo.valueGetter)
          return fieldInfo

        return { title: fieldInfo.title, html: !!fieldInfo.html, value: fieldInfo.valueGetter(field) }
      }

      return { title: field.id }
    },
    getDiffTitle (change, index) {
      const diff = change.diffs[index]
      const needComma = index + 1 !== change.diffs.length

      return diff.title + (needComma ? ',' : '')
    },
    openChangeModal (change) {
      this.changeModalData = change
      this.showChangeModal = true
    },
    onCloseChangeModal () {
      this.changeModalData = null
    },
  },
}
</script>
