# v5 wallet upgrade

## Index
- [Project description](#project-description)
- Web3 Secret Storage Definition
- Proposed improvements
  - Key Derivation Function (KDF)
  - Encryption Algorithm
  - RLP serialization
  - Metadata

## Project description
[Web3 Secret Storage Definition](https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition) is the standarized format Ethereum clients use to store private keys on disk. The current implementation is v3.

The objective of v5 is to extend the properties, functionalities and applications of the Web3 Secret Storage Definition with the following features:
- Improved performance on web browsers and phones
- Blockchain-agnostic wallet storage mechanism
- Multisig stored wallets
- IoT identities
- Self-sovereign user systems

## The Web3 Secret Storage Definition
Since exposing private keys is a bad practice they are encrypted with a user-provided password. In order to secure the given password a KDF or [Key Derivation Function](https://en.wikipedia.org/wiki/Key_derivation_function).

The flow to generate a v3 json is:
- User provides a privateKey and a password.
- Password is derived into a strong encryption key using kdf
- Private key is encrypted using the derived key
- The encrypted private key, configuration settings for KDF and encryption and metadata are packed.

The resulting is a JSON file of the following format

```JSON
{
    "crypto" : {
        "cipher" : "aes-128-ctr",
        "cipherparams" : {
            "iv" : "6087dab2f9fdbbfaddc31a909735c1e6"
        },
        "ciphertext" : "5318b4d5bcd28de64ee5559e671353e16f075ecae9f99c7a79a38af5f869aa46",
        "kdf" : "pbkdf2",
        "kdfparams" : {
            "c" : 262144,
            "dklen" : 32,
            "prf" : "hmac-sha256",
            "salt" : "ae3cd4e7013836a3df6bd7241b12db061dbe2c6785853cce422d148a624ce0bd"
        },
        "mac" : "517ead924a9d0dc3124507e3393d175ce3ff7c1e96529c6c555ce9e51205e9b2"
    },
    "id" : "3198bc9c-6672-5ab3-d995-4942343ae5b6",
    "version" : 3
}
```

The content can be split into 3 blocks
### KDF
- `kdf`: The Key Derivation Function to be used. v3 supports [PBKDF2](https://en.wikipedia.org/wiki/PBKDF2) and [script](https://en.wikipedia.org/wiki/Scrypt).
- `kdfparams`: Extra parameters needed to execute the KDF.

### Cipher
- `cipher`: Encryption algorithm used.
- `cipherparams`: Extra parameters needed to execute the encryption and decryption process
- `ciphertext`: Encrypted private key

### Metadata
- `mac`: Integrity verification hash composed of the derived key (partially) and the ciphertext
- `id`: UUID used by the Ethereum client to identify internally the wallet
- `version`: Version number

## Proposed improvements
The v5 standard extends the key derivation functions, encryption algorithms and encoding options available.

### JSON example of v5
```JSON
{
  "crypto": {
    "cipher": "aes-256-ctr",
    "cipherparams": {"counter": 953},
    "ciphertext": "ed3ef189a8187fd8b94380e59f520560be9e92a9efaaf0da8f4dd48c0fe601c3",
    "kdf": "argon2",
    "kdfparams": {
      "timeCost": 4,
      "memoryCost": 8192,
      "parallelism": 1,
      "type": 1,
      "salt": "ec9662e85c428162d2a95b5149d88df70947587365bb51d1153378dcab824ab1",
      "dklen": 32,
      "raw": true
    }
  },
  "version": 5,
  "checksum": "e947c6c275b5da997d9756382ba8edae224c7228425834cf4f3390c067f7700e"
}
```

### Extended Key Derivation Functions (KDF)
`PBKDF2` and `scrypt` are consuming algorithms; they require high specs to run fast. When executed on web browsers, mobile phones or IoT devices they can take a long time (almost a minute!) to derive a key. That means that each time a user wants to use their private key (sign a transaction) they will be required to wait a while to just figure it out.

Back in 2015 [`argon2`](https://github.com/p-h-c/phc-winner-argon2) won the [Password Hashing Competition](https://password-hashing.net/), an open competition inspired by the NIST's AES and SHA-3. Their objective was to establish a standard key derivation function that would fulfil the needs of modern applications on a secure way.

In the mentioned scenarios argon2 performs in under half a second, making it an obvious first choice to explore extended KDFs. The other finalists of the Password Hashing Competitions are to be explored as future additions.
- [Catena](https://www.uni-weimar.de/de/medien/professuren/mediensicherheit/research/catena/)
- [Lyra2](https://en.wikipedia.org/wiki/Lyra2)
- [Makwa](http://www.bolet.org/makwa/)
- [yescrypt](https://www.openwall.com/yescrypt/)

### Extended encryption algorithms
v3's minimally-compliant implementations must support AES-128-CTR. The CBC mode for AES has been added, allowing for multisig wallet storage.

- `CTR`: Uses an encryption key of 128, 192 or 256 bits of length and a counter (number of iterations) to generate the encrypted text.
- `CBC`: Uses an encryption key of 128, 192 or 256 bits of length and an initialization vector (IV) of 128 bits of length. Using the [Shake256](https://pycryptodome.readthedocs.io/en/latest/src/hash/shake256.html) hashing function we can use 2 given passwords as a key and an IV.

The XOR mode has been added. The exclusive OR operation is very cheap to perform on hardware directly. It is goode for IoT applications, as well as supply chain.

Future encryption algorithms to explore and implement are:
- [Salsa20](http://www.ecrypt.eu.org/stream/salsa20p3.html)
- [CryptMT](http://www.ecrypt.eu.org/stream/cryptmtp3.html)
- [Dragon ](http://www.ecrypt.eu.org/stream/dragonp3.html)
- [HC ](http://www.ecrypt.eu.org/stream/hcp3.html)
- [LEX ](http://www.ecrypt.eu.org/stream/lexp3.html)
- [NLS ](http://www.ecrypt.eu.org/stream/nlsp3.html)
- [Rabbit](http://www.ecrypt.eu.org/stream/rabbitp3.html)
- [SOSEMANUK](http://www.ecrypt.eu.org/stream/sosemanukp3.html)

### RLP serialization
JSON is a great standard format for computer applications. It is easy to interpret, disk efficient and human readable. When it comes to storing the private keys on QR codes or NFC tags the encoding becomes less efficient and often exceeds the maximum storage capacity of these methods.

The [RLP (Recursive Length Prefix)](https://github.com/ethereum/wiki/wiki/RLP) encoding and decoding mechanism has been added to ease the usage on static tags.

A layer of encoding has been added, along with lookup tables to reduce the characters needed to store a v5 wallet.

base64 : `+IuCMDK4QGNjZGU4NTFlYjk3MWE0ZjQ0YjFlMDI3ODU2NjFkZDZlNGUzZTg5MzQ5MzBmZTU5Nzc3MjkxMTFhMWNiMTEwNzZNgjAwuEA3ZTk5YzI1MjEzNThhMGMyNmQyYWU4MTliY2JjZjc4ZTBkNjg4MmRkODE2NmVmN2MwNDA4NDJiYmM5ZTEwZmNk`

hex : `f88b823032b840636364653835316562393731613466343462316530323738353636316464366534653365383933343933306665353937373732393131316131636231313037364d823030b84037653939633235323133353861306332366432616538313962636263663738653064363838326464383136366566376330343038343262626339653130666364`

QR:

![Base64](./docs/img/base64-qr.png "Base64")

### Payload
Arbitrary data can now be added and encrypted to transport user related data (username, email, ...) and their corresponding signatures. This powers our offchain p2p trust engine.

The payload is an array of `Item` objects of the following structure:
```javascript
const Item = {
  owner : '0x000000000000000000000000000000000000000a',
  issuer : '0x000000000000000000000000000000000000000b',
  data : { ... },
  hash : '0xb398f54cb8565f2e963e8c74cd9cfe760ff6fe831c2579e2a9d095e6da62e342',
  signature : '0x8b552c4cbafd630c492724b831414f79702fd90da1bf0ee3ac2fd3af69ae910a'
}
```
- `owner` : Address of the wallet the Item references.
- `issuer` : Address of the wallet to issue the Item.
- `data` : Key-value field, JSON serializable.
- `hash` : keccak256( owner ++ issuer ++ JSON.stringify(data) ).
- `signature` : Signed hash by the issuer.

### Metadata
- The `mac` field has been renamed by `checksum`.
- The `version` has been raised to 5.
- The `id` field has been removed.
