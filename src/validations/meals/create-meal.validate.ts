import { z } from 'zod'
import { CreateMealInput } from './dto/create-meal.dto'
import { HandleErrorValidation } from '../utils/handle-error.validation'

export async function createMealValidation(body: CreateMealInput) {
  const createMealSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    is_on_the_diet: z.boolean(),
    created_at: z.string().optional(),
  })

  return new HandleErrorValidation<CreateMealInput>().handle(
    createMealSchema,
    body,
  )
}
