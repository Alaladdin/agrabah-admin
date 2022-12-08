<template>
  <div class="changes__body">
    <b-change-item
      v-for="change in changes"
      :key="change._id"
      :change="change"
      :suppress-modal="suppressModal"
      @open-change-modal="openChangeModal"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { assign, map, take } from 'lodash'
import ChangeItem from '../b-change-item'
import localMetadata from './metadata'
import { formatDate } from '@/helpers'

export default {
  name      : 'b-changes-body',
  components: {
    'b-change-item': ChangeItem,
  },
  props: {
    limit: {
      type   : Number,
      default: 0,
    },
    suppressModal: {
      type   : Boolean,
      default: false,
    },
  },
  data: () => ({
    changesInfo: localMetadata.changesInfo,
  }),
  computed: {
    ...mapGetters({
      user      : 'getUserData',
      rawChanges: 'changes/getData',
    }),

    changes () {
      const changes = take(this.rawChanges, this.limit || this.rawChanges.length)

      return map(changes, (change) => {
        const changedAtDate = formatDate(change.changedAt, 'HH:mm DD.MM')
        const descriptions = map(change.descriptions, field => this.getFieldInfo(change, field))
        const changeInfo = this.changesInfo[change.name]
        const additionalData = {
          title    : changeInfo?.title || change.name,
          route    : changeInfo?.getRoute?.(change),
          descriptions,
          changedAt: changedAtDate,
        }

        return assign({}, change, additionalData)
      })
    },
  },
  methods: {
    getFieldInfo (change, field) {
      const fieldInfo = this.changesInfo[change.name]?.[field.id]

      if (fieldInfo) {
        if (fieldInfo.plain)
          return assign({}, fieldInfo, { value: field })

        if (!fieldInfo.valueGetter)
          return fieldInfo

        return {
          title: fieldInfo.title,
          html : !!fieldInfo.html,
          value: fieldInfo.valueGetter(field),
        }
      }

      return { title: field.id }
    },
    openChangeModal (e) {
      this.$emit('open-change-modal', e)
    },
  },
}
</script>

<style lang='scss'>
@import "b-changes-body";
</style>
