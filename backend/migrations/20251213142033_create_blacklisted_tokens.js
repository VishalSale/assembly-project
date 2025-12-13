exports.up = function (knex) {
    return knex.schema.createTable('blacklisted_tokens', function (table) {
        table.bigIncrements('id').primary();
        table.text('token').notNullable();
        table.timestamp('expires_at').notNullable();
        table.timestamps(true, true);

        table.index(['token']);
        table.index(['expires_at']);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('blacklisted_tokens');
};
