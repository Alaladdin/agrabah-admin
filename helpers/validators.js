export const isUsernameValid = (username) => {
  const usernameLength = username.trim().length

  return usernameLength >= 4 && usernameLength <= 15
}
