<template>
  <figure class="flex flex-col items-center">
    <img class="rounded-full ring-8 ring-violet-300 shadow-sm object-cover" :class="avatarClasses" :src="avatarUrl" :alt="user.username" @click="onClick">
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
      type   : String,
      default: '',
    },
  },
  data () {
    return {
      avatarClassesBySize: {
        small     : ['w-12', 'h-12', 'ring-4'],
        medium    : ['w-16', 'h-16', 'ring-4'],
        large     : ['w-24', 'h-24', 'ring-5'],
        extraLarge: ['w-40', 'h-40', 'ring-8'],
      },
    }
  },
  computed: {
    avatarClasses () {
      const classesBySize = this.avatarClassesBySize[this.size]

      return [...classesBySize, this.imageClass]
    },
    avatarUrl () {
      return this.user.avatar || require('~/assets/img/avatar__default.jpg')
    },
  },
  methods: {
    onClick (e) {
      this.$emit('click', e)
    },
  },
}
</script>
