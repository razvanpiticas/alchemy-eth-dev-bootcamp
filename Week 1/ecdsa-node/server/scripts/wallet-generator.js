const secp = require("ethereum-cryptography/secp256k1");
const {toHex} = require("ethereum-cryptography/utils");
const {keccak256} = require("ethereum-cryptography/keccak");

const privateKey = secp.secp256k1.utils.randomPrivateKey();
const publicKey = secp.secp256k1.getPublicKey(privateKey);
console.log('private key:', toHex(privateKey));
console.log('public key:', toHex(publicKey));
console.log('address:', getAddress(publicKey));

/**
 * Ethereum address format is the last 20 bytes from a keccak256 hash of the public key.
 *    - remove first byte (1st byte idicates if this is compressed form or not)
 *    - hash the public key 
 *    - get last 20 bytes from the hash
 * 
 * @param {*} publicKey 
 * @returns 
 */
function getAddressBytes(publicKey){
    return keccak256(publicKey.slice(1)).slice(-20); 
}

function getAddress(publicKey){
    let bytes = getAddressBytes(publicKey);
    return toHex(bytes); 
}

