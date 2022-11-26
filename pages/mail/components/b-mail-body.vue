<template>
  <div class="flex p-5 overflow-y-auto">
    <span v-if="!mail" class="self-center w-full text-center text-xl">choose mail</span>
    <div v-if="mail">
      <div class="mb-5">
        <div class="font-bold">
          <text-highlight :queries="search">
            {{ mail.sender }}
          </text-highlight>
        </div>
        <div class="font-semibold text-sm">{{ mail.receivedAt }}</div>
        <div class="font-semibold text-gray-600 text-sm truncate max-w-150">To: {{ mail.receivers }}</div>
      </div>
      <div class="mb-3 font-bold text-xl">
        <text-highlight :queries="search">
          {{ mail.title }}
        </text-highlight>
      </div>

      <div class="pb-5 text-sm text-gray-600 whitespace-pre-line">
        <text-highlight :queries="search">
          {{ mail.body }}
        </text-highlight>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name : 'b-mail-body',
  props: {
    mail: {
      type   : Object,
      default: null,
    },
    search: {
      type   : String,
      default: '',
    },
  },
}
</script>
