<template>
  <div class="flex w-full">
    <div class="flex justify-between mb-3 w-full max-h-120">
      <label class="flex flex-col mr-3 w-full h-full">
        <div class="actuality__textarea-label relative">
          <span>Main</span>
          <span v-show="hasUnsavedChanges('content')" class="badge badge--warn absolute left-0 fade-in">Unsaved changes</span>
        </div>
        <t-textarea v-model="data.content" class="w-full h-full min-h-85 text-sm !resize-y" :disabled="isEditDisabled" :readonly="!user.isAdmin" />
      </label>

      <label class="flex flex-col w-full h-full">
        <div class="actuality__textarea-label relative">
          <span>Lazy</span>
          <span v-show="hasUnsavedChanges('lazyContent')" class="badge badge--warn absolute right-0 fade-in">Unsaved changes</span>
        </div>
        <t-textarea v-model="data.lazyContent" class="w-full h-full min-h-85 text-sm !resize-y" :disabled="isEditDisabled" :readonly="!user.isAdmin" />
      </label>
    </div>

    <div class="flex justify-between items-center rounded select-none">
      <div class="flex font-semibold text-sm gap-2 text-indigo-600 leading-normal">
        <VMenu v-if="updatedAtText" class="rounded shadow-sm bg-indigo-200" :disabled="!user.isAdmin">
          <p class="px-4 py-1">{{ updatedAtText }}</p>

          <template #popper>
            <UserInfo :user="data.updatedBy" class="gap-2" />
          </template>
        </VMenu>

        <div v-if="user.isAdmin && data.shortId" class="rounded shadow-sm bg-indigo-200">
          <p class="px-4 py-1">ID: {{ data.shortId }}</p>
        </div>
      </div>

      <div class="flex">
        <t-button variant="white" text="Refresh" :disabled="isEditDisabled" @click="refresh" />
        <t-button v-if="user.isAdmin" class="ml-2" text="Update" :disabled="isUpdateDisabled" @click="updateActuality" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { formatDate } from '@/helpers'
import PageDefaultMixin from '@/mixins/m-page-default'

export default {
  name  : 'Actuality',
  mixins: [PageDefaultMixin('actuality')],
  data () {
    return {
      data              : {}, // to avoid cannot get 'field' of null while loading
      isUpdating        : false,
      clearDataOnDestroy: false,
    }
  },
  computed: {
    ...mapGetters({ user: 'getUserData' }),

    updatedAtText () {
      const { updatedAt } = this.data

      return updatedAt && `Updated at ${formatDate(updatedAt, 'DD.MM HH:mm')}`
    },
    isUpdateDisabled () {
      const hasChanges = this.hasUnsavedChanges('content') || this.hasUnsavedChanges('lazyContent')

      return this.isEditDisabled || !hasChanges
    },
    isEditDisabled () {
      return this.isLoading || this.isUpdating
    },
  },
  methods: {
    ...mapActions('actuality', ['updateData']),

    updateActuality () {
      this.isUpdating = true

      this.updateData(this.data)
        .catch(this.$handleError)
        .finally(() => {
          this.isUpdating = false
        })
    },
    hasUnsavedChanges (field) {
      if (this.isLoading || !this.inData)
        return false

      return this.data[field] !== this.inData[field]
    },
  },
}
</script>
