<template>
  <div class="overflow-hidden" :class="{ 'grid grid-cols-2' : !isPopupType && hasNewChange }">
    <div v-if="change.value.old" :class="getOldChangeWrapperClass()">
      <p class="font-semibold font-mono"># Before</p>
      <p :class="getChangeItemClass()" v-html="changesData.before" />
    </div>

    <div v-if="change.value.new" :class="{ 'ml-4' : !isPopupType }">
      <p class="font-semibold font-mono" :class="{ 'text-right' : !isPopupType && !hasNewChange }"># After</p>
      <p :class="getChangeItemClass()" v-html="changesData.after" />
    </div>
  </div>
</template>

<script>
import diff from 'simple-text-diff'
import { escape } from 'lodash'

export default {
  name : 'b-change-info-plain',
  props: {
    change: {
      type    : Object,
      required: true,
    },
    type: {
      type     : String,
      default  : 'popup',
      validator: v => ['popup', 'modal'].includes(v),
    },
  },
  computed: {
    changesData () {
      const { old: oldChange, new: newChange } = this.change.value
      const diffs = diff.diffPatchBySeparator(escape(oldChange), escape(newChange), '\n')

      return {
        before: diffs.before,
        after : diffs.after,
      }
    },
    hasNewChange () {
      return !!this.change.value.new
    },
    isPopupType () {
      return this.type === 'popup'
    },
  },
  methods: {
    getOldChangeWrapperClass () {
      if (!this.hasNewChange) return ''

      return this.isPopupType ? 'mb-5' : 'pr-4 border-r'
    },
    getChangeItemClass () {
      return this.isPopupType ? 'truncate' : 'break-words whitespace-pre-line'
    },
  },
}
</script>

<style lang='scss'>
ins {
  @apply text-green-400 no-underline;
}

del {
  @apply text-red-400 no-underline;
}
</style>
