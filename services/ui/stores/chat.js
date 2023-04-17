export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [],
  }),
  actions: {
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
