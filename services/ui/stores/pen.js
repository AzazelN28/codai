export const usePenStore = defineStore('pen', {
  state: () => ({
    title: 'Untitled',
    html: '',
    css: '',
    js: ''
  }),
  actions: {
    async getPen(id) {
      console.log(id)
      const response = await fetch('/api/v1/pens/' + id)
      const payload = await response.json()
      this.title = payload.title
      this.html = payload.html
      this.css = payload.css
      this.js = payload.js
      return payload
    }
  },
})
