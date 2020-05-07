
exports.up = knex => knex.schema.createTable('posts', table => {
    table.increments('id')
    table.integer('userId')
        .references('users.id')
        .notNullable()
        .onDelete('CASCADE')
    table.string('title').notNullable()
    table.boolean('status').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })

exports.down = knex => knex.schema.dropTable('posts')