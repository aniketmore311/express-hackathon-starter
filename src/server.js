//@ts-check
require('make-promises-safe')
require('dotenv').config()
const setup  = require('./setup/index')
setup()
const mongoose = require('mongoose')

const configService = require('./config/configService')
const app = require('./app')

async function main() {
  const PORT = configService.getConfig('PORT')
  const MONGO_URI = configService.getConfig('MONGO_URI')
  await mongoose.connect(MONGO_URI, {})
  console.log(`Connected to MongoDB`)
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
}

main().catch((err) => {
  console.log(err)
  process.exit(1)
})
