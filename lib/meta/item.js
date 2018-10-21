class Item {
  constructor () {
    this.owner
    this.issuer
    this.data = {}
    this.hash
    this.signature

  }

  verify () {
    // check if hash matches data
  }

  toJSON () {

  }
}

module.exports = Item
