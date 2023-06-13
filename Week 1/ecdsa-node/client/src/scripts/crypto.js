import { keccak256 } from 'ethereum-cryptography/keccak';
import * as secp from 'ethereum-cryptography/secp256k1';
import { toHex, utf8ToBytes } from 'ethereum-cryptography/utils';

function hashMessage(message) {
    const bytes = utf8ToBytes(message);
    const hash = keccak256(bytes);
  
    return hash;
}

  
function getPublicKey(privateKey){
    return secp.secp256k1.getPublicKey(privateKey);
}

function getPublicKeyHex(privateKey){
    return toHex(secp.secp256k1.getPublicKey(privateKey));
}

/**
 * The method changed from 1.7 to 2.0, it now returns a signature object (no need to sepcify the recovery part) 
 * See more details here https://github.com/ethereum/js-ethereum-cryptography#upgrading
 * @param {*} message 
 * @param {*} privateKey 
 * @returns 
 */
function signRawMessage(message, privateKey) {
    const msgHash = hashMessage(message);
    const signature = secp.secp256k1.sign(toHex(msgHash), privateKey);
    //console.log(recoverKey(message, signature));

    return signature;
}

function signMessage(msgHash, privateKey) {
    const signature = secp.secp256k1.sign(msgHash, privateKey);
    //console.log(recoverKey(message, signature));

    return signature;
}

/**
 * The method changed from 1.7 to 2.0, it now can be found on the signature object returned by sign() method 
 * See more details here https://github.com/ethereum/js-ethereum-cryptography#upgrading
 * @param {*} message 
 * @param {*} signature 
 * @returns 
 */
function recoverKey(message, signature) {
    const msgHash = hashMessage(message);

    return signature.recoverPublicKey(msgHash).toHex();
}

/**
 * Ethereum address format is the last 20 bytes from a keccak256 hash of the public key.
 * @param {*} publicKey 
 * @returns 
 */
function getEthAddressBytes(publicKey) {
    
    console.log(publicKey);

    const publicKeyNoFormat = publicKey.slice(1);                   // The first byte indicates the format of the key, so we skip it
    const hashedPublicKeyNoFormat = keccak256(publicKeyNoFormat);   // hash it
    const address = hashedPublicKeyNoFormat.slice(-20)              // take the last 20 bytes

    console.log(address);

    return address;
}

function getEthAddress(publicKey) {
    
    const bytes = getEthAddressBytes(publicKey)

    return toHex(bytes);
}

export { hashMessage, getPublicKey, getPublicKeyHex, signMessage, recoverKey, getEthAddress }