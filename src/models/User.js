//@ts-check
const { Schema, model } = require('mongoose')
const { createVerificationCode, createOTP } = require('../utils')

const UserSchema = new Schema({
  email: {
    type: Schema.Types.String,
    required: true,
  },
  password: {
    type: Schema.Types.String,
    required: true,
  },
  name: {
    type: Schema.Types.String,
    required: true,
  },
  phoneNumber: {
    type: Schema.Types.String,
    required: true,
  },
  isPhoneVerified: {
    type: Schema.Types.Boolean,
    // default: false,
    default: true,
  },
  isEmailVerified: {
    type: Schema.Types.Boolean,
    // default: false,
    default: true,
  },
  verificationCode: {
    type: Schema.Types.String,
    default: createVerificationCode,
  },
  otp: {
    type: Schema.Types.String,
    default: createOTP,
  },
  role: {
    type: Schema.Types.String,
    default: 'user',
    enum: ['user', 'admin'],
  },
})

model('User', UserSchema)
