export default function ({ $axios, env, isDev }, inject) {
  // Create a custom axios instance
  const api = $axios.create({
    baseURL: isDev ? 'http://localhost:9000' : 'https://api.mpei.space',
    headers: {
      authorization: env.authToken,
    },
  })

  // Inject to context as $api
  inject('api', api)
}
