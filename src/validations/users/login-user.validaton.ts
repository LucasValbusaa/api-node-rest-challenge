import { z } from 'zod'
import { HandleErrorValidation } from '../utils/handle-error.validation'
import { LoginUserValidationInput } from './dto/login-user'

export async function loginUserValidation(body: LoginUserValidationInput) {
  const createUserSchema = z.object({
    email: z.string(),
  })

  return new HandleErrorValidation<LoginUserValidationInput>().handle(
    createUserSchema,
    body,
  )
}
