# hackathon starter made with express

## what is included in this template

- complete express app setup with error handlers and all required middlewares
- complete authentication setup with
  - User model
  - authentication and authorization middleware
  - login, signup page
  - home and admin pages
- database seed and drop scripts

## how to use this template

make sure you have nodejs 14 lts or higher installed

run the following commnands

- `npx degit aniketmore311/express-hackathon-starter <your project name>`
- `cd <your project name>`
- `npm install`
- `cp .env.example .env`
- fill proper values in .env file
- `npm run script:drop` to drop collections
- `npm run script:seed` to seed collections
- `npm run dev` to run in development
- `npm start` to run in production
