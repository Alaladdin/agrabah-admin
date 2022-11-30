<template>
  <div
    class="mail__item"
    :class="{ active: isActive, read: mail.isRead }"
    @click="openMail"
  >
    <div class="flex flex-row justify-between">
      <div class="max-w-8/10">
        <div class="mb-2 font-semibold truncate">
          <text-highlight :queries="search">
            {{ mail.title }}
          </text-highlight>
        </div>
        <div class="text-sm text-gray-500 truncate">
          <text-highlight :queries="search">
            {{ mail.from }}
          </text-highlight>
        </div>
      </div>
      <div class="text-xs">
        {{ mail.receivedAt }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name : 'b-mail-item',
  props: {
    mail: {
      type    : Object,
      required: true,
    },
    search: {
      type   : String,
      default: '',
    },
    isActive: {
      type   : Boolean,
      default: false,
    },
  },
  methods: {
    openMail () {
      this.$emit('open-mail', this.mail)
    },
  },
}
</script>
