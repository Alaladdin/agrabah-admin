export const getters = {
  getUserData: (state, getters, rootState) => {
    const { user, loggedIn } = rootState.auth

    if (!user) {
      return {
        username: 'guest',
        scope   : ['guest'],
        loggedIn: false,
      }
    }

    return {
      avatarsList: [],
      isAdmin    : (user.scope.includes('admin') || user.scope.includes('owner')),
      isOwner    : user.scope.includes('owner'),
      loggedIn,
      ...user,
    }
  },
}

export const actions = {
  editUser (ctx, newUserData) {
    const { _id : currentUserId, scope: userScope } = ctx.getters.getUserData
    const canUpdateChanges = userScope.includes('admin')

    return this.$axios.$patch('/api/auth/editUser', newUserData, { updateChanges: canUpdateChanges })
      .then((user) => {
        if (user._id === currentUserId)
          ctx.commit('PATCH_CURRENT_USER', user, { root: true })

        return user
      })
      .catch((err) => {
        throw err
      })
  },
  loadUserAvatars (ctx) {
    const { username } = ctx.getters.getUserData

    return this.$axios.$get('/api/auth/getUserAvatars', { params: { username } })
      .then((data) => {
        ctx.commit('PATCH_CURRENT_USER', { avatarsList: data.avatarsList }, { root: true })

        return data.avatarsList
      })
      .catch((err) => {
        throw err
      })
  },
}
