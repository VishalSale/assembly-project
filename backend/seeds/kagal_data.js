exports.seed = async function (knex) {
  await knex('kagal_data').del();

  await knex('kagal_data').insert([
    {
      municipality: 'Vita',
      ward_no: '1',
      booth_no: '1',
      serial_no: '1',
      full_name: 'Premlata Prakash Savne',
      gender: 'F',
      age: '37',
      epic_no: 'ZZT4871471',
      assembly_no: '286/41/461',
      mobile: null,
      dob: null,
      demands: null,
      worker_name: null,
      new_address: null,
      society_name: null,
      flat_no: null
    },
    {
      municipality: 'Vita',
      ward_no: '1',
      booth_no: '2',
      serial_no: '2',
      full_name: 'Prakash Ram Savne',
      gender: 'M',
      age: '42',
      epic_no: 'ZZT4871472',
      assembly_no: '286/41/461',
      mobile: '9876543210',
      dob: '1982-05-12',
      demands: 'Water connection',
      worker_name: 'Amit Patil',
      new_address: null,
      society_name: null,
      flat_no: null
    }
  ]);
};
