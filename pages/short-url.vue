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
    <template v-if="data">
      <div v-if="data.length" class="flex flex-col p-4 rounded-xl bg-dark-200 text-white text-sm shadow-sm">
        <div v-for="urlData in data" :key="urlData._id" class="flex justify-between items-center px-5 py-4 rounded-xl hover:bg-dark-700">
          <div class="flex flex-col space-y-1">
            <div class="flex space-x-2">
              <span class="font-semibold">{{ urlData.description }}</span>
              <span class="select-none">—</span>
              <span class="cursor-pointer select-none" @click="copyToClipboard(urlData.shortUrl)">{{ urlData.shortId }}</span>
            </div>

            <a :href="urlData.url" class="opacity-60">{{ urlData.url }}</a>
          </div>

          <b-button class="!px-1.5" after-icon="xmark" variant="danger" :disabled="isRemoving" @click="removeExistingUrl(urlData)" />
        </div>
      </div>

      <t-alert v-if="!data.length" class="alert---bordered" :dismissible="false" show>No changes</t-alert>
    </template>
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
    url        : '',
    description: '',
    isRemoving : false,
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
    copyToClipboard (url) {
      navigator.clipboard.writeText(url)
    },
  },
}
</script>
