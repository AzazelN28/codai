import Koa from 'koa'
import cors from '@koa/cors'
import { koaBody as body } from 'koa-body'
import helmet from 'koa-helmet'
import files from 'koa-static'
import db from './db.js'
import openai from './openai.js'
import router from './router.js'
import sub from './sub.js'
import pub from './pub.js'

/**
 *
 *
 *
 */
export default async function main()
{
  const app = new Koa()
  app.context.db = await db()
  app.context.sub = await sub()
  app.context.pub = await pub()
  app.context.openai = await openai()
  app.use(helmet())
  app.use(cors())
  app.use(body({
    multipart: true,
    formidable: {
      maxFileSize: 200 * 1024 * 1024,
      keepExtensions: true
    }
  }))
  app.use(router.routes())
  app.use(router.allowedMethods())
  app.listen(process.env.PORT || 3000)
}
