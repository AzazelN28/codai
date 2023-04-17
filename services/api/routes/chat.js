import Status from 'http-status-codes'
import { chatCreateSchema } from '../validation/schemas.js'

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

  const config = {
    model: 'gpt-3.5-turbo',
    messages: value.messages,
  }

  const completion = await ctx.openai.createChatCompletion(config)
  ctx.status = Status.CREATED
  ctx.body = completion.data
}

export default {
  create
}
