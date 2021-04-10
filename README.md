# Awesome Project Build with TypeORM

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `ormconfig.json` file
3. Run `npm start` command

command line used:
npm i -g typeorm
typeorm init --database mysql
// update the typescript dependencies
npm i ts-node@latest @types/node@latest typescript@latest
npm install
npm install express
npm install -D @types/express morgan @types/morgan
npm install -D nodemon
npm install class-validator
npm install bcrypt
npm i -D @types/bcrypt
npm install class-transformer
npm i jsonwebtoken cookie cookie-parser
npm i -D @types/jsonwebtoken @types/cookie @types/cookie-parser
npm i dotenv

typeorm entity:create --name Post
// change package.json first
npm run typeorm schema:drop
npm run typeorm migration:generate -- --name create-users-table
npm run typeorm migration:run

tsc
npx tsc
tsc --noEmit

npm run typeorm migration:generate -- --name create-comments-table
npm run typeorm migration:run
npm run typeorm migration:revert

npx create-next-app client

npm install --save-dev @types/react typescript

npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
npx tailwindcss init -p

// in client
npm install axios;
// in server
npm install cors
npm install -D @types/cors

<!-- 注意， setCookie的时候，需要调整参数，让client信任Server -->
