import { faker } from "@faker-js/faker"
import hashPassword from "../hashPassword.js"

export const seed = async function (knex) {
  await knex.raw("TRUNCATE TABLE roles RESTART IDENTITY CASCADE")
  await knex.raw("TRUNCATE TABLE users RESTART IDENTITY CASCADE")
  const users = []
  const nameRole = ["admin", "manager", "editor"]
  const roles = []

  for (let i = 0; i < 3; i++) {
    roles.push({
      name: nameRole[i],
    })
  }
  await knex("roles").insert(roles)

  for (let i = 0; i < 3; i++) {
    const [passwordHash, passwordSalt] = await hashPassword("Testmdp123?")
    users.push({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      passwordHash: passwordHash,
      passwordSalt: passwordSalt,
      roleId: i + 1,
    })
  }
  await knex("users").insert(users)
}
