## To-do-List (BACK-END)

# Install dependencies and create tables
  npm run project-init

# Run Server
  npm run dev

# Create knexfile.js
  npx knex init

# Create Migrations
  npx knex migrate: make create_table_name

# Create Seeds
  npx knex seed:make name_seed

# Run Migrations
  npx knex migrate:latest

# Run Seeds
  npx knex seed:run

# Run Specific Seed
  npx knex seed: run --specific seed_name

## DOTENV CONFIG
# If you want to use localhost, it's necessary just DB_USER, DB_PASSWORD and DB_DATABASE
# DB CONFIG
DB_CLIENT = 
DB_HOST = 
DB_USER = 
DB_PASSWORD = 
DB_DATABASE = 
DB_PORT = 

# SEED CONFIG
ADM_USER = 
ADM_EMAIL = 
ADM_PASSWORD = 

# APP CONFIG
PORT = 

# JWT CONFIG
SECRET = 



