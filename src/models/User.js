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
