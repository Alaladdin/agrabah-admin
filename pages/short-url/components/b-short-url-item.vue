<template>
  <div class="short-url__item">
    <div class="flex flex-col space-y-1">
      <div class="flex items-center space-x-2">
        <b-input
          v-if="editingUrl"
          v-model="editingUrl.description"
          input-class="!py-1.2 text-sm"
          placeholder="Description"
        />
        <span v-if="!editingUrl" class="font-semibold">{{ urlData.description }}</span>
        <span class="select-none">—</span>
        <span class="text-indigo-500 text-xs cursor-pointer select-none" @click="copyToClipboard">{{ urlData.shortId }}</span>
      </div>

      <a :href="urlData.url" class="text-gray-400" target="_blank">{{ urlData.url }}</a>
    </div>

    <div class="flex space-x-2 show-on-hover">
      <template v-if="editingUrl">
        <b-button class="!px-1.5" after-icon="floppy-disk" variant="indigo" :disabled="isFormInvalid" @click="editExistingUrl" />
        <b-button class="!px-1.5" after-icon="xmark" variant="danger" @click="stopEditing" />
      </template>

      <template v-if="!editingUrl">
        <b-button class="!px-1.5" after-icon="pencil" variant="indigo" @click="startEditing" />
        <b-button class="!px-1.5" after-icon="trash-can" variant="danger" @click="removeExistingUrl" />
      </template>
    </div>

    <div class="badge badge--indigo hide-on-hover space-x-1.5 font-semibold text-gray-600">
      <span>{{ urlData.visitedTimes }}</span>
      <fa icon="rocket" class="text-sm" />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import BButton from '@/components/b-button'
import BInput from '@/components/b-input'
import { clone } from '@/helpers'

export default {
  name      : 'b-short-url-item',
  components: {
    'b-input' : BInput,
    'b-button': BButton,
  },
  props: {
    urlData: {
      type   : Object,
      default: () => ({}),
    },
  },
  data: () => ({
    editingUrl: null,
  }),
  computed: {
    isFormInvalid () {
      return !this.editingUrl.description.trim()
    },
  },
  methods: {
    ...mapActions('short-url', ['editUrl', 'removeUrl']),

    copyToClipboard () {
      const { shortUrl } = this.urlData

      navigator.clipboard.writeText(shortUrl)
        .then(() => this.$toast.default(`Copied: "${shortUrl}"`))
        .catch(() => this.$toast.error('Copying error'))
    },
    editExistingUrl () {
      this.editUrl(this.editingUrl)
        .then(this.stopEditing)
        .catch(this.$handleError)
    },
    removeExistingUrl () {
      this.removeUrl(this.urlData)
        .catch(this.$handleError)
    },
    startEditing () {
      this.editingUrl = clone(this.urlData)
    },
    stopEditing () {
      this.editingUrl = null
    },
  },
}
</script>
