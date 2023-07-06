import { FastifyInstance } from 'fastify'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { knex } from '../config/knex'
import { getUserBySessionId } from '../middlewares/get-user--by-session-id'
import { createMealValidation } from '../validations/meals/create-meal.validate'
import { CreateMealInput } from '../validations/meals/dto/create-meal.dto'
import { randomUUID } from 'crypto'
import { z } from 'zod'

export async function mealRoutes(app: FastifyInstance) {
  app.decorateRequest('authenticatedUser', '')

  app.addHook('preHandler', async (request, reply) => {
    await checkSessionIdExists(request, reply)
    const user = await getUserBySessionId(request, reply)
    request.user = {
      userId: user.id,
    }
  })

  app.post('/', async (request, reply) => {
    const { userId } = request.user
    const validation = await createMealValidation(
      request.body as CreateMealInput,
    )

    if (Array.isArray(validation)) {
      return reply.status(422).send({
        errors: validation,
      })
    }

    await knex('meals').insert({
      id: randomUUID(),
      name: validation.name,
      description: validation.description,
      is_on_the_diet: validation.is_on_the_diet,
      user_id: userId,
      created_at: validation.created_at ?? new Date().toISOString(),
    })

    return reply.status(201).send()
  })

  app.get('/', async (request, reply) => {
    const { userId } = request.user

    const meals = await knex('meals').where({ user_id: userId }).select('*')

    return reply.send({ meals })
  })

  app.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const { userId } = request.user
    const { id } = request.params

    const meal = await knex('meals').where({ id, user_id: userId }).first()

    if (!meal) {
      return reply.status(404).send({ error: 'Meal not found' })
    }

    return reply.send(meal)
  })

  app.delete('/:id', async (request, reply) => {
    const { userId } = request.user
    const getTransactionsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionsParamsSchema.parse(request.params)

    const meals = await knex('meals').where({ id, user_id: userId }).del()
    return reply.send(meals)
  })

  app.get('/metrics', async (request, reply) => {
    const { userId } = request.user

    const meals = await knex('meals')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc')

    let countSequence = 0

    for await (const m of meals) {
      if (m.is_on_the_diet) {
        countSequence++
      } else {
        break
      }
    }

    const metrics = {
      total: meals.length,
      insideTheDiet: meals.filter((m) => m.is_on_the_diet).length,
      offTheDiet: meals.filter((m) => !m.is_on_the_diet).length,
      bestSequence: countSequence,
    }

    return reply.send(metrics)
  })
}
