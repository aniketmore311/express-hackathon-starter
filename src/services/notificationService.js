const { getConfig } = require('../config/configService')
const { sendEmail } = require('./emailService')
const { sendSMS } = require('./smsService')

const SERVER_URL = getConfig('SERVER_URL')

async function sendVerificationEmail(email, code) {
  return sendEmail({
    to: email,
    subject: 'verify your email',
    text: `verify your email by clicking the link below\n ${SERVER_URL}/auth/verify_email/${email}/${code}`,
    html: `verify your email by clicking the link below\n ${SERVER_URL}/auth/verify_email/${email}/${code}`,
  })
}

async function sendVerificationSMS(phoneNumber, code) {
  return sendSMS(
    phoneNumber,
    `verify your phone number by visiting link below\n ${SERVER_URL}/auth/verify_phone/${phoneNumber}/${code}`
  )
}

module.exports = {
  sendVerificationEmail,
  sendVerificationSMS,
}
