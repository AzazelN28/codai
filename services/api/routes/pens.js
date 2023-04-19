import Status from 'http-status-codes'
import { penCreateSchema, penUpdateSchema } from '../validation/schemas.js'
import { pipeline, Transform } from 'node:stream'

/**
 * Server-Sent Events
 *
 * @param {Context} ctx
 */
export async function sse(ctx) {
  ctx.req.socket.setTimeout(0)
  ctx.req.socket.setNoDelay(true)
  ctx.req.socket.setKeepAlive(true)
  ctx.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  })
  const stream = new Transform({
    transform(data, _encoding, done) {
      this.push(`data: ${data}\n\n`)
      done()
    },
    flush(done) {
      done()
    }
  })
  if (stream.isPaused()) {
    stream.resume()
  }
  const channel = `pen:${ctx.params.id}`
  console.log(`Subscribing to channel ${channel}`)
  stream.on('close', () => ctx.sub.unsubscribe(channel))
  console.log('sub', ctx.sub.mode)
  ctx.sub.subscribe(channel)
  console.log('sub', channel)
  ctx.sub.on('message', (channel, message) => {
    console.log('message', channel, message)
    stream.write(message)
  })
  console.log('message', channel)
  ctx.status = Status.OK
  ctx.body = stream
  stream.write(JSON.stringify({ type: 'hello' }))
  // ctx.body = pipeline(stream, ctx.res)
}

/**
 * Gets a pen.
 *
 * @param {Koa.Context} ctx
 * @returns {Promise}
 */
export async function get(ctx) {
  const newPen = await ctx.db.Pen.findByPk(ctx.params.id)
  if (!newPen) {
    return ctx.throw(Status.NOT_FOUND)
  }
  ctx.body = newPen
}

export async function iframe(ctx) {
  const newPen = await ctx.db.Pen.findByPk(ctx.params.id)
  if (!newPen) {
    return ctx.throw(Status.NOT_FOUND)
  }
  ctx.body = newPen.html
}

/**
 * Creates a pen.
 *
 * @param {Koa.Context} ctx
 * @returns {Promise}
 */
export async function create(ctx) {
  const { error, value } = penCreateSchema.validate(ctx.request.body)
  if (error) {
    return ctx.throw(Status.BAD_REQUEST)
  }

  const newPen = await ctx.db.Pen.create({
    title: value.title ?? 'Untitled',
    html: value.html ?? '',
    css: value.css ?? '',
    js: value.js ?? '',
  })
  ctx.status = Status.CREATED
  ctx.body = newPen
}

/**
 * Updates a pen.
 *
 * @param {Koa.Context} ctx
 * @returns {Promise}
 */
export async function update(ctx) {
  const { error, value } = penUpdateSchema.validate(ctx.request.body)
  if (error) {
    return ctx.throw(Status.BAD_REQUEST)
  }

  const pen = await ctx.db.Pen.findByPk(ctx.params.id)
  if (!pen) {
    return ctx.throw(Status.NOT_FOUND)
  }

  const updatedPen = await pen.update({
    title: value.title ?? pen.title,
    html: value.html ?? pen.html,
    css: value.css ?? pen.css,
    js: value.js ?? pen.js,
  })

  const channel = `pen:${ctx.params.id}`
  console.log('Publishing to channel', channel)
  ctx.pub.publish(channel, JSON.stringify({ type: 'update', updatedAt: new Date() }))
  ctx.body = pen
}

export default {
  create,
  update,
  get,
  iframe,
  sse
}
