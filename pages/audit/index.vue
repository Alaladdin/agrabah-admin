<template>
  <div class="changes">
    <template v-if="data && !data.length">
      <t-alert class="alert---bordered" :dismissible="false" show>No changes</t-alert>
    </template>

    <template v-if="data && data.length">
      <t-modal v-if="changeModalData" v-model="showChangeModal" @closed="onCloseChangeModal">
        <template #header>
          <div class="flex items-center">
            <p class="mr-3">{{ capitalize(changeModalData.title) }}</p>
            <p class="text-xs text-gray-400">{{ changeModalData.changedAt }}</p>
          </div>
        </template>

        <change-info-plain :change="changeModalData" type="modal" />
      </t-modal>

      <div v-if="user.isOwner" class="flex justify-end mb-5">
        <b-button text="Clear history" variant="indigo" @click="clearChanges" />
      </div>

      <div v-for="change in data" :key="change._id" class="changes__item">
        <user-info class="mr-10 text-sm" :user="change.changedBy" avatar-size="extraSmall" />

        <div class="changes__item-description">
          <p class="mr-2 font-semibold">Modified:</p>

          <div v-for="(description, i) in change.descriptions" :key="i" class="mr-1">
            <p v-if="!description.value" class="text-sm">{{ getChangeTitle(change, i) }}</p>
            <VMenu v-else :delay="{ show: 100, hide: 100 }">
              <b-button v-if="description.plain" :text="getChangeTitle(change, i)" variant="link" @click="openChangeModal(description, change.changedAt)" />
              <p v-else class="font-semibold text-purple-400">{{ getChangeTitle(change, i) }}</p>

              <template #popper>
                <change-info-plain v-if="description.plain" :change="description" />
                <template v-else>
                  <p v-if="description.html" class="font-mono text-sm" v-html="description.value" />
                  <p v-else class="font-mono text-sm">{{ description.value }}</p>
                </template>
              </template>
            </VMenu>
          </div>
        </div>

        <div class="flex items-center ml-auto">
          <b-button class="mr-5" text="rollback" variant="link" disabled />
          <div class="text-xs font-mono text-gray-400">{{ change.changedAt }}</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { assign, map, capitalize } from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import localMetadata from './metadata'
import { formatDate } from '@/helpers'
import PageDefaultMixin from '@/mixins/m-page-default'

export default {
  name  : 'audit',
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

    capitalize,
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
    getChangeTitle (change, index) {
      const description = change.descriptions[index]
      const needComma = index + 1 !== change.descriptions.length

      return description.title + (needComma ? ',' : '')
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
