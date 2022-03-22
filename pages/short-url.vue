<template>
  <div class="space-y-15 mb-15">
    <form class="flex flex-col self-center space-y-5 w-2/5" @submit.prevent="addNewUrl">
      <div class="space-y-3">
        <b-input
          v-model="description"
          input-class="!py-1.6 text-sm"
          placeholder="Description"
        />

        <div class="flex items-center space-x-2 w-full">
          <t-select v-model="protocol" class="!py-2" :options="protocols" />
          <b-input
            v-model="url"
            class="w-full"
            input-class="!py-1.6 text-sm"
            placeholder="Link"
            @input="afterUrlChange"
          />
        </div>
      </div>

      <b-button class="self-end w-full" variant="indigo" :disabled="isFormInvalid">Add</b-button>
    </form>

    <div v-if="data && data.length" class="short-url__body">
      <div v-for="urlData in data" :key="urlData._id" class="short-url__item">
        <div class="flex flex-col space-y-1">
          <div class="flex space-x-2">
            <span class="font-semibold">{{ urlData.description }}</span>
            <span class="select-none">—</span>
            <span class="text-purple-700 cursor-pointer select-none" @click="copyToClipboard(urlData.shortUrl)">{{ urlData.shortId }}</span>
          </div>

          <a :href="urlData.url" class="text-gray-400" target="_blank">{{ urlData.url }}</a>
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
    protocol          : 'https://',
    protocols         : ['https://', 'http://'],
    editingUrl        : {},
    isRemoving        : false,
    clearDataOnDestroy: false,
  }),
  computed: {
    fullUrl () {
      return this.protocol + this.url
    },
    isFormInvalid () {
      return !validateUrl(this.fullUrl) || !this.description.trim().length
    },
  },
  methods: {
    ...mapActions('short-url', ['addUrl', 'editUrl', 'removeUrl']),

    addNewUrl () {
      const urlData = {
        url        : this.fullUrl,
        description: this.description,
      }

      this.addUrl(urlData)
        .then(() => {
          this.url = ''
          this.description = ''
        })
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
    afterUrlChange (newValue) {
      this.url = newValue.replaceAll(/(^\w+:|^)\/\//gim, '')
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
