import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { app } from '../../app'
import request from 'supertest'
import { execSync } from 'child_process'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

beforeEach(async () => {
  execSync('npm run knex migrate:rollback --all')
  execSync('npm run knex migrate:latest')
})

describe('User Routes', () => {
  describe('POST /', () => {
    it('should throw when email is not pass', async () => {
      const response = await request(app.server)
        .post('/users')
        .send({})
        .expect(422)

      expect(response.body).toStrictEqual({
        errors: [{ error: 'invalid_type', message: 'email is required' }],
      })
    })
    it('should create a user', async () => {
      await request(app.server)
        .post('/users')
        .send({
          email: 'lucas@gmail.com',
        })
        .expect(201)
    })
  })
})
