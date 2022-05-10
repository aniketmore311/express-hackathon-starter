//@ts-check
const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
  username: {
    type: Schema.Types.String,
    required: true,
  },
  password: {
    type: Schema.Types.String,
    required: true,
  },
  profileUrl: {
    type: Schema.Types.String,
    required: true,
  },
})

const User = model('User', UserSchema)
module.exports = User
