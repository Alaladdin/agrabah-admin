<template>
  <figure class="flex flex-col items-center" @click="onClick">
    <NuxtImg
      preset="default"
      :class="[avatarClass, imageClass]"
      :src="avatarUrl"
      :width="avatarSize"
      :height="avatarSize"
      :alt="user.username"
    />
    <figcaption v-if="title" class="badge mt-5">{{ title }}</figcaption>
  </figure>
</template>

<script>
export default {
  name : 'Avatar',
  props: {
    user: {
      type   : Object,
      default: () => ({}),
    },
    size: {
      type   : String,
      default: 'small',
    },
    title: {
      type   : String,
      default: '',
    },
    imageClass: {
      type   : [String, Array, Object],
      default: '',
    },
  },
  computed: {
    avatarClass () {
      const fixedClasses = 'rounded-full ring-8 ring-violet-300 shadow-sm object-cover'

      return [fixedClasses, ...this.avatarClassBySize[this.size]]
    },
    avatarSize () {
      return this.avatarSizes[this.size] + 'px'
    },
    avatarUrl () {
      return this.user.avatar || 'avatar__default.jpg'
    },
  },
  created () {
    this.initStaticVariables()
  },
  methods: {
    initStaticVariables () {
      const defaultSize = 16

      this.avatarSizes = {
        small     : defaultSize * 3,
        medium    : defaultSize * 4,
        large     : defaultSize * 6,
        extraLarge: defaultSize * 10,
      }

      this.avatarClassBySize = {
        small     : ['ring-4'],
        medium    : ['ring-4'],
        large     : ['ring-5'],
        extraLarge: ['ring-8'],
      }
    },
    onClick (e) {
      this.$emit('click', e)
    },
  },
}
</script>
