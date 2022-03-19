<template>
  <t-dialog
    :value="value"
    type="confirm"
    class="w-full"
    title="Select avatar"
    variant="large"
    :pre-confirm="onConfirm"
    @change="onInput"
  >
    <div class="grid grid-cols-8 gap-y-4">
      <div v-for="avatarUrl in avatarsList" :key="avatarUrl">
        <b-avatar
          :url="avatarUrl"
          class="cursor-pointer"
          :image-class="getAvatarClass(avatarUrl)"
          size="large"
          @click="onAvatarSelect(avatarUrl)"
        />
      </div>
    </div>

    <div class="block mt-10 text-center text-sm">
      <b-button
        class="!inline-block !px-3 !py-2 !rounded font-semibold bg-white shadow-sm"
        href="https://t.me/minibich_room"
        target="_blank"
        variant="link"
      >
        Предустановленные аватарки любезно предоставлены @minibich_room
      </b-button>
    </div>
  </t-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { concat } from 'lodash/array'
import BAvatar from '@/components/b-avatar'
import BButton from '@/components/b-button'

export default {
  name      : 'b-select-avatar-modal',
  components: {
    'b-avatar': BAvatar,
    'b-button': BButton,
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
  computed: {
    ...mapGetters({ currentUser: 'getUserData' }),

    avatarsList () {
      const userAvatars = this.currentUser.avatarsList

      return concat(this.defaultAvatars, userAvatars)
    },
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
        classList.push('ring-2 opacity-40')

      if (this.defaultAvatars.includes(avatarUrl))
        classList.push('ring-yellow-400')

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
