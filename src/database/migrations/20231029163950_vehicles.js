exports.up = function (knex) {
  return knex.schema.createTable('vehicles', function (table) {
    table.increments('id').primary();
    table.string('make').notNullable();
    table.string('model').notNullable();
    table.string('state').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('vehicles');
};
