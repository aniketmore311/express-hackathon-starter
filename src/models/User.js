//@ts-check
const { Schema, model } = require('mongoose')
const createVerificationCode = require('../utils/createVerificationCode')

const UserSchema = new Schema({
  username: {
    type: Schema.Types.String,
    required: true,
  },
  password: {
    type: Schema.Types.String,
    required: true,
  },
  email: {
    type: Schema.Types.String,
    required: true,
  },
  isEmailVerified: {
    type: Schema.Types.Boolean,
    default: false,
  },
  verificationCode: {
    type: Schema.Types.String,
    default: createVerificationCode,
  },
  profileUrl: {
    type: Schema.Types.String,
    default: '/uploads/defaultprofile.jpeg',
    required: true,
  },
  role: {
    type: Schema.Types.String,
    default: 'user',
    enum: ['user', 'admin'],
  },
})

const User = model('User', UserSchema)
module.exports = User
