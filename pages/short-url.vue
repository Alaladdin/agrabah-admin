<template>
  <div class="space-y-15 mb-15">
    <form class="flex flex-col self-center space-y-5 w-2/5" @submit.prevent="addNewUrl">
      <div class="space-y-3">
        <b-input
          v-model="description"
          label="Description"
          placeholder="Description"
          :variant="{ 'danger' : !isDescriptionValid }"
        />
        <b-input
          v-model="url"
          label="Url"
          placeholder="https://"
          :variant="{ 'danger' : !isUrlValid }"
        />
      </div>

      <b-button class="self-end w-full" variant="indigo" :disabled="isAddButtonDisabled">Add</b-button>
    </form>

    <div v-if="data && data.length" class="short-url__body">
      <div v-for="urlData in data" :key="urlData._id" class="short-url__item">
        <div class="flex flex-col space-y-1">
          <div class="flex space-x-2">
            <span class="font-semibold">{{ urlData.description }}</span>
            <span class="select-none">—</span>
            <span class="text-purple-700 cursor-pointer select-none" @click="copyToClipboard(urlData.shortUrl)">{{ urlData.shortId }}</span>
          </div>

          <a :href="urlData.url" class="text-gray-400">{{ urlData.url }}</a>
        </div>

        <div class="flex space-x-2">
          <!-- <b-button class="show-on-hover !px-1.5" after-icon="pencil" variant="indigo" :disabled="isRemoving" @click="startEditing(urlData)" />-->
          <b-button class="show-on-hover !px-1.5" after-icon="xmark" variant="danger" :disabled="isRemoving" @click="removeExistingUrl(urlData)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import PageDefaultMixin from '@/mixins/m-page-default'
import BInput from '@/components/b-input'
import BButton from '@/components/b-button'
import { validateUrl } from '@/helpers'

export default {
  name      : 'short-url',
  components: {
    'b-input' : BInput,
    'b-button': BButton,
  },
  mixins: [PageDefaultMixin('short-url')],
  data  : () => ({
    url               : '',
    description       : '',
    editingUrl        : {},
    isRemoving        : false,
    clearDataOnDestroy: false,
  }),
  computed: {
    isUrlValid () {
      return validateUrl(this.url)
    },
    isDescriptionValid () {
      return this.description.trim().length
    },
    isAddButtonDisabled () {
      return !this.isUrlValid || !this.isDescriptionValid
    },
  },
  methods: {
    ...mapActions('short-url', ['addUrl', 'editUrl', 'removeUrl']),

    applyInitialData () {
      this.url = 'https://'
      this.description = ''
    },
    addNewUrl () {
      this.addUrl({
        url        : this.url,
        description: this.description,
      })
        .then(this.applyInitialData)
        .catch(this.$handleError)
    },
    removeExistingUrl (url) {
      this.isRemoving = true

      this.removeUrl(url)
        .catch(this.$handleError)
        .finally(() => {
          this.isRemoving = false
        })
    },
    startEditing (url) {
      this.editingUrl = url
    },
    stopEditing () {
      this.editingUrl = {}
    },
    copyToClipboard (url) {
      navigator.clipboard.writeText(url)
    },
  },
}
</script>
