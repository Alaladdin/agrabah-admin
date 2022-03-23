<template>
  <figure class="flex flex-col items-center" @click="onClick">
    <div v-if="isLoading" class="bg-purple-300 rounded-full">
      <div
        class="animate-pulse bg-purple-400"
        :class="[avatarClass, imageClass]"
        :style="{ width: avatarSize, height: avatarSize }"
      />
    </div>

    <nuxt-img
      v-show="!isLoading"
      provider="cloudinary"
      preset="avatar"
      :class="[avatarClass, imageClass]"
      :src="avatarUrl"
      :width="avatarSize"
      :height="avatarSize"
      style="user-drag: none"
      crossorigin="anonymous"
      preload
      @load.native="onLoad"
      @error.native="onLoadError"
    />
  </figure>
</template>

<script>
import localMetadata from './metadata'

export default {
  name : 'b-avatar',
  props: {
    url: {
      type   : String,
      default: '',
    },
    size: {
      type     : String,
      default  : 'small',
      validator: v => ['extraSmall', 'small', 'medium', 'large', 'extraLarge'].includes(v),
    },
    imageClass: {
      type   : [String, Array, Object],
      default: '',
    },
  },
  data: () => ({
    avatarUrl: '',
    isLoading: true,
  }),
  computed: {
    avatarClass () {
      const fixedClasses = 'rounded-full ring-8 ring-violet-300 shadow-sm object-cover'
      const avatarClassBySize = localMetadata.avatarClassBySize[this.size]

      return [fixedClasses, ...avatarClassBySize]
    },
    avatarSize () {
      return localMetadata.avatarSizes[this.size] + 'px'
    },
  },
  watch: {
    url: {
      immediate: true,
      handler (newUrl) {
        this.handleUrlChange(newUrl)
      },
    },
  },
  methods: {
    handleUrlChange (newUrl) {
      this.avatarUrl = newUrl || process.env.DEFAULT_AVATAR_IMAGE
      this.isLoading = true
    },
    onLoad () {
      this.isLoading = false
    },
    onLoadError () {
      this.avatarUrl = process.env.ERROR_AVATAR_IMAGE
    },
    onClick () {
      this.$emit('click')
    },
  },
}
</script>
