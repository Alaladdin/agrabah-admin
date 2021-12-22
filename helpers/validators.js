export const validateUsername = (username) => {
  const usernameLength = username.trim().length

  return usernameLength >= 4 && usernameLength <= 15
}

export const validatePassword = (password) => {
  const passLength = password.trim().length

  return passLength >= 6 && passLength <= 20
}
