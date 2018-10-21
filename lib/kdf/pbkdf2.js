const pbkdf2 = require('pbkdf2')
const randomBytes = require('random-bytes')

module.exports = {
  derive: (password, kdfparams, dklen) => {
    return new Promise((resolve, reject) => {
      if (typeof dklen === 'string') { dklen = Number(dklen) }
      let salt
      if (kdfparams) {
        salt = Buffer.from(kdfparams.salt, 'hex')
      } else {
        salt = randomBytes.sync(32)
        kdfparams = {
          dklen: dklen / 8,
          salt: salt.toString('hex'),
          c: 1048576,
          prf: 'hmac-sha256'
        }
      }

      pbkdf2.pbkdf2(
        Buffer.from(password),
        salt,
        kdfparams.c,
        kdfparams.dklen,
        'sha256',
        (err, res) => {
          if (err) reject(err)
          resolve({
            derivedKey: res,
            kdfparams: kdfparams
          })
        }
      )
    })
  }
}
