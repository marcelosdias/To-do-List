# To-do-List

# Gerar o knexfile.js
  npx knex init

# Criar migrations
  npx knex migrate: make create_table_name

# Criar seeds
  npx knex seed:make name_seed

# Rodar migrations
  npx knex migrate:latest

# Rodar seeds
  npx knex seed:run

# Rodar seed especifica
  npx knex seed: run --specific seed_name




