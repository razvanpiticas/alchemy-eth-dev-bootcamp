const {keccak256} = require("ethereum-cryptography/keccak");
const secp = require("ethereum-cryptography/secp256k1");
const {toHex, utf8ToBytes} = require("ethereum-cryptography/utils");

/**
 * The method changed from 1.7 to 2.0, it now can be found on the signature object returned by sign() method 
 * See more details here https://github.com/ethereum/js-ethereum-cryptography#upgrading
 * @param {*} message 
 * @param {*} signature 
 * @returns 
 */
exports.recoverKey = (message, signature) => {
    const bytes = utf8ToBytes(message);
    const msgHash = keccak256(bytes);

    return signature.recoverPublicKey(msgHash).toHex();
}

exports.getEthAddress = (publicKey) => {
    
    const publicKeyNoFormat = publicKey.slice(1);                   // The first byte indicates the format of the key, so we skip it
    const hashedPublicKeyNoFormat = keccak256(publicKeyNoFormat);   // hash it
    const address = hashedPublicKeyNoFormat.slice(-20)              // take the last 20 bytes

    return toHex(address);
}