import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../config/knex'

export async function getUserBySessionId(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sessionId } = request.cookies
  const user = await knex('users').where({ session_id: sessionId }).first()

  if (!user) {
    return reply.status(404).send({
      error: 'User not found',
    })
  }

  return user
}
