import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest'
import { app } from '../../app'
import request from 'supertest'
import { execSync } from 'child_process'

let cookie: string[] = []

async function migrate() {
  // eslint-disable-next-line no-new
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(execSync('npm run knex migrate:rollback --all'))
    }, 100)
  })

  // eslint-disable-next-line no-new
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(execSync('npm run knex migrate:latest'))
    }, 100)
  })
}

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

beforeEach(async () => {
  await migrate()

  const createUserResponse = await request(app.server)
    .post('/users')
    .send({
      email: 'lucas@gmail.com',
    })
    .expect(201)

  cookie = createUserResponse.get('Set-Cookie')
})

describe('Meal Routes', async () => {
  describe('POST /', () => {
    it('should throw a unauthorized error when session id is invalid', async () => {
      await request(app.server).post('/meals').send({}).expect(401)
      await request(app.server)
        .post('/meals')
        .set('Cookie', 'any_cookie')
        .send({})
        .expect(401)
    })
    it('should throw when name and is_on_the_diet is not pass', async () => {
      const response = await request(app.server)
        .post('/meals')
        .set('Cookie', cookie)
        .send({})
        .expect(422)

      expect(response.body).toStrictEqual({
        errors: [
          { error: 'invalid_type', message: 'name is required' },
          { error: 'invalid_type', message: 'is_on_the_diet is required' },
        ],
      })
    })
    it('should throw when name is not pass', async () => {
      const response = await request(app.server)
        .post('/meals')
        .set('Cookie', cookie)
        .send({
          is_on_the_diet: true,
        })
        .expect(422)

      expect(response.body).toStrictEqual({
        errors: [{ error: 'invalid_type', message: 'name is required' }],
      })
    })
    it('should throw when is_on_the_diet is not pass', async () => {
      const response = await request(app.server)
        .post('/meals')
        .set('Cookie', cookie)
        .send({
          name: 'pizza',
        })
        .expect(422)

      expect(response.body).toStrictEqual({
        errors: [
          { error: 'invalid_type', message: 'is_on_the_diet is required' },
        ],
      })
    })
    it('should create a meal', async () => {
      await request(app.server)
        .post('/meals')
        .set('Cookie', cookie)
        .send({
          name: 'pizza',
          is_on_the_diet: true,
        })
        .expect(201)
    })
  })

  describe('GET /', () => {
    it('should throw a unauthorized error when session id is invalid', async () => {
      await request(app.server).get('/meals').expect(401)
      await request(app.server)
        .get('/meals')
        .set('Cookie', 'any_cookie')
        .expect(401)
    })

    it('should return a list of meals', async () => {
      await request(app.server)
        .post('/meals')
        .set('Cookie', cookie)
        .send({
          name: 'pizza',
          is_on_the_diet: false,
        })
        .expect(201)
      await request(app.server)
        .post('/meals')
        .set('Cookie', cookie)
        .send({
          name: 'salad',
          is_on_the_diet: true,
        })
        .expect(201)

      const response = await request(app.server)
        .get('/meals')
        .set('Cookie', cookie)
        .expect(200)

      expect(response.body.meals).toEqual([
        expect.objectContaining({ name: 'pizza', is_on_the_diet: 0 }),
        expect.objectContaining({ name: 'salad', is_on_the_diet: 1 }),
      ])
    })
  })

  describe('GET /:id', () => {
    it('should throw a unauthorized error when session id is invalid', async () => {
      await request(app.server).get('/meals').send({}).expect(401)
      await request(app.server)
        .get('/meals/any_id')
        .set('Cookie', 'any_cookie')
        .send({})
        .expect(401)
    })

    it('should throw a not found error when id is invalid', async () => {
      const response = await request(app.server)
        .get('/meals/any_id')
        .set('Cookie', cookie)
        .expect(404)

      expect(response.body).toStrictEqual({ error: 'Meal not found' })
    })

    it('should return a single meal', async () => {
      await request(app.server)
        .post('/meals')
        .set('Cookie', cookie)
        .send({
          name: 'pizza',
          is_on_the_diet: false,
        })
        .expect(201)

      await request(app.server)
        .post('/meals')
        .set('Cookie', cookie)
        .send({
          name: 'salad',
          is_on_the_diet: true,
        })
        .expect(201)

      const listMealsResponse = await request(app.server)
        .get('/meals')
        .set('Cookie', cookie)
        .expect(200)

      console.log(listMealsResponse.body)

      const getMealResponse = await request(app.server)
        .get(`/meals/${listMealsResponse.body.meals[0].id}`)
        .set('Cookie', cookie)
        .expect(200)

      expect(getMealResponse.body).toEqual(
        expect.objectContaining({ name: 'pizza', is_on_the_diet: 0 }),
      )
    })
  })

  describe('GET /metrics', () => {
    it('should return all metrics meals of user', async () => {
      const now = new Date().getTime()
      const fakeData = [
        {
          name: 'pizza',
          is_on_the_diet: false,
          created_at: new Date(now + 100).toISOString(),
        },
        {
          name: 'cake',
          is_on_the_diet: false,
          created_at: new Date(now + 200).toISOString(),
        },
        {
          name: 'salad',
          is_on_the_diet: true,
          created_at: new Date(now + 300).toISOString(),
        },
      ]

      for await (const data of fakeData) {
        await request(app.server)
          .post('/meals')
          .set('Cookie', cookie)
          .send(data)
          .expect(201)
      }

      let metricsMealsResponse

      metricsMealsResponse = await request(app.server)
        .get('/meals/metrics')
        .set('Cookie', cookie)
        .expect(200)

      expect(metricsMealsResponse.body).toStrictEqual({
        total: 3,
        insideTheDiet: 1,
        offTheDiet: 2,
        bestSequence: 1,
      })

      await request(app.server)
        .post('/meals')
        .set('Cookie', cookie)
        .send({
          name: 'salad_2',
          is_on_the_diet: true,
          created_at: new Date(now + 400).toISOString(),
        })
        .expect(201)

      metricsMealsResponse = await request(app.server)
        .get('/meals/metrics')
        .set('Cookie', cookie)
        .expect(200)

      expect(metricsMealsResponse.body).toStrictEqual({
        total: 4,
        insideTheDiet: 2,
        offTheDiet: 2,
        bestSequence: 2,
      })
    })
  })
})
