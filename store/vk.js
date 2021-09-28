import vkChats from '@/data/chats'

export const state = () => ({
  vkChats,
})

export const getters = {
  getVKChats: state => state.vkChats,
}

export const actions = {
  sendMessage (ctx, { message, chatId = vkChats[0].chatId, parseLinks = false }) {
    return this.$api.$post('/vk/sendMessage', { message, chatId, parseLinks })
  },
}
