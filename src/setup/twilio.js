const twilio = require('twilio')
const configService = require('../config/configService')

const TWILIO_SID = configService.getConfig('TWILIO_SID')
const TWILIO_AUTH_TOKEN = configService.getConfig('TWILIO_AUTH_TOKEN')

const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN)

module.exports = client
