export default function ({ store, redirect }) {
  const { auth } = store.state

  if (auth.accessLevel > 1)
    return redirect('/404')
}
