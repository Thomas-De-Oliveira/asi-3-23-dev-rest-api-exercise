import { faker } from "@faker-js/faker"
import hashPassword from "../hashPassword.js"

export const seed = async function (knex) {
  await knex.raw("TRUNCATE TABLE permissions RESTART IDENTITY CASCADE")
  await knex.raw("TRUNCATE TABLE roles RESTART IDENTITY CASCADE")
  await knex.raw("TRUNCATE TABLE users RESTART IDENTITY CASCADE")
  const users = []
  const permissions = [
    {
      createUser: 1,
      readUser: 1,
      updateUser: 1,
      deleteUser: 1,
      createPage: 1,
      readPage: 1,
      updatePage: 1,
      deletePage: 1,
      createNav: 1,
      updateNav: 1,
      readNav: 1,
      deleteNav: 1,
      createForm: 1,
      updateForm: 1,
      readForm: 1,
      deleteForm: 1,
    },
    {
      createUser: 0,
      readUser: 1,
      updateUser: 1,
      deleteUser: 0,
      createPage: 1,
      readPage: 1,
      updatePage: 1,
      deletePage: 1,
      createNav: 1,
      updateNav: 1,
      readNav: 1,
      deleteNav: 1,
      createForm: 1,
      updateForm: 1,
      readForm: 1,
      deleteForm: 1,
    },
    {
      createUser: 0,
      readUser: 1,
      updateUser: 1,
      deleteUser: 0,
      createPage: 0,
      readPage: 1,
      updatePage: 1,
      deletePage: 0,
      createNav: 0,
      updateNav: 0,
      readNav: 1,
      deleteNav: 0,
      createForm: 0,
      updateForm: 0,
      readForm: 1,
      deleteForm: 0,
    },
  ]

  await knex("permissions").insert(permissions)

  const nameRole = ["admin", "manager", "editor"]
  const roles = []

  for (let i = 0; i < 3; i++) {
    roles.push({
      name: nameRole[i],
      permissionId: i + 1,
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
