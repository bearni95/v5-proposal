const argon2 = require('argon2')
const randomBytes = require('random-bytes')

module.exports = {
  derive: (password, kdfparams, dklen) => {
    return new Promise((resolve, reject) => {
      if (kdfparams === undefined) {
        kdfparams = {
          timeCost: 4,
          memoryCost: 2 ** 13,
          parallelism: 1,
          type: argon2.argon2i,
          salt: randomBytes.sync(32),
          dklen: dklen / 8
        }
      } else {
        kdfparams['salt'] = Buffer.from(kdfparams['salt'], 'hex')
      }

      kdfparams['hashLength'] = kdfparams['dklen']
      kdfparams['raw'] = true

      argon2.hash(password, kdfparams)
        .then(derivedKey => {
          kdfparams.salt = kdfparams.salt.toString('hex')
          delete kdfparams.hashLength
          resolve({
            derivedKey: derivedKey,
            kdfparams: kdfparams
          })
        })
        .catch(reject)
    })
  }
}
