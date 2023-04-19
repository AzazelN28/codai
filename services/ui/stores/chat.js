export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [],
  }),
  actions: {
    async getMessages(id) {
      this.messages.length = 0
      const response = await fetch('/api/v1/chats/' + id)
      const payload = await response.json()
      this.messages.push(...payload)
      return payload
    },
    addMessage(role, message, id) {
      if (id === undefined) {
        id = `${(Math.random() * Number.MAX_SAFE_INTEGER).toString(36).padStart(0, 10)}`
      }
      this.messages.push({
        id,
        role,
        message,
      })
    }
  }
})
