<template>
  <div class="overflow-hidden" :class="{ 'grid grid-cols-2' : !isPopupType }">
    <div v-if="change.value.old" :class="getOldChangeWrapperClass()">
      <p class="font-semibold font-mono"># Before</p>
      <p class="text-red-400" :class="getChangeItemClass()">
        {{ change.value.old }}
      </p>
    </div>

    <div v-if="change.value.new" :class="{ 'ml-4' : !isPopupType }">
      <p class="font-semibold font-mono" :class="{ 'text-right' : !isPopupType }"># After</p>
      <p class="text-green-400" :class="getChangeItemClass()">
        {{ change.value.new }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name : 'ChangeInfoPlain',
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
    isPopupType () {
      return this.type === 'popup'
    },
  },
  methods: {
    getOldChangeWrapperClass () {
      const { new : newChange } = this.change.value

      if (!newChange) return ''

      return this.isPopupType ? 'mb-5' : 'pr-4 border-r'
    },
    getChangeItemClass () {
      return this.isPopupType ? 'truncate' : 'break-words whitespace-pre-line'
    },
  },
}
</script>
