import vue from 'vue'
import { assign, reject } from 'lodash'
import { version } from '@/package.json'
import { formatDate } from '@/helpers'

export const state = () => ({
  packageData        : { version: 'x.x.x' },
  pageTitle          : null,
  navbarNotifications: {},
  errors             : [],
})

export const getters = {
  getPackageData        : state => state.packageData,
  getPageTitle          : state => state.pageTitle,
  getNavbarNotifications: state => state.navbarNotifications,
  getErrors             : state => state.errors,
  getUserData           : (state) => {
    const { user, loggedIn } = state.auth

    if (!user) {
      return {
        username: 'guest',
        scope   : ['guest'],
        loggedIn: false,
      }
    }

    return {
      ...user,
      isAdmin: (user.scope.includes('admin') || user.scope.includes('owner')),
      isOwner: user.scope.includes('owner'),
      loggedIn,
    }
  },
}

export const mutations = {
  PATCH_CURRENT_USER (state, data) {
    state.auth.user = assign({}, state.auth.user, data)
  },
  PATCH_PACKAGE_DATA (state, data) {
    state.packageData = assign({}, state.packageData, data)
  },
  SET_SIDEBAR_NOTIFICATION (state, { key, value }) {
    vue.set(state.navbarNotifications, key, value)
  },
  PUSH_ERROR (state, error) {
    state.errors.push(error)
  },
  REMOVE_ERROR (state, error) {
    state.errors = reject(state.errors, { id: error.id })
  },
  SET_PAGE_TITLE (state, title) {
    state.pageTitle = title
  },
}

export const actions = {
  loadAppVersion (ctx) {
    ctx.commit('PATCH_PACKAGE_DATA', { version })
  },
  loadBranchData (ctx) {
    const requestOptions = { headers: { authorization: `token ${process.env.GITHUB_TOKEN}` } }

    return fetch('https://api.github.com/repos/Alaladdin/agrabah-admin/branches/main', requestOptions)
      .then((res) => {
        if (!res.ok) throw res

        return res.json()
      })
      .then(({ commit, _links }) => {
        const avatarUrl = new URL(commit.author.avatar_url)

        avatarUrl.searchParams.append('s', '40')

        const branchData = {
          committer: {
            name  : commit.author.login,
            avatar: avatarUrl.href,
            url   : _links.html,
            date  : formatDate(commit.commit.author.date, 'DD.MM HH:mm'),
          },
        }

        ctx.commit('PATCH_PACKAGE_DATA', branchData)
      })
  },
  editUser (ctx, newUserData) {
    const { _id : currentUserId, scope: userScope } = ctx.getters.getUserData
    const canUpdateChanges = userScope.includes('admin')

    return this.$axios.$patch('/api/auth/editUser', newUserData, { updateChanges: canUpdateChanges })
      .then((user) => {
        if (currentUserId === user._id)
          ctx.commit('PATCH_CURRENT_USER', user, { root: true })

        return user
      })
      .catch((err) => {
        throw err
      })
  },
}
