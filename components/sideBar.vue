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
            :class="['nuxt-link', { disabled : item.disabled }]"
          >
            <div>
              <fa class="mr-3 text-indigo-100" :icon="item.icon" />
              <span class="mr-1">{{ item.title }}</span>
            </div>
            <span v-if="!item.disabled && getNotificationsCount(index)" class="inline-flex px-2 py-1 rounded leading-none text-xs bg-indigo-600">
              {{ getNotificationsCount(index) }}
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
          <div class="flex justify-center items-center p-2">
            <img
              v-on-clickaway="closeProfileContext"
              class="mr-8 rounded-full w-16 h-16 border-4 border-indigo-600 shadow-sm cursor-pointer"
              :src="userData.avatarUrl"
              :alt="userData.username"
              @click="openProfileContext"
            >

            <div class="flex flex-col mr-5">
              <span class="font-semibold">{{ userData.username }}</span>
              <span class="text-xs text-indigo-300">#{{ userData.discriminator }}</span>
            </div>
          </div>

          <NuxtLink to="/logout" class="flex items-center px-3 h-full text-sm bg-indigo-600 hover:bg-indigo-700 transition duration-75">
            <fa icon="sign-out-alt" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'
import navItems from '@/_nav'

export default {
  name  : 'SideBar',
  mixins: [clickaway],
  data () {
    return {
      navItems,
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
    ...mapGetters({ userData: 'getUserData' }),
  },
  methods: {
    getNotificationsCount (index) {
      return Math.ceil(Math.random() * (index || 5))
    },
    profileContextClick (item) {
      this.closeProfileContext()
      this.$router.push(item)
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
