# Create DB
npx sequelize db:create

# Create Models Users
npx sequelize model:generate --name Users --attributes name:string,username:string,email:string,password:string,role:string,address:text,phoneNumber:string

# Create Models Movies
npx sequelize model:generate --name Movies --attributes title:string,synopsis:text,trailerUrl:text,imageUrl:text,rating:integer,status:string

# Migrate Models
npx sequelize db:migrate

# Seeding Data
npx sequelize seed:generate --name seeding_movie_datas
npx sequelize db:seed --seed 20240823143631-seeding_movie_datas.js