import server from "./server";
import { hashMessage, getPublicKey, getPublicKeyHex, signMessage, getEthAddress } from "./scripts/crypto";
import { toHex, utf8ToBytes } from 'ethereum-cryptography/utils';

/**
 * Video transcript:
 * "we need to sign [on the client side] some sort of an intention/message/transaction that would be sent to the server"
 * "then the server will recover (from that signature) the addres/public key of the person who sent this"
 * 
 * 1. User inputs a private key 
 * 2. The mothod sets the private key state so it can also be used by Transfer component
 * 3. The method recoveres the public key from the private key
 * 4. The method sets the public key to be used by Transfer component
 * 4. The method gets an ETH address from the public key (remove first byte, hash the rest, take last 20 bytes, convert to hex) 
 * 5. The method uses the ETH address to fetch the balance from the server and also shows the balance and eth address
 * 
 * @param {*} param0 
 * @returns 
 */
function Wallet({ balance, setBalance, privateKey, setPrivateKey, publicKey, setPublicKey, ethAddress, setEthAddress }) {
  async function onChange(evt) {

    const privateKey = evt.target.value;
    setPrivateKey(privateKey);

    const publicKey = getPublicKey(privateKey);
    const publicKeyHex = getPublicKeyHex(privateKey);
    setPublicKey(publicKeyHex);

    const ethAddress = getEthAddress(publicKey);
    setEthAddress(ethAddress);

    if (ethAddress) {
      const {
        data: { balance },
      } = await server.get(`balance/${ethAddress}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Type a private key to sign an intent" value={privateKey} onChange={onChange}></input>
      </label>

      <div>
        Public Key Address: {publicKey}
      </div>

      <div>
        ETH Address: {ethAddress}
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;

