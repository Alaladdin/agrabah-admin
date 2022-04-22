<template>
  <div>
    <div
      class="actuality__section-item border-b w-full select-none"
      :class="{
        '!pl-11': !isSectionItemType,
        '!py-3': editingItem,
        'bg-gray-100 !hover:bg-gray-100': isSectionItemType
      }"
      @click="onItemClick"
    >
      <div class="flex flex-col w-full max-w-6/10 h-full">
        <div class="flex items-center">
          <b-caret v-if="isSectionItemType" class="mr-4" :value="item.isOpened" />

          <b-input
            v-if="editingItem"
            ref="nameInput"
            v-model="editingItem.name"
            input-class="!py-1.2 text-sm"
            placeholder="Name"
            :variant="{ 'danger': !editingItem.name }"
            :disabled="isSaving"
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
              :text="item.name"
              variant="link"
            />
          </template>
        </div>
      </div>

      <div v-if="user.isAdmin" class="flex space-x-2 show-on-hover">
        <template v-if="editingItem">
          <b-button
            class="!px-1.5"
            after-icon="floppy-disk"
            variant="indigo"
            :disabled="isFormInvalid || isSaving"
            @click="editItem"
          />
          <b-button class="!px-1.5" after-icon="xmark" variant="danger" @click.stop="stopEditing" />
        </template>

        <template v-if="!editingItem">
          <b-button v-if="isSectionItemType" class="!px-1.5" after-icon="plus" variant="indigo" @click.stop="addActualityItem" />
          <b-button class="!px-1.5" after-icon="pencil" variant="indigo" @click.stop="startEditing" />
          <b-button class="!px-1.5" after-icon="trash-can" variant="danger" :disabled="isRemoving" @click.stop="removeItem" />
        </template>
      </div>

      <span class="items-end font-semibold text-xs text-gray-600" :class="{ 'hide-on-hover': user.isAdmin }">
        {{ item.updatedAt }}
      </span>
    </div>

    <template>
      <b-actuality-item
        v-for="actuality in item.actualities"
        v-show="isSectionItemType && item.isOpened"
        :key="actuality._id"
        :item="actuality"
        class="fade-in origin-right last:border-b-none"
      />
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import BButton from '@/components/b-button'
import BInput from '@/components/b-input'
import { clone } from '@/helpers'
import BCaret from '@/components/b-caret'

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
    ...mapGetters({ user: 'getUserData' }),

    isFormInvalid () {
      if (!this.editingItem) return false

      return !this.editingItem.name.trim()
    },
    isSectionItemType () {
      return !!this.item.actualities
    },
  },
  methods: {
    ...mapActions('actuality', ['setSection', 'editSection', 'removeSection', 'setActuality', 'editActuality', 'removeActuality']),

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
        .catch(this.$handleError)
        .finally(() => {
          this.isRemoving = false
        })
    },
    addActualityItem () {
      if (!this.item.isOpened)
        this.toggleCaret()

      this.setActuality({ sectionId: this.item._id, name: 'New actuality' })
        .catch(this.$handleError)
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
  },
}
</script>
