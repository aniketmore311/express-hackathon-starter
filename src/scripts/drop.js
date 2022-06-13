#! /bin/env node
//@ts-check
require('dotenv').config()
require('../setup/models')
const mongoose = require('mongoose')
const User = mongoose.models.User
const configService = require('../config/configService')

async function main() {
  await mongoose.connect(configService.getConfig('MONGO_URI'))
  console.log('mongodb connected')
  await User.collection.drop()
  const users = await User.find()
  console.log(users)
  await mongoose.connection.close()
}

main().catch((err) => console.log(err))
