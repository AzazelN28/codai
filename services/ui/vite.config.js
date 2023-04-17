import path from 'path'
import { defineConfig, searchForWorkspaceRoot } from 'vite'

export default defineConfig({
  server: {
    fs: {
      allow: [
        searchForWorkspaceRoot(path.resolve(path.join(process.cwd(), '..', '..')))
      ]
    }
  }
})
