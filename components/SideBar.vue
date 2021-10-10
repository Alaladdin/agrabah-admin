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
            :class="['nuxt-link', { 'disabled' : item.disabled }]"
          >
            <div>
              <fa class="mr-3 text-indigo-100" :icon="item.icon" />
              <span class="mr-1">{{ item.title }}</span>
            </div>
            <span v-if="!item.disabled && getNotificationsCount(item)" class="inline-flex px-2 py-1 rounded leading-none text-xs bg-indigo-600">
              <span>{{ getNotificationsCount(item) }}</span>
            </span>
          </NuxtLink>
        </nav>

        <ul v-show="isShowProfileContext" class="p-2 rounded-t-lg shadow text-indigo-100 bg-indigo-900">
          <li
            v-for="(item, index) in profileContextMenu"
            :key="index"
            class="p-2 rounded duration-50 cursor-pointer hover:bg-indigo-800"
            @click="profileContextClick(item)"
          >
            {{ item.title }}
          </li>
        </ul>

        <div class="flex justify-between items-center text-indigo-100 bg-indigo-800">
          <div class="flex justify-center items-center p-3">
            <img
              v-on-clickaway="closeProfileContext"
              class="mr-8 rounded-full w-16 h-16 ring-4 ring-indigo-600 shadow-sm object-cover cursor-pointer"
              src="~/assets/img/avatar__default.jpg"
              :alt="user.username"
              @click="openProfileContext"
            >

            <div class="flex flex-col mr-5">
              <span class="text-md font-semibold">{{ user.username }}</span>
            </div>
          </div>

          <NuxtLink :to="user.loggedIn ? '/logout' : '/login'" class="flex items-center px-3 h-full text-sm bg-indigo-600 hover:bg-indigo-700 transition duration-150">
            <fa :icon="user.loggedIn ? 'sign-out-alt' : 'sign-in-alt'" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'
import { find, filter, keys, some } from 'lodash'
import { navItems } from '@/data'

export default {
  name  : 'SideBar',
  mixins: [clickaway],
  data () {
    return {
      profileContextMenu: [
        {
          title: 'Profile',
          name : 'profile',
        },
        {
          title: 'Logout',
          name : 'logout',
        },
      ],
      isShowProfileContext: false,
    }
  },
  computed: {
    ...mapGetters({
      user               : 'getUserData',
      navbarNotifications: 'getNavbarNotifications',
    }),

    navItems () {
      const { scope: userScope } = this.user

      return filter(navItems, (navItem) => {
        if (!navItem.scope) return true

        return some(navItem.scope, navSingleScope => userScope.includes(navSingleScope))
      })
    },
  },
  methods: {
    getNotificationsCount (navItem) {
      const notificationsKeys = keys(this.navbarNotifications)
      const key = find(notificationsKeys, key => key === navItem.title.toLowerCase())

      return this.navbarNotifications[key] || 0
    },
    profileContextClick (item) {
      this.closeProfileContext()
      this.$router.push(item)
    },
    openProfileContext () {
      if (this.user.loggedIn)
        this.isShowProfileContext = true
    },
    closeProfileContext () {
      this.isShowProfileContext = false
    },
  },
}
</script>
