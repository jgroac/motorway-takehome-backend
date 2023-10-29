exports.up = function (knex) {
  return knex.schema.createTable('stateLogs', function (table) {
    table.integer('vehicleId').notNullable();
    table.string('state').notNullable();
    table.timestamp('timestamp').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('stateLogs');
};
