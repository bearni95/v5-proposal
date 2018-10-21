class XOR {
  encrypt (key, input, options) {
    if (!Buffer.isBuffer(key)) {
      key = Buffer.from(key, 'hex')
    }

    if (!Buffer.isBuffer(input)) {
      input = Buffer.from(input, 'hex')
    }

    if (key.length !== input.length) {
      throw new Error('Key and input length must be equal')
    }

    return {
      cipher: this.buffer(key, input).toString('hex'),
      cipherparams: {}
    }
  }

  decrypt (key, input, options) {
    if (!Buffer.isBuffer(key)) {
      key = Buffer.from(key, 'hex')
    }

    if (!Buffer.isBuffer(input)) {
      input = Buffer.from(input, 'hex')
    }

    if (key.length !== input.length) {
      throw new Error('Key and input length must be equal')
    }

    return this.buffer(key, input).toString('hex')
  }

  bufferToArray (buffer) {
    if (typeof buffer === 'string') {
      buffer = Buffer.from(buffer, 'hex')
    }
    return Array.prototype.slice.call(buffer, 0)
  }

  buffer (a, b) {
    let out = []
    let xa = this.bufferToArray(a)
    let xb = this.bufferToArray(b)
    let short

    if (xa.length >= xb.lenght) {
      short = xb.length
    } else {
      short = xa.length
    }

    for (var i = 0; i < short; i++) {
      out.push(xa[i] ^ xb[i])
    }

    return Buffer.from(out, 'hex')
  }
}

const xor = new XOR()
module.exports = xor
