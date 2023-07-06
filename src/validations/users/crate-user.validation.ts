import { z } from 'zod'
import { CreateUserValidationInput } from './dto/create-user'
import { HandleErrorValidation } from '../utils/handle-error.validation'

export async function createUserValidation(body: CreateUserValidationInput) {
  const createUserSchema = z.object({
    email: z.string(),
  })

  return new HandleErrorValidation<CreateUserValidationInput>().handle(
    createUserSchema,
    body,
  )
}
