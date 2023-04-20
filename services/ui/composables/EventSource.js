export function useEventSource(url, callback) {
  let sse

  onMounted(() => {
    if (sse && sse.readyState !== 2) {
      sse.close()
    }
    sse = new EventSource(url)
    sse.onerror = (e) => callback(e)
    sse.onmessage = (e) => callback(e)
    sse.onopen = (e) => callback(e)
  })

  onUnmounted(() => {
    if (sse && sse.readyState !== 2) {
      sse.close()
    }
  })

}
