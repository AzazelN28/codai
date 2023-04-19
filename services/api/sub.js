import Redis from 'ioredis'

export default async function sub()
{
  const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    lazyConnect: true
  })
  await redis.connect()
  await redis.subscribe('chat')
  return redis
}
