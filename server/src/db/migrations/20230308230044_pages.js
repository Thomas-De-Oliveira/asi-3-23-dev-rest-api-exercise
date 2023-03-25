export const up = async (knex) => {
  await knex.schema.createTable("pages", (table) => {
    table.increments("id")
    table.text("title").notNullable()
    table.text("content").notNullable()
    table.text("slug").notNullable().unique()
    table.timestamps(true, true, true)
    table.text("status").notNullable()
    table.integer("creator").references("id").inTable("users")
  })

  await knex.schema.createTable("rel_page_user", (table) => {
    table.timestamps(true, true, true)
    table.integer("pageId").references("id").inTable("pages").notNullable()
    table.integer("userId").references("id").inTable("users").notNullable()
  })

  await knex.schema.createTable("navigation", (table) => {
    table.increments("id")
    table.text("name").notNullable()
  })

  await knex.schema.createTable("rel_nav_pages", (table) => {
    table.integer("pageId").references("id").inTable("pages").notNullable()
    table.integer("navId").references("id").inTable("navigation").notNullable()
  })
}

export const down = async (knex) => {
  await knex.schema.dropTable("rel_page_user")
  await knex.schema.dropTable("rel_nav_pages")
  await knex.schema.dropTable("navigation")
  await knex.schema.dropTable("pages")
}
