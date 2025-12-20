const { TABLES } = require('../config/constants');

exports.up = function (knex) {
    return knex.schema.createTable(TABLES.BLACKLISTED_TOKENS, function (table) {
        table.bigIncrements('id').primary();
        table.text('token').notNullable();
        table.timestamp('expires_at').notNullable();
        table.timestamps(true, true);

        table.index(['token']);
        table.index(['expires_at']);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists(TABLES.BLACKLISTED_TOKENS);
};
