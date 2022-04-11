<template>
  <div class="space-y-15 mb-15">
    <form class="flex flex-col self-center space-y-5 w-2/5" @submit.prevent="addNewUrl">
      <div class="space-y-3">
        <b-input
          v-model="description"
          input-class="!py-1.5 text-sm"
          placeholder="Description"
        />

        <div class="flex items-center space-x-2 w-full">
          <b-select
            v-model="protocol"
            :options="protocols"
            class="!py-1.5"
            button-class="py-1.5 border border-indigo-300 focus:ring-indigo-400 focus:ring-opacity-50"
            variant="white"
          />

          <b-input
            v-model="url"
            class="w-full"
            input-class="!py-1.5 text-sm"
            placeholder="Link"
            @input="afterUrlChange"
          />
        </div>
      </div>

      <b-button class="self-end w-full" variant="indigo" :disabled="isFormInvalid">Add</b-button>
    </form>

    <div v-if="data && data.length" class="short-url__body">
      <b-short-url-item
        v-for="urlData in data"
        :key="urlData._id"
        :url-data="urlData"
      />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import BShortUrlItem from './components/b-short-url-item'
import PageDefaultMixin from '@/mixins/m-page-default'
import { getOptionsFromFlatArray, validateUrl } from '@/helpers'
import BInput from '@/components/b-input'
import BButton from '@/components/b-button'
import BSelect from '@/components/b-select'

export default {
  name      : 'short-url',
  components: {
    'b-select'        : BSelect,
    'b-input'         : BInput,
    'b-button'        : BButton,
    'b-short-url-item': BShortUrlItem,
  },
  mixins: [PageDefaultMixin('short-url')],
  data  : () => ({
    url               : '',
    description       : '',
    protocol          : 'https://',
    protocols         : getOptionsFromFlatArray(['https://', 'http://']),
    clearDataOnDestroy: false,
  }),
  computed: {
    fullUrl () {
      return this.protocol + this.url
    },
    isFormInvalid () {
      return !validateUrl(this.fullUrl) || !this.description.trim()
    },
  },
  methods: {
    ...mapActions('short-url', ['addUrl']),

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
    afterUrlChange (newValue) {
      this.url = newValue.replaceAll(/(^\w+:|^)\/\//gim, '')
    },
  },
}
</script>

<style lang='scss'>
@import 'short-url';
</style>
