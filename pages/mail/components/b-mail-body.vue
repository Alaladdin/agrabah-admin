<template>
  <div ref="container" class="w-full">
    <div ref="header" class="-top-full bg-white">
      <div class="px-5 py-3">
        <p class="mb-2 text-xl font-bold">
          <text-highlight :queries="search">
            {{ mail.title }}
          </text-highlight>
        </p>

        <div class="text-sm text-gray-500">
          <div class="flex">
            <p class="mr-2">Received at: </p>
            <p>{{ mail.receivedAt }}</p>
          </div>

          <div class="flex">
            <p class="mr-2">From: </p>
            <text-highlight :queries="search">
              {{ mail.from }}
            </text-highlight>
          </div>

          <div v-if="mail.attachments.length" class="flex">
            <p class="mr-2">Attachments:</p>
            <div>
              <a
                v-for="(attach, index) in mail.attachments"
                :key="index"
                class="flex items-center mr-3 max-w-full text-purple-400 cursor-pointer"
                :href="`/api/mail/files?mpeiUser=${currentUser.barsUser}&messageId=${mail._id}&fileId=${attach._id}`"
                :download="attach.name"
                target="_blank"
              >
                <fa class="mr-1" :icon="attach.icon" />
                <span>{{ attach.name }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div ref="progress" class="mail__progress" />
    </div>

    <div v-if="mail.body" class="p-5 py-3 w-full whitespace-pre-line break-all text-sm text-gray-600 bg-purple-50">
      <text-highlight :queries="search">{{ mail.body }}</text-highlight>
    </div>
  </div>
</template>

<script>
import throttle from 'lodash/throttle'
import { mapGetters } from 'vuex'

const listenerOptions = { passive: true, capture: true }

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
  computed: {
    ...mapGetters({ currentUser: 'getUserData' }),
  },
  watch: {
    'mail._id' () {
      this.$nextTick(() => {
        this.setReadPercentage(0)
      })
    },
  },
  mounted () {
    this.addListeners()
  },
  beforeDestroy () {
    this.removeListeners()
  },
  methods: {
    addListeners () {
      this.$refs.container.addEventListener('scroll', this.onScroll, listenerOptions)
    },
    removeListeners () {
      this.$refs.container.removeEventListener('scroll', this.onScroll, listenerOptions)
    },
    onScroll: throttle(function () {
      const { container, header } = this.$refs
      const classList = ['sticky', '!top-0', 'transition-all', 'duration-300']
      const { height: headerHeight } = header.getBoundingClientRect()
      const offset = 30

      if (container.scrollHeight !== container.offsetHeight)
        this.calculateProgressBar()

      if (!container.scrollTop)
        header.classList.remove(...classList)

      if (container.scrollTop > headerHeight + offset)
        header.classList.add(...classList)
    }, 100),
    calculateProgressBar () {
      const { scrollTop, scrollHeight, offsetHeight } = this.$refs.container
      const progressPercent = (scrollTop / (scrollHeight - offsetHeight)) * 100

      this.setReadPercentage(progressPercent)
    },
    setReadPercentage (percentage) {
      this.$refs.progress.style.setProperty('--tw-translate-x', `${percentage - 100}%`)
    },
  },
}
</script>
