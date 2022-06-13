//@ts-check
const nodemailer = require('nodemailer')
const configService = require('../config/configService')

const OUTLOOK_EMAIL = configService.getConfig('OUTLOOK_EMAIL')
const OUTLOOK_PASSWORD = configService.getConfig('OUTLOOK_PASSWORD')

const transport = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: OUTLOOK_EMAIL,
    pass: OUTLOOK_PASSWORD,
  },
  tls: {
    ciphers: 'SSLv3',
  },
})

module.exports = transport
