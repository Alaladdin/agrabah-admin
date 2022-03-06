<template>
  <figure class="flex flex-col items-center" @click="onClick">
    <nuxt-img
      provider="cloudinary"
      preset="avatar"
      :class="[avatarClass, imageClass]"
      :src="avatarUrl"
      :width="avatarSize"
      :height="avatarSize"
      crossorigin="anonymous"
      preload
      @error.native="onImageLoadError"
    />
  </figure>
</template>

<script>
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
  }),
  computed: {
    avatarClass () {
      const fixedClasses = 'rounded-full ring-8 ring-violet-300 shadow-sm object-cover'

      return [fixedClasses, ...this.avatarClassBySize[this.size]]
    },
    avatarSize () {
      return this.avatarSizes[this.size] + 'px'
    },
  },
  watch: {
    url: {
      immediate: true,
      handler (newUrl) {
        this.avatarUrl = newUrl || process.env.DEFAULT_AVATAR_IMAGE
      },
    },
  },
  created () {
    this.initStaticVariables()
  },
  methods: {
    initStaticVariables () {
      const defaultSize = 16

      this.avatarSizes = {
        extraSmall: defaultSize * 2.5,
        small     : defaultSize * 3,
        medium    : defaultSize * 4,
        large     : defaultSize * 6,
        extraLarge: defaultSize * 10,
      }

      this.avatarClassBySize = {
        extraSmall: ['ring-3'],
        small     : ['ring-4'],
        medium    : ['ring-4'],
        large     : ['ring-5'],
        extraLarge: ['ring-8'],
      }
    },
    onImageLoadError () {
      this.avatarUrl = process.env.ERROR_AVATAR_IMAGE
    },
    onClick () {
      this.$emit('click')
    },
  },
}
</script>
