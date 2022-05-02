<template>
  <t-dialog
    :value="show"
    type="confirm"
    class="b-select-avatar-modal"
    title="Select avatar"
    variant="large"
    :pre-confirm="onConfirm"
    @before-close="onClose"
  >
    <div class="grid grid-cols-8 gap-y-4">
      <div class="flex justify-center items-center">
        <b-button
          class="b-select-avatar-modal__upload-btn"
          :class="{ 'uploading' : isUploading }"
          :style="{ width: avatarUploadBtnSize, height: avatarUploadBtnSize }"
          variant="icon"
          @click="selectFile"
        >
          <fa
            :icon="isUploading ? 'circle-notch' : 'cloud-arrow-up'"
            :class="{ 'animate-spin' : isUploading }"
          />
        </b-button>
      </div>

      <div v-for="avatarUrl in avatarsList" :key="avatarUrl">
        <b-avatar
          :user="{ avatar: avatarUrl }"
          class="cursor-pointer"
          :image-class="getAvatarClass(avatarUrl)"
          size="large"
          @click="onAvatarSelect(avatarUrl)"
        />
      </div>
    </div>

    <div class="block mt-10 text-center text-sm">
      <b-button
        class="!inline-block !px-3 !py-2 !rounded font-semibold bg-white shadow"
        href="https://t.me/minibich_room"
        target="_blank"
        variant="link"
      >
        Предустановленные аватарки любезно предоставлены @minibich_room
      </b-button>

      <b-image-upload
        ref="imageUploader"
        :value="newUserData.avatar"
        :folder-name="currentUser.username"
        @file-selected="onFileSelected"
        @input="onFileUploaded"
      />
    </div>
  </t-dialog>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { concat } from 'lodash/array'
import BAvatar from '@/components/b-avatar'
import BButton from '@/components/b-button'
import avatarMetadata from '@/components/b-avatar/metadata'
import BImageUpload from '@/components/b-image-upload'

export default {
  name      : 'b-select-avatar-modal',
  components: {
    'b-avatar'      : BAvatar,
    'b-button'      : BButton,
    'b-image-upload': BImageUpload,
  },
  props: {
    show: {
      type   : Boolean,
      default: false,
    },
    newUserData: {
      type   : Object,
      default: () => ({}),
    },
  },
  data () {
    return {
      selectedAvatar     : this.newUserData.avatar,
      avatarUploadBtnSize: avatarMetadata.avatarSizes.large + 'px',
      isUploading        : false,
    }
  },
  computed: {
    ...mapGetters({
      currentUser       : 'getUserData',
      defaultAvatarsList: 'user/getDefaultAvatarsList',
    }),

    avatarsList () {
      const userAvatarsList = this.currentUser.avatarsList

      return concat(this.defaultAvatarsList, userAvatarsList)
    },
  },
  watch: {
    show (isShown) {
      if (isShown) this.init()
    },
  },
  methods: {
    ...mapActions({ loadDefaultAvatarsList: 'user/loadDefaultAvatarsList' }),
    ...mapMutations({ commitPatchUser: 'PATCH_CURRENT_USER' }),

    init () {
      this.selectedAvatar = this.newUserData.avatar

      if (!this.defaultAvatarsList) {
        this.loadDefaultAvatarsList()
          .catch(this.$handleError)
      }
    },
    getAvatarClass (avatarUrl) {
      const classList = ['transition', 'duration-70', 'ease-in']

      if (avatarUrl !== this.selectedAvatar)
        classList.push('ring-2 opacity-40')

      if (this.defaultAvatarsList && this.defaultAvatarsList.includes(avatarUrl))
        classList.push('ring-yellow-400')

      return classList
    },
    selectFile () {
      this.$refs.imageUploader.selectFile()
    },
    onFileSelected () {
      this.isUploading = true
    },
    onFileUploaded (avatar) {
      this.commitPatchUser({ avatarsList: concat(this.currentUser.avatarsList, [avatar]) })

      this.onAvatarSelect(avatar)
      this.isUploading = false
    },
    onAvatarSelect (avatar) {
      this.selectedAvatar = avatar
    },
    onConfirm () {
      this.$emit('input', this.selectedAvatar)
    },
    onClose () {
      this.$emit('closed')
    },
  },
}
</script>

<style lang='scss'>
@import 'b-select-avatar-modal';
</style>
