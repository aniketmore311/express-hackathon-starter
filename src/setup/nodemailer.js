const nodemailer = require('nodemailer')
const configService = require('../config/configService')

const transport = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: configService.getConfig('OUTLOOK_EMAIL'),
    pass: configService.getConfig('OUTLOOK_PASSWORD'),
  },
  tls: {
    ciphers: 'SSLv3',
  },
})

module.exports = transport
