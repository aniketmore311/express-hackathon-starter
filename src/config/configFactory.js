//@ts-check
const path = require('path')

function configFactory() {
  const config = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV || 'development',
    MONGO_URI: process.env.MONGO_URI,
    SERVER_URL: process.env.SERVER_URL,
    SECRET_KEY: process.env.SECRET_KEY,
    OUTLOOK_EMAIL: process.env.OUTLOOK_EMAIL,
    OUTLOOK_PASSWORD: process.env.OUTLOOK_PASSWORD,
    TWILIO_SID: process.env.TWILIO_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
    //directories
    PUBLIC_DIR: path.join(process.cwd(), 'public'),
    UPLOADS_DIR: path.join(process.cwd(), 'uploads'),
    VIEWS_DIR: path.join(process.cwd(), 'src', 'views'),
    SEND_EMAIL: false,
    SEND_SMS: false,
  }
  for (let key in config) {
    if (config[key] === undefined) {
      throw new Error(`config property ${key} is not defined`)
    } else if (config[key] === null) {
      throw new Error(`config property ${key} is null`)
    }
  }
  return config
}

module.exports = configFactory
