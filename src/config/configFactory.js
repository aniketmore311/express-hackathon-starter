//@ts-check
const path = require('path')

module.exports = function () {
  return {
    PORT: process.env.PORT || 8080,
    NODE_ENV: process.env.NODE_ENV || 'development',
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/test',
    SERVER_URL: process.env.SERVER_URL || 'http://localhost:8080',
    SECRET_KEY: process.env.SECRET_KEY || 'secret_key',
    OUTLOOK_EMAIL: process.env.OUTLOOK_EMAIL,
    OUTLOOK_PASSWORD: process.env.OUTLOOK_PASSWORD,
    PUBLIC_DIR: path.join(process.cwd(), 'public'),
    UPLOADS_DIR: path.join(process.cwd(), 'uploads'),
    VIEWS_DIR: path.join(process.cwd(), 'src', 'views'),
  }
}
