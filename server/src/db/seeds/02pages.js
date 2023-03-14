import { faker } from "@faker-js/faker"

export const seed = async function (knex) {
  await knex.raw("TRUNCATE TABLE rel_nav_pages RESTART IDENTITY CASCADE")
  await knex.raw("TRUNCATE TABLE pages RESTART IDENTITY CASCADE")
  await knex.raw("TRUNCATE TABLE navigation RESTART IDENTITY CASCADE")
  const navigation = []
  const pages = []
  const rel_nav_pages = []
  const status = ["draft", "published"]

  for (let i = 0; i < 3; i++) {
    navigation.push({
      name: faker.random.word(),
    })
  }
  await knex("navigation").insert(navigation)

  for (let i = 0; i < 3; i++) {
    pages.push({
      title: faker.random.word(),
      content: faker.commerce.productDescription(),
      slug: faker.random.word(),
      status: status[faker.datatype.number({ min: 0, max: 1 })],
      creator: 1,
    })
  }
  await knex("pages").insert(pages)

  for (let i = 0; i < 3; i++) {
    rel_nav_pages.push({
      pageId: i + 1,
      navId: i + 1,
    })
  }
  await knex("rel_nav_pages").insert(rel_nav_pages)
}
