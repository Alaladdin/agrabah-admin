<template>
  <t-dialog
    :value="value"
    type="confirm"
    class="w-full"
    title="Select default avatar"
    variant="large"
    :pre-confirm="onConfirm"
    @change="onInput"
  >
    <div class="grid grid-cols-4">
      <div v-for="avatarUrl in defaultAvatars" :key="avatarUrl">
        <b-avatar
          :url="avatarUrl"
          class="cursor-pointer"
          :image-class="getAvatarClass(avatarUrl)"
          size="large"
          @click="onAvatarSelect(avatarUrl)"
        />
      </div>
    </div>
  </t-dialog>
</template>

<script>

import BAvatar from '@/components/b-avatar'

export default {
  name      : 'b-select-default-avatar-modal',
  components: {
    'b-avatar': BAvatar,
  },
  props: {
    value: {
      type   : Boolean,
      default: false,
    },
    selectedAvatarInitial: {
      type   : String,
      default: '',
    },
  },
  data () {
    return {
      selectedAvatar: this.selectedAvatarInitial,
      defaultAvatars: [
        'avatar/default',
        'avatar/default__1',
        'avatar/default__2',
        'avatar/default__3',
      ],
    }
  },
  watch: {
    value (isShown) {
      if (isShown)
        this.selectedAvatar = this.selectedAvatarInitial
    },
  },
  methods: {
    getAvatarClass (avatarUrl) {
      const classList = ['transition', 'duration-70', 'ease-in']

      if (avatarUrl !== this.selectedAvatar)
        classList.push('ring-0')

      return classList
    },
    onAvatarSelect (avatar) {
      this.selectedAvatar = avatar
    },
    onConfirm () {
      this.$emit('avatar-selected', this.selectedAvatar)
    },
    onInput () {
      this.$emit('input', false)
    },
  },
}
</script>
