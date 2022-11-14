<template>
  <div>
    <div
      class="actuality__section-item border-b w-full select-none"
      :class="{
        '!py-3': editingItem,
        'bg-gray-100 !hover:bg-gray-100': isSectionItemType
      }"
      @contextmenu.prevent="currentUser.isAdmin && showContextMenu($event)"
      @click="onItemClick"
    >
      <div class="flex flex-col w-full max-w-6/10 h-full">
        <div class="flex items-center">
          <b-input
            v-if="editingItem"
            ref="nameInput"
            v-model="editingItem.name"
            class="!w-full"
            :input-class="['text-sm', isSectionItemType ? '!py-1.2' : '!py-0.8']"
            placeholder="Enter name"
            :disabled="isSaving"
            required
          />

          <template v-if="!editingItem">
            <div v-if="isSectionItemType" class="flex items-center space-x-1 max-w-full">
              <span class="font-semibold truncate">{{ item.name }}</span>
              <span class="text-sm text-gray-400">({{ item.actualities.length }})</span>
            </div>

            <b-button
              v-if="!isSectionItemType"
              class="max-w-full"
              text-class="font-semibold truncate"
              variant="link"
              :text="item.name"
            />
          </template>
        </div>
      </div>

      <div v-if="editingItem" class="flex space-x-2">
        <b-button
          class="!px-1.5 max-w-full"
          after-icon="floppy-disk"
          variant="indigo"
          :disabled="!editingItem.name"
          @click.stop="editItem"
        />

        <b-button class="!px-1.5" after-icon="xmark" variant="danger" @click.stop="stopEditing" />
      </div>

      <div v-if="!editingItem" class="flex items-center">
        <span v-if="userEditingName" class="items-end font-semibold text-xs text-gray-600">
          <span>editing now by </span>
          <span>{{ userEditingName }}</span>
        </span>

        <span v-if="!isSectionItemType && !userEditingName" class="items-end font-semibold text-xs text-gray-600">
          {{ item.updatedAt }}
        </span>

        <b-caret
          v-if="isSectionItemType"
          class="ml-4 !text-gray-600"
          :value="item.isOpened"
          inverted-animation
        />
      </div>
    </div>

    <transition
      v-if="item.actualities"
      @enter="enter"
      @leave="leave"
    >
      <div
        v-show="isSectionItemType && item.isOpened"
        :id="item._id"
        :data-height="item.actualities.length * 53"
        class="overflow-hidden"
      >
        <b-actuality-item
          v-for="actuality in item.actualities"
          :key="actuality._id"
          :item="actuality"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import find from 'lodash/find'
import BButton from '@/components/b-button'
import BInput from '@/components/b-input'
import { clone } from '@/helpers'
import BCaret from '@/components/b-caret'

const gsap = (process.client) ? require('gsap').gsap : null

export default {
  name      : 'b-actuality-item',
  components: {
    'b-input' : BInput,
    'b-button': BButton,
    'b-caret' : BCaret,
  },
  props: {
    item: {
      type   : Object,
      default: () => ({}),
    },
  },
  data: () => ({
    editingItem  : null,
    isCaretOpened: false,
    isSaving     : false,
    isRemoving   : false,
  }),
  computed: {
    ...mapGetters({
      currentUser: 'getUserData',
      onlineUsers: 'getOnlineUsers',
    }),

    isFormInvalid () {
      if (!this.editingItem) return false

      return !this.editingItem.name.trim()
    },
    isSectionItemType () {
      return !!this.item.actualities
    },
    userEditingName () {
      const userEditing = find(this.onlineUsers, {
        activity: {
          action: 'editing',
          pageId: this.item._id,
        },
      })

      if (!userEditing)
        return null

      if (this.currentUser._id === userEditing?._id)
        return 'you'

      return userEditing?.displayName || userEditing?.username
    },
  },
  methods: {
    ...mapMutations('context-menu', {
      commitSetContextMenuButtons   : 'SET_BUTTONS',
      commitSetContextMenuPosition  : 'SET_POSITION',
      commitSetContextMenuVisibility: 'SET_VISIBILITY',
    }),

    ...mapActions('actuality', [
      'setSection',
      'editSection',
      'removeSection',
      'setActuality',
      'editActuality',
      'removeActuality',
    ]),

    showContextMenu (e) {
      console.log(process.env.GITHUB_TOKEN)
      console.log(this.$config.API_BASE_URL)
      console.log(this.$config)
      const buttons = this.editingItem
        ? [{
            title   : 'Save',
            icon    : 'floppy-disk',
            disabled: this.isFormInvalid || this.isSaving,
            callback: this.editItem,
          },
          {
            title   : 'Cancel',
            icon    : 'xmark',
            callback: this.stopEditing,
          }]
        : [{
            title   : 'Edit',
            icon    : 'pencil',
            disabled: this.isSaving,
            callback: this.startEditing,
          },
          {
            title   : 'Remove',
            icon    : ['far', 'trash-can'],
            class   : '!text-red-500',
            disabled: this.isRemoving,
            callback: this.removeItem,
          }]

      if (this.isSectionItemType) {
        buttons.unshift({
          title       : 'Add actuality',
          icon        : 'plus',
          dividerAfter: true,
          callback    : this.addActualityItem,
        })
      } else {
        buttons.push({
          type   : 'user',
          user   : this.item.updatedBy,
          divider: true,
        })
      }

      this.commitSetContextMenuButtons(buttons)
      this.commitSetContextMenuPosition({ x: e.x, y: e.y })
      this.commitSetContextMenuVisibility(true)
    },
    editItem () {
      const action = this.isSectionItemType ? this.editSection : this.editActuality

      this.isSaving = true

      action(this.editingItem)
        .then(this.stopEditing)
        .catch(this.$handleError)
        .finally(() => {
          this.isSaving = false
        })
    },
    removeItem () {
      const action = this.isSectionItemType ? this.removeSection : this.removeActuality

      this.isRemoving = true

      action(this.item)
        .then(() => {
          if (!this.isSectionItemType)
            this.recalculateSectionStyles(this.item.sectionId)
        })
        .catch(this.$handleError)
        .finally(() => {
          this.isRemoving = false
        })
    },
    addActualityItem () {
      this.setActuality({ sectionId: this.item._id, name: 'New actuality' })
        .then(() => {
          if (this.item.isOpened)
            this.recalculateSectionStyles(this.item._id)
        })
        .catch(this.$handleError)
        .finally(() => {
          if (!this.item.isOpened)
            this.toggleCaret()
        })
    },
    recalculateSectionStyles (sectionId) {
      const element = document.getElementById(sectionId)

      gsap.to(element, {
        height: element.dataset.height + 'px',
      })
    },
    onItemClick () {
      if (!this.editingItem) {
        this.isSectionItemType
          ? this.toggleCaret()
          : this.goToActuality()
      }
    },
    goToActuality () {
      this.$router.push({ name: 'actuality/actualityId', params: { actualityId: this.item._id } })
    },
    toggleCaret () {
      this.$emit('toggle-caret', this.item)
    },
    startEditing () {
      this.editingItem = clone(this.item)
      this.$nextTick(() => this.$refs.nameInput.$refs.input.focus())
    },
    stopEditing () {
      this.editingItem = null
    },
    enter (el, done) {
      gsap
        .fromTo(el,
          this.getFadeIn(),
          this.getFadeOut(el)
        )
        .then(() => {
          done()
        })
    },
    leave (el, done) {
      gsap
        .fromTo(el,
          this.getFadeOut(el),
          this.getFadeIn()
        )
        .then(() => {
          done()
        })
    },
    getFadeIn () {
      return {
        height  : 0,
        opacity : 0,
        duration: 0.2,
      }
    },
    getFadeOut (el) {
      return {
        height  : el.dataset.height + 'px',
        opacity : 1,
        duration: 0.2,
      }
    },
  },
}
</script>
