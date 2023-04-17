import Router from '@koa/router'
import chat from './routes/chat.js'

const chatRouter = new Router()
chatRouter.post('/chat', chat.create)

const router = new Router()
router
  .prefix('/api/v1')
  .get('/', (ctx) => {
    ctx.body = {
      version: '1.0.0'
    }
  })
  .use(chatRouter.routes(), chatRouter.allowedMethods())

export default router
