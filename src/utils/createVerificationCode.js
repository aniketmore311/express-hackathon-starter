const crypto = require('crypto')

module.exports = function(){
    const code = crypto.randomBytes(8).toString('hex');
    return code;
}