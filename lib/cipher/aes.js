const AES = require('aes-js')
const randomBytes = require('random-bytes')
// Linter complains if constructors are not capitalized
// re-assign them so it will shut the freak up

AES.ModeOfOperation.CTR = AES.ModeOfOperation.ctr
AES.ModeOfOperation.CBC = AES.ModeOfOperation.cbc
AES.ModeOfOperation.CFB = AES.ModeOfOperation.cfb
AES.ModeOfOperation.OFB = AES.ModeOfOperation.ofb

const aes = {
  bufferToArray: (buffer) => {
    if (typeof buffer === 'string') {
      buffer = Buffer.from(buffer, 'hex')
    }
    return Array.prototype.slice.call(buffer, 0)
  },

  randomInt: (max) => {
    if (!max) { max = 2 ** 10 }
    return Math.floor(Math.random() * Math.floor(max))
  },

  encrypt: {
    // ctr: (key, input, counter) => {
    ctr: (key, input, options) => {
      key = aes.bufferToArray(key)
      if (!options) { options = {} }
      if (!options.counter) { options.counter = aes.randomInt() }
      let bytes = AES.utils.hex.toBytes(input)
      let ctr = new AES.ModeOfOperation.CTR(key, new AES.Counter(options.counter))
      let encryptedBytes = ctr.encrypt(bytes)
      let encryptedHex = AES.utils.hex.fromBytes(encryptedBytes)

      return {
        cipher: encryptedHex,
        cipherparams: {
          counter: options.counter
        }
      }
    },

    cbc: (key, input, options) => {
      key = aes.bufferToArray(key)
      if (!options) { options = {} }
      if (!options.iv) { options.iv = randomBytes.sync(16) }
      options.iv = aes.bufferToArray(options.iv)

      let bytes = AES.utils.hex.toBytes(input)
      let cbc = new AES.ModeOfOperation.CBC(key, options.iv)
      let encryptedBytes = cbc.encrypt(bytes)
      let encryptedHex = AES.utils.hex.fromBytes(encryptedBytes)

      return {
        cipher: encryptedHex,
        cipherparams: {
          iv: AES.utils.hex.fromBytes(options.iv)
        }
      }
    }
  },

  decrypt: {
    // ctr: (key, input, counter) => {
    ctr: (key, input, options) => {
      key = aes.bufferToArray(key)

      if (typeof options.counter !== 'number') { options.counter = parseInt(options.counter)}
      let bytes = AES.utils.hex.toBytes(input)
      let ctr = new AES.ModeOfOperation.CTR(key, new AES.Counter(options.counter))
      let decryptedBytes = ctr.decrypt(bytes)
      let decryptedHex = AES.utils.hex.fromBytes(decryptedBytes)

      return decryptedHex
    },

    cbc: (key, input, options) => {
      key = aes.bufferToArray(key)
      if (!options) { options = {} }
      if (!options.iv) { options.iv = randomBytes.sync(16) }
      options.iv = aes.bufferToArray(options.iv)

      let bytes = AES.utils.hex.toBytes(input)
      let cbc = new AES.ModeOfOperation.CBC(key, options.iv)
      let decryptedBytes = cbc.decrypt(bytes)
      let decryptedHex = AES.utils.hex.fromBytes(decryptedBytes)

      return decryptedHex
    }
  }

}

module.exports = aes
