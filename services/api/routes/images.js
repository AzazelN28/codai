/**
 * @param {Koa.Context} ctx
 * @returns {Promise}
 */
export async function get(ctx) {
  if (!ctx.query.prompt) {
    return ctx.throw(Status.BAD_REQUEST)
  }

  const image = await ctx.openai.createImage({
    prompt: ctx.query.prompt,
    size: '256x256'
  })
  ctx.body = image
}

export default {
  get
}
