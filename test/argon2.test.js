/* eslint-disable */
let chai = require('chai')
let expect = chai.expect

let wallet = require('ethereumjs-wallet')
let util = require('ethereumjs-util')

const V5 = require('../index')
const parser = V5.parser
const kdf = V5.kdf

let defaultWallet

let v5, encoded

let password = 'password'

describe ('Tests kdf:argon2 and cipher:AES-128-CTR', () => {
  before (() => {
    defaultWallet = wallet.generate()
  })

  it ('Should export the wallet', (done) => {
    parser.export(defaultWallet.getPrivateKeyString(), password, {
      cipher: 'aes-128-ctr',
      kdf: 'argon2'
    })
    .then(_v5 => {
      v5 = _v5
      done()
    })
    .catch(done)
  })

  /*
  it ('Should encode the exported wallet to RLP', () => {
    encoded = parser.RLPEncode(v5)
    expect(encoded).to.be.instanceOf(Buffer)
    expect(encoded.length).to.be.gt(0)
  })
  */

  it ('Should import the wallet', (done) => {
    parser.import(v5, password)
    .then(privateKey => {
      expect('0x' + privateKey).to.equal(defaultWallet.getPrivateKeyString())
      done()
    })
    .catch(done)
  })

  /*
  it ('Should decode and import the exported wallet', (done) => {
    let decoded = parser.RLPDecode(encoded)
    expect(decoded).to.be.a('string')
    expect(JSON.parse(decoded).checksum).to.equal(JSON.parse(v5).checksum)

    parser.import(decoded, password)
    .then(privateKey => {
      expect('0x' + privateKey).to.equal(defaultWallet.getPrivateKeyString())
      done()
    })
    .catch(done)
  })
  */

})


describe ('Tests kdf:argon2 and cipher:AES-192-CTR', () => {
  before (() => {
    defaultWallet = wallet.generate()
  })

  it ('Should export the wallet', done => {
    parser.export(defaultWallet.getPrivateKeyString(), password, {
      cipher: 'aes-192-ctr',
      kdf: 'argon2'
    })
    .then(_v5 => {
      v5 = _v5
      done()
    })
    .catch(done)
  })

  /*
  it ('Should encode the exported wallet to RLP', () => {
    encoded = parser.RLPEncode(v5)
    expect(encoded).to.be.instanceOf(Buffer)
    expect(encoded.length).to.be.gt(0)
  })
  */

  it ('Should import the wallet', (done) => {
    parser.import(v5, password)
    .then(privateKey => {
      expect('0x' + privateKey).to.equal(defaultWallet.getPrivateKeyString())
      done()
    })
    .catch(done)
  })

  /*
  it ('Should decode and import the exported wallet', (done) => {
    let decoded = parser.RLPDecode(encoded)
    expect(decoded).to.be.a('string')
    expect(JSON.parse(decoded).checksum).to.equal(JSON.parse(v5).checksum)

    parser.import(decoded, password)
    .then(privateKey => {
      expect('0x' + privateKey).to.equal(defaultWallet.getPrivateKeyString())
      done()
    })
    .catch(done)
  })
  */
})

describe ('Tests kdf:argon2 and cipher:AES-256-CTR', () => {
  before (() => {
    defaultWallet = wallet.generate()
  })

  it ('Should export the wallet', done => {
    parser.export(defaultWallet.getPrivateKeyString(), password, {
      cipher: 'aes-256-ctr',
      kdf: 'argon2'
    })
    .then(_v5 => {
      v5 = _v5
      done()
    })
    .catch(done)
  })

  /*
  it ('Should encode the exported wallet to RLP', () => {
    encoded = parser.RLPEncode(v5)
    expect(encoded).to.be.instanceOf(Buffer)
    expect(encoded.length).to.be.gt(0)
  })
  */

  it ('Should import the wallet', (done) => {
    parser.import(v5, password)
    .then(privateKey => {
      expect('0x' + privateKey).to.equal(defaultWallet.getPrivateKeyString())
      done()
    })
    .catch(done)
  })

  /*
  it ('Should decode and import the exported wallet', (done) => {
    let decoded = parser.RLPDecode(encoded)
    expect(decoded).to.be.a('string')
    expect(JSON.parse(decoded).checksum).to.equal(JSON.parse(v5).checksum)

    parser.import(decoded, password)
    .then(privateKey => {
      expect('0x' + privateKey).to.equal(defaultWallet.getPrivateKeyString())
      done()
    })
    .catch(done)
  })
  */

})


describe ('Tests kdf:argon2 and cipher:AES-128-CBC', () => {
  before (() => {
    defaultWallet = wallet.generate()
  })

  it ('Should export the wallet', done => {
    parser.export(defaultWallet.getPrivateKeyString(), password, {
      cipher: 'aes-128-cbc',
      kdf: 'argon2'
    })
    .then(_v5 => {
      v5 = _v5
      let encoded = parser.RLPEncode(v5)
      expect(encoded).to.be.instanceOf(Buffer)
      expect(encoded.length).to.be.gt(0)
      done()
    })
    .catch(done)
  })

  /*
  it ('Should encode the exported wallet to RLP', () => {
    encoded = parser.RLPEncode(v5)
    expect(encoded).to.be.instanceOf(Buffer)
    expect(encoded.length).to.be.gt(0)
  })
  */

  it ('Should import the wallet', (done) => {
    parser.import(v5, password)
    .then(privateKey => {
      expect('0x' + privateKey).to.equal(defaultWallet.getPrivateKeyString())
      done()
    })
  })

  /*
  it ('Should decode and import the exported wallet', (done) => {
    let decoded = parser.RLPDecode(encoded)
    expect(decoded).to.be.a('string')
    expect(JSON.parse(decoded).checksum).to.equal(JSON.parse(v5).checksum)

    parser.import(decoded, password)
    .then(privateKey => {
      expect('0x' + privateKey).to.equal(defaultWallet.getPrivateKeyString())
      done()
    })
    .catch(done)
  })
  */
})


describe ('Tests kdf:argon2 and cipher:AES-192-CBC', () => {
  before (() => {
    defaultWallet = wallet.generate()
  })

  it ('Should export the wallet', done => {
    parser.export(defaultWallet.getPrivateKeyString(), password, {
      cipher: 'aes-192-cbc',
      kdf: 'argon2'
    })
    .then(_v5 => {
      v5 = _v5
      let encoded = parser.RLPEncode(v5)
      expect(encoded).to.be.instanceOf(Buffer)
      expect(encoded.length).to.be.gt(0)
      done()
    })
    .catch(done)
  })

  /*
  it ('Should encode the exported wallet to RLP', () => {
    encoded = parser.RLPEncode(v5)
    expect(encoded).to.be.instanceOf(Buffer)
    expect(encoded.length).to.be.gt(0)
  })
  */

  it ('Should import the wallet', (done) => {
    parser.import(v5, password)
    .then(privateKey => {
      expect('0x' + privateKey).to.equal(defaultWallet.getPrivateKeyString())
      done()
    })
  })

  /*
  it ('Should decode and import the exported wallet', (done) => {
    let decoded = parser.RLPDecode(encoded)
    expect(decoded).to.be.a('string')
    expect(JSON.parse(decoded).checksum).to.equal(JSON.parse(v5).checksum)

    parser.import(decoded, password)
    .then(privateKey => {
      expect('0x' + privateKey).to.equal(defaultWallet.getPrivateKeyString())
      done()
    })
    .catch(done)
  })
  */

})


describe ('Tests kdf:argon2 and cipher:AES-256-CBC', () => {
  before (() => {
    defaultWallet = wallet.generate()
  })

  it ('Should export the wallet', done => {
    parser.export(defaultWallet.getPrivateKeyString(), password, {
      cipher: 'aes-256-cbc',
      kdf: 'argon2'
    })
    .then(_v5 => {
      v5 = _v5
      let encoded = parser.RLPEncode(v5)
      expect(encoded).to.be.instanceOf(Buffer)
      expect(encoded.length).to.be.gt(0)
      done()
    })
    .catch(done)
  })

  /*
  it ('Should encode the exported wallet to RLP', () => {
    encoded = parser.RLPEncode(v5)
    expect(encoded).to.be.instanceOf(Buffer)
    expect(encoded.length).to.be.gt(0)
  })
  */

  it ('Should import the wallet', (done) => {
    parser.import(v5, password)
    .then(privateKey => {
      expect('0x' + privateKey).to.equal(defaultWallet.getPrivateKeyString())
      done()
    })
  })

  /*
  it ('Should decode and import the exported wallet', (done) => {
    let decoded = parser.RLPDecode(encoded)
    expect(decoded).to.be.a('string')
    expect(JSON.parse(decoded).checksum).to.equal(JSON.parse(v5).checksum)

    parser.import(decoded, password)
    .then(privateKey => {
      expect('0x' + privateKey).to.equal(defaultWallet.getPrivateKeyString())
      done()
    })
    .catch(done)
  })
  */

})



describe ('Tests kdf:argon2 and cipher:XOR', () => {
  before (() => {
    defaultWallet = wallet.generate()
  })


  it ('Should export the wallet', done => {
    parser.export(defaultWallet.getPrivateKeyString(), password, {
      cipher: 'xor',
      kdf: 'argon2'
    })
    .then(_v5 => {
      v5 = _v5
      let encoded = parser.RLPEncode(v5)
      expect(encoded).to.be.instanceOf(Buffer)
      expect(encoded.length).to.be.gt(0)
      done()
    })
    .catch(done)
  })

  /*
  it ('Should encode the exported wallet to RLP', () => {
    encoded = parser.RLPEncode(v5)
    expect(encoded).to.be.instanceOf(Buffer)
    expect(encoded.length).to.be.gt(0)
  })
  */

  it ('Should import the wallet', (done) => {
    parser.import(v5, password)
    .then(privateKey => {
      expect('0x' + privateKey).to.equal(defaultWallet.getPrivateKeyString())
      done()
    })
  })

  /*
  it ('Should decode and import the exported wallet', (done) => {
    let decoded = parser.RLPDecode(encoded)
    expect(decoded).to.be.a('string')
    expect(JSON.parse(decoded).checksum).to.equal(JSON.parse(v5).checksum)

    parser.import(decoded, password)
    .then(privateKey => {
      expect('0x' + privateKey).to.equal(defaultWallet.getPrivateKeyString())
      done()
    })
    .catch(done)
  })
  */
})
