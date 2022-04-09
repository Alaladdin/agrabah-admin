<template>
  <div class="grid grid-cols-2 overflow-hidden">
    <div class="pr-4 border-r">
      <p class="mb-5 font-semibold font-mono"># Before</p>
      <p class="break-words whitespace-pre-line" v-html="changesData.before" />
    </div>

    <div class="ml-4">
      <p class="mb-5 font-semibold font-mono"># After</p>
      <p class="break-words whitespace-pre-line" v-html="changesData.after" />
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
  },
}
</script>

<style lang='scss'>
ins, del {
  padding: 2px 0;
  @apply text-white no-underline
}

ins {
  @apply bg-green-400
}

del {
  @apply bg-red-400
}
</style>
