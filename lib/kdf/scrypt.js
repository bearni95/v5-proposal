const scrypt = require('scryptsy')
const randomBytes = require('random-bytes')

module.exports = {
  derive: (password, kdfparams, dklen) => {
    return new Promise((resolve, reject) => {
      if (typeof dklen === 'string') { dklen = Number(dklen) }
      if (kdfparams === undefined) {
        kdfparams = {
          dklen: dklen / 8,
          n: 262144,
          r: 1,
          p: 8,
          salt: randomBytes.sync(32)
        }
      } else {
        kdfparams['salt'] = Buffer.from(kdfparams['salt'], 'hex')
      }

      let derivedKey = scrypt(
        password,
        kdfparams.salt,
        kdfparams.n,
        kdfparams.r,
        kdfparams.p,
        kdfparams.dklen
      )
      kdfparams.salt = kdfparams.salt.toString('hex')

      resolve({
        derivedKey: derivedKey,
        kdfparams: kdfparams
      })
    })
  }
}
