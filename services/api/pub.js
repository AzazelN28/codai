import Redis from 'ioredis'

export default async function pub() {
  return new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  })
}
