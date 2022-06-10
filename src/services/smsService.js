const client = require('../setup/twilio')
const configService = require('../config/configService')

const TWILIO_PHONE_NUMBER = configService.getConfig('TWILIO_PHONE_NUMBER')

function sendSMS(to, body) {
  return client.messages.create({
    body,
    from: TWILIO_PHONE_NUMBER,
    to,
  })
}

module.exports = {
  sendSMS,
}
