const bcrypt = require('bcrypt');

exports.seed = async function(knex) {
  await knex('users').del();

  const passwordHash = await bcrypt.hash('admin123', 10);

  await knex('users').insert([
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
