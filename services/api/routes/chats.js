import Status from 'http-status-codes'
import * as cheerio from 'cheerio'
import prettier from 'prettier'
import { chatCreateSchema } from '../validation/schemas.js'
import fs from 'node:fs'

/**
 * Lists all chat messages for a pen.
 *
 * @param {Koa.Context} ctx
 * @returns {Promise}
 */
export async function list(ctx) {
  const chatMessages = await ctx.db.Chat.findAll({
    where: {
      pen_id: ctx.params.id,
    },
  })
  ctx.body = chatMessages.map((message) => ({
    id: message.id,
    role: message.role,
    message: message.message,
  }))
}

/**
 * Creates a chat message.
 *
 * @param {Koa.Context} ctx
 * @param {string} message
 * @returns {Promise}
 */
async function chat(ctx, text) {
  const config = {
    model: process.env.OPENAI_TEXT_MODEL ?? 'gpt-3.5-turbo'
  }

  const chatMessages = await ctx.db.Chat.findAll({
    where: {
      pen_id: ctx.params.id,
    },
  })

  const newUserChat = await ctx.db.Chat.create({
    pen_id: ctx.params.id,
    role: 'user',
    message: text
  })

  const baseMessages = [
    {
      role: 'system',
      content:
        'You are a helpful HTML developer that generates a single HTML code with CSS and JavaScript. All images should point to http://localhost:8080/api/v1/images?prompt=<put the image description here>.',
    },
  ]
  const messages = baseMessages
    .concat(
      chatMessages.map((chatMessage) => ({
        role: chatMessage.role,
        content: chatMessage.message,
      })),
    )
    .concat([
      {
        role: newUserChat.role,
        content: newUserChat.message,
      },
    ])

  const completion = await ctx.openai.createChatCompletion({
    model: config.model,
    messages: messages,
  })

  const content = completion.data.choices[0].message.content
  const matches = content.match(/```([a-z]*)\n([\s\S]*?)```/g)
  if (matches) {
    const pen = await ctx.db.Pen.findByPk(ctx.params.id)
    if (!pen) {
      return ctx.throw(Status.CONFLICT, 'Pen not found')
    }

    console.log(matches)

    let updatedPen
    if (matches.length > 1) {
      // TODO: Tenemos que ver qué hacemos cuando hay más
      //       de un código generado.
      const [html, style, script] = matches

      const sanitizedHtml = html.slice(3, -3).replace(/^html\n/, '')
      const $ = cheerio.load()
      const title = $('title').html()

      updatedPen = await ctx.db.Pen.update(
        {
          title: title ?? pen.title,
          html: prettier.format(sanitizedHtml ?? pen.html, { parser: 'html' }),
          css: prettier.format(style ?? pen.css, { parser: 'css' }),
          js: prettier.format(script ?? pen.js, { parser: 'babel' }),
        },
        {
          where: {
            id: ctx.params.id,
          },
        },
      )
    } else {
      const [html] = matches
      const sanitizedHtml = html.slice(3, -3).replace(/^html\n/, '')
      const $ = cheerio.load(sanitizedHtml)
      const title = $('title').html()
      const style = $('style').html()
      const body = $('body').html()
      const script = $('script').html()

      updatedPen = await ctx.db.Pen.update(
        {
          title: title ?? pen.title,
          html: prettier.format(body ?? pen.html, { parser: 'html' }),
          css: prettier.format(style ?? pen.css, { parser: 'css' }),
          js: prettier.format(script ?? pen.js, { parser: 'babel' }),
        },
        {
          where: {
            id: ctx.params.id,
          },
        },
      )
      const channel = `pen:${ctx.params.id}`
      ctx.pub.publish(channel, JSON.stringify({ type: 'update', updatedAt: new Date() }))
    }
    const channel = `pen:${ctx.params.id}`
    ctx.pub.publish(
      channel,
      JSON.stringify({ type: 'update', updatedAt: new Date() }),
    )
  }

  const newAssistantChat = await ctx.db.Chat.create({
    pen_id: ctx.params.id,
    role: completion.data.choices[0].message.role,
    message: completion.data.choices[0].message.content,
  })

  return [text, completion.data]
}

/**
 * Create a chat completion from audio.
 *
 * @param {*} ctx
 */
export async function audio(ctx) {
  const config = {
    model: process.env.OPENAI_AUDIO_MODEL ?? 'whisper-1'
  }

  console.log(ctx.request.files.file)
  console.log(config.model)
  const transcription = await ctx.openai.createTranscription(
    fs.createReadStream(ctx.request.files.file.filepath),
    config.model,
    undefined,
    'json',
    undefined,
    'es' // TODO: Ver cómo detectar esto o pasar esto.
  )
  const { text } = transcription.data

  ctx.status = Status.CREATED
  ctx.body = await chat(ctx, text)
}

/**
 * Create a chat completion.
 *
 * @param {Koa.Context} ctx
 * @returns {Promise}
 */
export async function create(ctx) {
  const { error, value } = chatCreateSchema.validate(ctx.request.body)
  if (error) {
    return ctx.throw(Status.BAD_REQUEST)
  }

  ctx.status = Status.CREATED
  ctx.body = await chat(ctx, value.message)
}

export default {
  list,
  create,
  audio
}
