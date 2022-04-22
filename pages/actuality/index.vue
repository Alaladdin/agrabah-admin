<template>
  <div class="actuality">
    <div class="flex justify-center">
      <div class="rounded w-150 overflow-hidden shadow-sm bg-white">
        <form v-if="user.isAdmin" class="flex" @submit.prevent="addSectionItem">
          <b-input
            v-model.trim="newSectionName"
            class="w-full"
            input-class="border-none rounded-none focus:(ring-0 bg-gray-50)"
            placeholder="Section name"
            :disabled="isCreating"
          />

          <b-button
            class="rounded-none focus:ring-0"
            before-icon="plus"
            variant="indigo"
            :disabled="isAddButtonDisabled"
          />
        </form>

        <template v-if="!isLoading && data">
          <div v-if="!data.length" class="p-4 font-semibold text-center bg-indigo-50 text-indigo-400">
            No actualities
          </div>

          <b-actuality-item
            v-for="item in data"
            :key="item._id"
            :item="item"
            @toggle-caret="toggleSection"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { map, assign, reject } from 'lodash'
import BActualityItem from './components/b-actuality-item'
import PageDefaultMixin from '@/mixins/m-page-default'
import BInput from '@/components/b-input'
import BButton from '@/components/b-button'
import { formatDate, getFromLocalStorage, setToLocalStorage } from '@/helpers'

const SECTIONS_STORE_KEY = 'actualities__opened_sections'

export default {
  name      : 'actuality',
  components: {
    'b-input'         : BInput,
    'b-button'        : BButton,
    'b-actuality-item': BActualityItem,
  },
  mixins: [PageDefaultMixin('actuality')],
  data () {
    return {
      openedSections    : getFromLocalStorage(SECTIONS_STORE_KEY, []),
      newSectionName    : '',
      isCreating        : false,
      clearDataOnDestroy: false,
    }
  },
  computed: {
    ...mapGetters({ user: 'getUserData' }),

    isAddButtonDisabled () {
      return !this.newSectionName || this.isCreating || this.isLoading
    },
  },
  watch: {
    'openedSections.length' () {
      setToLocalStorage(SECTIONS_STORE_KEY, this.openedSections)
    },
  },
  methods: {
    ...mapActions('actuality', ['setSection']),

    getPreparedData (sections) {
      return map(sections, (section) => {
        const actualities = map(section.actualities, actuality => assign({}, actuality, {
          sectionId: section._id,
          updatedAt: formatDate(actuality.updatedAt, 'HH:mm – DD.MM'),
        }))

        return assign({}, section, {
          actualities,
          updatedAt: formatDate(section.updatedAt, 'HH:mm – DD.MM'),
          isOpened : this.openedSections.includes(section._id),
        })
      })
    },
    toggleSection (section) {
      section.isOpened = !section.isOpened

      if (section.isOpened)
        this.openedSections.push(section._id)
      else
        this.openedSections = reject(this.openedSections, openedId => openedId === section._id)
    },
    addSectionItem () {
      this.isCreating = true

      this.setSection({ name: this.newSectionName })
        .then(() => {
          this.newSectionName = ''
        })
        .catch(this.$handleError)
        .finally(() => {
          this.isCreating = false
        })
    },
  },
}
</script>

<style lang='scss'>
@import 'actuality';
</style>
