import path from 'node:path'
import fs from 'node:fs'
import crypto from 'node:crypto'
import { WritableStream } from 'node:stream/web'

/**
 * @param {Koa.Context} ctx
 * @returns {Promise}
 */
export async function get(ctx) {
  if (!ctx.query.prompt) {
    return ctx.throw(Status.BAD_REQUEST)
  }

  const hashedPrompt = crypto.createHash('sha256').update(ctx.query.prompt).digest('hex')
  const hashedFilePath = path.join(process.cwd(), 'cache', 'images', hashedPrompt)
  try {
    const cachedImage = await fs.promises.stat(
      hashedFilePath
    )
    if (!cachedImage.isFile()) {
      throw new Error('Meeck')
    }
  } catch (error) {
    const image = await ctx.openai.createImage({
      prompt: ctx.query.prompt,
      size: '256x256',
    })
    console.log(image.data)
    const response = await fetch(image.data.data[0].url)
    console.log(response.body)
    const file = fs.createWriteStream(hashedFilePath)
    const writableFile = new WritableStream({
      write(chunk) {
        file.write(chunk)
      }
    })
    await response.body.pipeTo(writableFile)
  }
  ctx.set('Cross-Origin-Resource-Policy', 'same-site')
  ctx.set('Content-Type', 'image/png')
  ctx.body = fs.createReadStream(hashedFilePath)
}

export default {
  get
}
