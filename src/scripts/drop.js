//@ts-check
require('dotenv').config()
const User = require('../models/User')
const mongoose = require('mongoose')
const configService = require('../config/configService')

async function main() {
  await mongoose.connect(configService.getConfig('MONGO_URI'))
  console.log('mogo connected')
  await User.collection.drop()
  const users = await User.find()
  console.log(users)
}

main().catch((err) => console.log(err))
