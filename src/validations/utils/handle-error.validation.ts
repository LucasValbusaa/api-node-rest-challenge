import { z } from 'zod'

export type HandelValidationInput = {
  error: string
  message: string
}

export type ZodError = {
  code: string
  expected: string
  received: string
  path: [string]
  message: string
}

export class HandleErrorValidation<B> {
  private formatError(error: any): HandelValidationInput[] {
    return error.map((e: ZodError) => {
      return {
        error: e.code,
        message: `${e.path[0]} is ${e.message.toLocaleLowerCase()}`,
      }
    })
  }

  async handle(
    schema: z.Schema,
    body: B,
  ): Promise<B | HandelValidationInput[]> {
    const parse = schema.safeParse(body)

    if (parse.success === false) {
      const error = this.formatError(parse.error.errors)
      return error
    }

    return parse.data
  }
}
