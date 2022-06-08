//@ts-check
const transport = require('../setup/nodemailer')

async function sendEmail({ from, to, subject, text, html }) {
  return transport.sendMail({ from, to, subject, text, html })
}

module.exports = {
    sendEmail
}
