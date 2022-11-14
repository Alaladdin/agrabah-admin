<template>
  <figure class="b-avatar" @click="onClick">
    <div
      v-if="isLoading"
      class="flex justify-center items-center text-3xl text-purple-500 bg-purple-400"
      :class="avatarClassList"
      :style="{ width: avatarSize, height: avatarSize, fontSize }"
    >
      <fa icon="circle-notch" class="animate-spin" />
    </div>

    <div v-show="!isLoading" class="relative">
      <nuxt-img
        ref="avatar"
        preset="avatar"
        crossorigin="anonymous"
        :provider="$attrs.provider || 'cloudinary'"
        :class="avatarClassList"
        :src="avatarUrl"
        :width="avatarSize"
        :height="avatarSize"
        @load.native="onLoad"
        @error.native="onLoadError"
      />

      <span v-if="isUserOnline" :class="['b-avatar__status--online', size]" />
    </div>
  </figure>
</template>

<script>
import { mapGetters } from 'vuex'
import localMetadata from './metadata'

export default {
  name : 'b-avatar',
  props: {
    user: {
      type   : Object,
      default: () => ({}),
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
    ...mapGetters({ onlineUsers: 'getOnlineUsers' }),

    avatarClassList () {
      return ['b-avatar__image', this.size, this.imageClass]
    },
    avatarSize () {
      return localMetadata.avatarSizes[this.size] + 'px'
    },
    fontSize () {
      return localMetadata.avatarSizes[this.size] / 2.5 + 'px'
    },
    isUserOnline () {
      return !!this.onlineUsers[this.user._id]
    },
  },
  watch: {
    'user.avatar': {
      immediate: true,
      handler (newUrl) {
        this.handleUrlChange(newUrl)
      },
    },
  },
  methods: {
    handleUrlChange (newUrl) {
      this.avatarUrl = newUrl || process.env.defaultAvatarImage
      this.isLoading = true
    },
    onLoad () {
      this.isLoading = false
    },
    onLoadError () {
      this.avatarUrl = process.env.errorAvatarImage
    },
    onClick () {
      this.$emit('click')
    },
  },
}
</script>

<style lang='scss'>
@import 'b-avatar';
</style>
