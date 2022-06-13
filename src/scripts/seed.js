#! /bin/env node
//@ts-check
require('../setup/models')
require('dotenv').config()
const mongoose = require('mongoose')
const User = mongoose.models.User
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
    name: 'admin',
    email: 'admin@gmail.com',
    phoneNumber: '0123456789',
    password: hashPassword('password'),
    isEmailVerified: true,
    role: 'admin',
  })
  console.log(admin.toObject())
  const user1 = await User.create({
    name: 'user1',
    email: 'user1@gmail.com',
    phoneNumber: '0123456789',
    isEmailVerified: true,
    password: hashPassword('password'),
  })
  console.log(user1.toObject())
  const user2 = await User.create({
    name: 'user2',
    email: 'user2@gmail.com',
    phoneNumber: '0123456789',
    isEmailVerified: true,
    password: hashPassword('password'),
  })
  console.log(user2.toObject())
  await mongoose.connection.close()
}

main().catch(console.log)
