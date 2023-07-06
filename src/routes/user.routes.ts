import { FastifyInstance } from 'fastify'
import { createUserValidation } from '../validations/users/crate-user.validation'
import { CreateUserValidationInput } from '../validations/users/dto/create-user'
import { randomUUID } from 'node:crypto'
import { knex } from '../config/knex'

export async function userRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const validation = await createUserValidation(
      request.body as CreateUserValidationInput,
    )

    if (Array.isArray(validation)) {
      return reply.status(422).send({
        errors: validation,
      })
    }

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()
      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex('users').insert({
      id: randomUUID(),
      email: validation.email,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })

  app.post('/login', async (request, reply) => {
    const validation = await createUserValidation(
      request.body as CreateUserValidationInput,
    )

    if (Array.isArray(validation)) {
      return reply.status(422).send({
        errors: validation,
      })
    }

    const user = await knex('users').where({ email: validation.email }).first()

    if (!user) {
      return reply.status(404).send({
        error: 'User not found',
      })
    }

    let sessionId = ''
    const configCookie = {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    }

    if (!user.session_id) {
      sessionId = randomUUID()
      reply.cookie('sessionId', sessionId, configCookie)
      await knex('users').update({ session_id: sessionId }, user.id)
    } else {
      reply.cookie('sessionId', user.session_id, configCookie)
    }
  })
}
