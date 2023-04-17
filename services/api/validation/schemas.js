import joi from 'joi'

export const chatCreateSchema = joi.object({
  messages: joi.array().items(
    joi.object({
      role: joi.string().valid('user', 'assistant'),
      content: joi.string(),
    }),
  ),
})
