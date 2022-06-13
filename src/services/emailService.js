//@ts-check
const configService = require('../config/configService')
const transport = require('../setup/nodemailer')

const OUTLOOK_EMAIL = configService.getConfig('OUTLOOK_EMAIL')

async function sendEmail({ to, subject, text, html }) {
  const from = `sender <${OUTLOOK_EMAIL}>`
  return transport.sendMail({ from, to, subject, text, html })
}

module.exports = {
  sendEmail,
}
