import { execSync } from 'child_process'
import { afterAll, beforeAll, beforeEach } from 'vitest'
import { app } from '../../app'
import { knex } from '../../config/knex'

knex.migrate.rollback()

export async function setupTests() {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })
}
