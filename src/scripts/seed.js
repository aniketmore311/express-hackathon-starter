#! /bin/env node
//@ts-check
require('dotenv').config()
const User = require('../models/User')
const mongoose = require('mongoose')
const configService = require('../config/configService')
const bcryptjs = require('bcryptjs')

function hashPassword(password) {
  const salt = bcryptjs.genSaltSync(10)
  const hash = bcryptjs.hashSync(password, salt)
  return hash
}

async function main() {
  await mongoose.connect(configService.getConfig('MONGO_URI'))
  console.log('mongodb connected')
  console.log('users added: ')
  const admin = await User.create({
    username: 'admin',
    email: 'admin@gmail.com',
    password: hashPassword('password'),
    role: 'admin',
  })
  console.log(admin)
  const user1 = await User.create({
    username: 'user1',
    email: 'user1@gmail.com',
    password: hashPassword('password'),
  })
  console.log(user1)
  const user2 = await User.create({
    username: 'user2',
    email: 'user2@gmail.com',
    password: hashPassword('password'),
  })
  console.log(user2)
  await mongoose.connection.close()
}

main().catch(console.log)
