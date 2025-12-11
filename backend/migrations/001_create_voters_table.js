exports.up = function(knex) {
  return knex.schema.createTable('kagal_data', function(table) {
    table.string('id').primary();
    table.string('EFullName');
    table.string('MFullName');
    table.string('Mobile No');
    table.string('Serial No');
    table.string('Booth No');
    table.string('Booth Name');
    table.string('Ebooth Name');
    table.string('EPIC');
    table.text('Address');
    table.string('Age');
    table.string('Part');
    table.string('Part Name');
    table.string('House No');
    table.string('Gender');
    table.string('Relation');
    table.string('Father Name');
    table.string('MFather Name');
    table.timestamps(true, true);

    table.index(['EFullName']);
    table.index(['MFullName']);
    table.index(['Mobile No']);
    table.index(['Booth No']);
    table.index(['Serial No']);
    table.index(['EPIC']);
    table.index(['Age']);
    table.index(['Part']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('kagal_data');
};
