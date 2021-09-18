<template>
  <div>
    <div class="inline-flex flex-row min-h-screen bg-indigo-700">
      <div class="flex flex-col flex-shrink-0 w-full md:w-64 text-gray-700">
        <div class="flex flex-shrink-0 flex-row items-center justify-center px-8 py-4">
          <span class="rounded-lg text-lg text-indigo-200 font-semibold tracking-widest uppercase">
            MPEI ADMIN
          </span>
        </div>
        <nav class="flex-grow md:block px-4 pb-4 md:pb-0 md:overflow-y-auto">
          <NuxtLink
            v-for="(item, index) in navItems"
            :key="index"
            :to="item.path"
            :class="classes"
          >
            <div>
              <fa class="mr-3 text-indigo-100" :icon="item.icon" />
              <span class="mr-1">{{ item.title }}</span>
            </div>
            <span v-if="getNotificationsCount(index)" class="inline-flex px-2 py-1 rounded leading-none text-xs bg-indigo-600">
              {{ getNotificationsCount(index) }}
            </span>
          </NuxtLink>
        </nav>

        <ul v-show="isShowProfileContext" class="p-2 rounded-t-lg shadow text-indigo-100 bg-indigo-900">
          <li
            v-for="(item, index) in ['Profile', 'Bum', 'Bum', 'Bum']"
            :key="index"
            class="p-2 rounded duration-50 cursor-pointer hover:bg-indigo-800"
            @click="profileContextClick"
          >
            {{ item }}
          </li>
        </ul>

        <div class="flex justify-between items-center p-2 text-indigo-100 bg-indigo-800" @click="openProfileContext">
          <img
            class="rounded-full w-16 h-16 border-4 border-indigo-600 shadow-sm"
            :src="userData.avatarUrl"
            :alt="userData.username"
          >
          <div class="flex items-center">
            <div class="flex flex-col justify-end mr-5">
              <span class="font-semibold">{{ userData.username }}</span>
              <span class="text-xs text-indigo-300">#{{ userData.discriminator }}</span>
            </div>

            <NuxtLink to="/logout" class="text-sm">
              <fa class="mr-3" icon="sign-out-alt" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navItems from '@/_nav'

export default {
  name: 'SideBar',
  data () {
    return {
      navItems,
      classes: [
        'flex',
        'flex-row',
        'justify-between',
        'px-4',
        'py-2',
        'mt-2',
        'text-sm',
        'font-semibold',
        'text-indigo-200',
        'rounded-lg',
        'transition',
        'duration-75',
        'ease-in-out',
        'cursor-pointer',
        'hover:bg-indigo-800',
        'focus:bg-indigo-900',
        'focus:outline-none',
        'focus:shadow-outline',
        'select-none',
      ],
      isShowProfileContext: false,
    }
  },
  computed: {
    userData () {
      const { id: userId, username, avatar, banner, discriminator } = this.$auth.$state.user
      const discordCDNUrl = 'https://cdn.discordapp.com'

      return {
        username,
        discriminator,
        avatarUrl: `${discordCDNUrl}/avatars/${userId}/${avatar}`,
        bannerUrl: `${discordCDNUrl}/banners/${userId}/${banner}`,
      }
    },
  },
  methods: {
    getNotificationsCount (index) {
      return Math.ceil(Math.random() * index)
    },
    profileContextClick () {
      this.closeProfileContext()
    },
    openProfileContext () {
      this.makeTrue('isShowProfileContext')
    },
    closeProfileContext () {
      this.makeFalse('isShowProfileContext')
    },
    makeTrue (field) {
      this[field] = true
    },
    makeFalse (field) {
      this[field] = false
    },
  },
}
</script>
