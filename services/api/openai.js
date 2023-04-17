import { Configuration, OpenAIApi } from 'openai'

export default async function init() {
  const configuration = new Configuration({
    organization: "org-77aKHK5yxWxIqacfJtpAT1lL",
    apiKey: process.env.OPENAI_API_KEY,
  })

  return new OpenAIApi(configuration)
}
