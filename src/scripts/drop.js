#! /bin/env node
//@ts-check
require('dotenv').config()
const User = require('../models/User')
const mongoose = require('mongoose')
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
