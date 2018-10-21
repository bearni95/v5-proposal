const kdf = require('./kdf/_index')
const cipher = require('./cipher/_index')
const meta = require('./meta/_index')



const ethUtil = require('ethereumjs-util')
const ethWallet = require('ethereumjs-wallet')

class Parser {

  RLPEncode (json) {
    return meta.rlp.RLPEncode(json)
  }

  RLPDecode (buffer) {
    return meta.rlp.RLPDecode(buffer)
  }
  getChecksum (derivedKey, ciphertext) {
    let dk = derivedKey.toString('hex').split('')
    let dkPortion = dk.slice(dk.length - 17, dk.length - 1)
    let mac = ethUtil.keccak256(dkPortion + ciphertext)
    return mac.toString('hex')
  }

  getCipherParts (_cipher) {
    if (_cipher.indexOf('aes') >= 0) {
      let cipherParts = _cipher.split('-')
      return {
        algorithm: cipherParts[0],
        dklen: Number(cipherParts[1]),
        mode: cipherParts[2]
      }
    }

    if (_cipher === 'xor') {
      return {
        algorithm: 'xor',
        dklen: 256,
        mode: 'xor'
      }
    }
  }

  deriveKey (password, options, dklen) {
    let _kdf = options.kdf
    let kdfparams = options.kdfparams

    return kdf[_kdf].derive(password, kdfparams, dklen)
  }

  encrypt (derivedKey, privateKey, _cipher, cipherParams) {
    if (_cipher === 'xor') {
      return cipher.xor.encrypt(derivedKey, privateKey, cipherParams)
    }

    let aesParts = _cipher.split('-')
    let aesMode = aesParts[aesParts.length - 1]
    return cipher.aes.encrypt[aesMode](derivedKey, privateKey, cipherParams)
  }

  decrypt (derivedKey, ciphertext, _cipher, cipherParams) {
    if (_cipher === 'xor') {
      return cipher.xor.decrypt(derivedKey, ciphertext, cipherParams)
    }

    let aesParts = _cipher.split('-')
    let aesMode = aesParts[aesParts.length - 1]
    return cipher.aes.decrypt[aesMode](derivedKey, ciphertext, cipherParams)
  }

  pack (options) {
    let cipher = options.cipher
    let cipherparams = options.cipherparams
    let ciphertext = options.ciphertext
    let derivedKey = options.derivedKey
    let kdf = options.kdf
    let kdfparams = options.kdfparams
    let identity = options.identity
    let checksum = parser.getChecksum(derivedKey, ciphertext)

    let wallet = {
      crypto: {},
      version: 5
    }

    if (cipher) { wallet.crypto['cipher'] = cipher }

    if (cipherparams) { wallet.crypto['cipherparams'] = cipherparams }

    if (ciphertext) { wallet.crypto['ciphertext'] = ciphertext }

    // if (derivedKey) { wallet.crypto['derivedKey'] = derivedKey }

    if (kdf) { wallet.crypto['kdf'] = kdf }

    if (kdfparams) { wallet.crypto['kdfparams'] = kdfparams }

    if (identity) { wallet.crypto['identity'] = identity.cipher }

    if (checksum) { wallet['checksum'] = checksum }

    return JSON.stringify(wallet)
  }

  import (exported, password) {
    let self = this

    return new Promise((resolve, reject) => {
      try {
        let derived
        if (typeof exported === 'string') { exported = JSON.parse(exported) }
        if (exported.crypto.kdf === 'magdalene') {
          return resolve(exported.crypto.ciphertext)
        }
        self.deriveKey(password, exported.crypto)
          .then(_derived => {
            derived = _derived

            let raw = self.decrypt(derived.derivedKey, exported.crypto.ciphertext, exported.crypto.cipher, exported.crypto.cipherparams)

            if (exported.crypto.identity) {
              let identity = self.decrypt(derived.derivedKey, exported.crypto.identity, exported.crypto.cipher, exported.crypto.cipherparams)

              return resolve({
                privateKey: raw,
                address: identity
              })
            }

            let checksum = self.getChecksum(derived.derivedKey, exported.crypto.ciphertext)


            if (checksum !== exported.checksum) {
              return reject('MAC integrity failed')
            }

            resolve(raw)
          })
      } catch (e) {
        reject(e)
      }
    })
  }

  updateV3(v3, password, options) {


    let privateKey = ethWallet.fromV3(v3, password).getPrivateKeyString()

    if (!options) {
      //let obj = JSON.parse(v3)
      options = { kdf : v3.crypto.kdf, cipher : v3.crypto.cipher}
    }

    return this.export(privateKey, password, options)
  }

  cleanPrivateKey (pk) {
    let arr = pk.split('')
    if (arr[0] === '0' && arr[1] === 'x') {
      arr = arr.slice(2, arr.length)
    }

    return arr.join('')
  }

  export (privateKey, password, options) {
    let self = this

    return new Promise((resolve, reject) => {
      privateKey = self.cleanPrivateKey(privateKey)

      if (options.kdf === 'magdalene') {
        return resolve(self.pack({
          cipher: '',
          cipherparams: {},
          ciphertext: privateKey,
          derivedKey: '',
          kdf: options.kdf,
          kdfparams: {}
        }))
      }

      let derived
      let cipherParts = self.getCipherParts(options.cipher)

      self.deriveKey(password, options, cipherParts.dklen)
        .then(_derived => {
          derived = _derived

          let encrypted = self.encrypt(derived.derivedKey, privateKey, options.cipher, options.cipherparams)
          let checksum = self.getChecksum(derived.derivedKey, encrypted.cipher)

          let identity

          if (options.identity) {
            options.identity = self.cleanPrivateKey(options.identity)
            identity = self.encrypt(derived.derivedKey, options.identity, options.cipher, encrypted.cipherparams)
          }

          resolve(self.pack({
            checksum : checksum,
            cipher: options.cipher,
            cipherparams: encrypted.cipherparams,
            ciphertext: encrypted.cipher,
            derivedKey: derived.derivedKey,
            kdf: options.kdf,
            kdfparams: derived.kdfparams,
            identity: identity
          }))
        })
        .catch(reject)
    })
  }
}

let parser = new Parser()
module.exports = parser
