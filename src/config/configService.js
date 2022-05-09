//@ts-check
const configFactory = require('./configFactory')

const config = configFactory()

/**
 * @param {string=} key
 * @returns {any} value of config key
 */
function getConfig(key) {
  if (!key) {
    return config
  } else {
    const value = config[key]
    if (!value) {
      throw new Error(`config key ${key} not found`)
    } else {
      return value
    }
  }
}

const configService = {
  getConfig,
}

module.exports = configService
