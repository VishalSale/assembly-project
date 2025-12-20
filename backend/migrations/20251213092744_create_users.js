const { TABLES } = require('../config/constants');

exports.up = function (knex) {
    return knex.schema.createTable(TABLES.USERS, function (table) {
        table.bigIncrements('id').primary();

        table.string('name').notNullable();
        table.string('email').unique().notNullable();
        table.string('mobile');
        table.text('password').notNullable();
        table.string('passwordb64');
        table.string('role').defaultTo('admin');

        table.string('ward_id');
        table.string('ward_name');

        // Use simple string instead of enum to avoid conflicts
        table.string('status').defaultTo('active');

        table.timestamps(true, true);

        table.index(['email']);
        table.index(['ward_id']);
        table.index(['status']);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists(TABLES.USERS);
};