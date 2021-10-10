export default function ({ store, redirect }) {
  const { getUserData: user } = store.getters

  if (!user.isAdmin && !user.isFullAccess)
    return redirect('/')
}
