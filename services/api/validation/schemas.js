import joi from 'joi'

export const chatCreateSchema = joi.object({
  message: joi.string().required()
})

export const penCreateSchema = joi.object({
  title: joi.string().default('Untitled'),
  html: joi.string().default('<!-- TODO -->'),
  css: joi.string().default('/* TODO */'),
  js: joi.string().default('/* TODO */'),
})

export const penUpdateSchema = joi.object({
  title: joi.string(),
  html: joi.string(),
  css: joi.string(),
  js: joi.string(),
})
