export const up = async (knex) => {
  await knex.schema.createTable("forms", (table) => {
    table.increments("id")
    table.text("title").notNullable()
  })

  await knex.schema.createTable("fields", (table) => {
    table.increments("id")
    table.text("title").notNullable()
    table.text("options")
    table.text("label").notNullable()
    table.text("defaultValue").notNullable()
  })

  await knex.schema.createTable("rel_form_fields", (table) => {
    table.integer("formId").references("id").inTable("forms").notNullable()
    table.integer("fieldId").references("id").inTable("fields").notNullable()
  })
}

export const down = async (knex) => {
  await knex.schema.dropTable("rel_form_fields")
  await knex.schema.dropTable("fields")
  await knex.schema.dropTable("forms")
}
