//@ts-check
/**
 *
 * @returns {{[key:string]:any}}
 */
module.exports = function () {
  return {
    PORT: process.env.PORT || 8080,
    NODE_ENV: process.env.NODE_ENV || 'development',
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/test',
    SECRET_KEY: process.env.SECRET_KEY || 'secret_key',
  }
}
