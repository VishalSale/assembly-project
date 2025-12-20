const bcrypt = require('bcrypt');
const { TABLES } = require('../config/constants');

exports.seed = async function(knex) {
  await knex(TABLES.USERS).del();

  const passwordHash = await bcrypt.hash('admin123', 10);

  await knex(TABLES.USERS).insert([
    {
      name: 'Admin',
      email: 'admin@gmail.com',
      mobile: '9999999999',
      password: passwordHash,
      passwordb64: Buffer.from('admin123').toString('base64'),
      role: 'admin',
      ward_id: 'ALL',
      ward_name: 'All Wards',
      status: 'active'
    }
  ]);
};
