const RLP = require('rlp')

const cipherLookup = {
  'aes-128-ctr' : '00',
  'aes-192-ctr' : '01',
  'aes-256-ctr' : '02',
  'aes-128-cbc' : '03',
  'aes-192-cbc' : '04',
  'aes-256-cbc' : '05',
  'xor' : '06',
}
/*
const cipherParamsLookup = {
  '00' : 'aes-128-ctr',
  '01' : 'aes-192-ctr',
  '02' : 'aes-256-ctr',
  '03' : 'aes-128-cbc',
  '04' : 'aes-192-cbc',
  '05' : 'aes-256-cbc',
  '06' : 'xor',
}
*/
const reverseCipherLookup = {
  '00' : 'aes-128-ctr',
  '01' : 'aes-192-ctr',
  '02' : 'aes-256-ctr',
  '03' : 'aes-128-cbc',
  '04' : 'aes-192-cbc',
  '05' : 'aes-256-cbc',
  '06' : 'xor',
}

const kdfLookup = {
  'argon2' : '00',
  'scrypt' : '01',
  'pbkdf2' : '02'
}

const reverseKdfLookup = {
  '00' : 'argon2',
  '01' : 'scrypt',
  '02' : 'pbkdf2'
}

const kdfParamsLookup = {
  '00' : {
    timeCost: 4,
    memoryCost: 8192,
    parallelism: 1,
    type: 1,
    dklen: 32,
    raw: true
  },
  '01' : {
    dklen : 32,
    n : 262144,
    r : 1,
    p : 8
  },
  '02' : {
    dklen : 32,
    c : 1048576,
    prf : 'hmac-sha256'
  }
}


module.exports.RLPEncode = (json) => {
  if (typeof json === 'string') { json = JSON.parse(json) }
  let nested = []

  // first we include the cipher
  nested.push(cipherLookup[json.crypto.cipher])

  // then the ciphertext
  nested.push(json.crypto.ciphertext)

  // then the cipherparams (aes ctr just the counter)
  nested.push(json.crypto.cipherparams.counter)

  // then the kdf
  nested.push(kdfLookup[json.crypto.kdf])

  // then kdfparams
  //nested.push(kdfParamsLookup[kdfLookup[json.crypto.kdf]])

  // then checksum
  nested.push(json.checksum)
  let encoded = RLP.encode(nested)
  return encoded
}

module.exports.RLPDecode = (buffer) => {
  if (!Buffer.isBuffer(buffer)){ buffer = Buffer.from(buffer, 'base64') }
  let array = RLP.decode(buffer)

  let cipher = reverseCipherLookup[array[0]]
  let ciphertext = array[1]
  let cipherparams = {counter : array[2]}
  let kdf = reverseKdfLookup[array[3]]
  let kdfparams = kdfParamsLookup[array[3]]
  let checksum = array[4]

  return {
    cipher,ciphertext, cipherparams, kdf, kdfparams, checksum
  }

}
