require('dotenv').config()

exports.seed = function(knex) {
  return knex('users').del()
    .then(function () {
      return knex('users').insert({
          name: process.env.ADM_USER,
          email: process.env.ADM_EMAIL,
          password: process.env.ADM_PASSWORD
        }
      );
    });
};
