require('dotenv').config()
const { sendSMS } = require('../services/smsService')

async function main() {
  const resp = await sendSMS('+919834360782', 'Hello from test')
  console.log(resp)
}
main().catch(console.log)
