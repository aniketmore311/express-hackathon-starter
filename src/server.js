//@ts-check
require('make-promises-safe')
require('dotenv').config()
const setup = require('./setup/index')
setup()

const mongoose = require('mongoose')
const http = require('http')

const app = require('./app')
const configService = require('./config/configService')

async function main() {
  const PORT = configService.getConfig('PORT')
  const MONGO_URI = configService.getConfig('MONGO_URI')

  await mongoose.connect(MONGO_URI, {})

  const server = http.createServer(app)

  server.listen(PORT, function () {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
}

main().catch((err) => {
  console.log(err)
  process.exit(1)
})
