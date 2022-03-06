<template>
  <div class="overflow-hidden" :class="{ 'grid grid-cols-2' : !isPopupType }">
    <div :class="oldChangeWrapperClass">
      <p class="font-semibold font-mono"># Before</p>
      <p :class="changeItemClass" v-html="changesData.before" />
    </div>

    <div :class="{ 'ml-4' : !isPopupType }">
      <p class="font-semibold font-mono"># After</p>
      <p :class="changeItemClass" v-html="changesData.after" />
    </div>
  </div>
</template>

<script>
import { escape } from 'lodash'
import diff from 'simple-text-diff'

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
      const { value } = this.change
      const oldChange = escape(value.old)
      const newChange = escape(value.new)
      const diffs = diff.diffPatchBySeparator(oldChange, newChange, '\n')

      return {
        before: diffs.before,
        after : diffs.after,
      }
    },
    isPopupType () {
      return this.type === 'popup'
    },
    oldChangeWrapperClass () {
      return this.isPopupType ? 'mb-5' : 'pr-4 border-r'
    },
    changeItemClass () {
      return this.isPopupType ? 'truncate' : 'break-words whitespace-pre-line'
    },
  },
}
</script>

<style lang='scss'>
ins, del { @apply text-white no-underline }
ins { @apply bg-green-400 }
del { @apply bg-red-400 }
</style>
