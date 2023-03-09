export const up = async (knex) => {
  await knex.schema.createTable("permissions", (table) => {
    table.increments("id")
    table.boolean("createUser").notNullable()
    table.boolean("readUser").notNullable()
    table.boolean("updateUser").notNullable()
    table.boolean("deleteUser").notNullable()
    table.boolean("createPage").notNullable()
    table.boolean("readPage").notNullable()
    table.boolean("updatePage").notNullable()
    table.boolean("deletePage").notNullable()
    table.boolean("createNav").notNullable()
    table.boolean("readNav").notNullable()
    table.boolean("updateNav").notNullable()
    table.boolean("deleteNav").notNullable()
    table.boolean("createForm").notNullable()
    table.boolean("readForm").notNullable()
    table.boolean("updateForm").notNullable()
    table.boolean("deleteForm").notNullable()
  })

  await knex.schema.createTable("roles", (table) => {
    table.increments("id")
    table.text("name").notNullable()
    table
      .integer("permissionId")
      .references("id")
      .inTable("permissions")
      .notNullable()
  })

  await knex.schema.createTable("users", (table) => {
    table.increments("id")
    table.text("firstName").notNullable()
    table.text("lastName").notNullable()
    table.text("email").notNullable().unique()
    table.text("passwordHash").notNullable()
    table.text("passwordSalt").notNullable()
    table.timestamps(true, true, true)
    table.integer("roleId").references("id").inTable("roles").notNullable()
  })
}

export const down = async (knex) => {
  await knex.schema.dropTable("users")
  await knex.schema.dropTable("roles")
  await knex.schema.dropTable("permissions")
}
