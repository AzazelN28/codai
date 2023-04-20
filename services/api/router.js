import Router from '@koa/router'
import chats from './routes/chats.js'
import pens from './routes/pens.js'
import images from './routes/images.js'

const imagesRouter = new Router()
imagesRouter.get('/', images.get)

const chatsRouter = new Router()
chatsRouter.get('/:id', chats.list)
chatsRouter.post('/:id', chats.create)
chatsRouter.post('/:id/audio', chats.audio)

const pensRouter = new Router()
pensRouter.post('/', pens.create)
pensRouter.get('/:id', pens.get)
pensRouter.get('/:id/iframe', pens.iframe)
pensRouter.get('/:id/sse', pens.sse)
pensRouter.put('/:id', pens.update)

const router = new Router()
router
  .prefix('/api/v1')
  .get('/', (ctx) => {
    ctx.body = {
      version: '1.0.0'
    }
  })
  .use('/images', imagesRouter.routes(), imagesRouter.allowedMethods())
  .use('/chats', chatsRouter.routes(), chatsRouter.allowedMethods())
  .use('/pens', pensRouter.routes(), pensRouter.allowedMethods())

export default router
