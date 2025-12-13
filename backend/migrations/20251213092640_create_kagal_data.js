exports.up = function(knex) {
  return knex.schema.createTable('kagal_data', function(table) {
    table.bigIncrements('id').primary();

    table.string('municipality');
    table.string('ward_no');
    table.string('booth_no');
    table.string('serial_no');
    table.string('full_name');
    table.string('gender');
    table.string('age');

    table.string('epic_no').unique().notNullable();
    table.string('assembly_no');
    table.string('mobile');
    table.string('dob');
    table.text('demands');
    table.string('worker_name');
    table.text('new_address');
    table.string('society_name');
    table.string('flat_no');

    table.timestamps(true, true);

    table.index(['epic_no']);
    table.index(['ward_no']);
    table.index(['booth_no']);
    table.index(['mobile']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('kagal_data');
};
