import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
  DATABASE_CLIENT: z.enum(['sqlite']),
  PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  const messageError = _env.error.errors.map((e) => {
    return {
      error: e.code,
      message: `${e.path[0]} ${e.message}`,
    }
  })
  console.error(messageError)

  throw new Error('Invalid environment variable!')
}

export const env = _env.data
