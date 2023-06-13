import { useState } from "react";
import server from "./server";
import { hashMessage, getPublicKey, signMessage, getEthAddress } from "./scripts/crypto";
import { toHex, utf8ToBytes } from 'ethereum-cryptography/utils';

function Transfer({ setBalance, address, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);


/**
 * Video transcript:
 * "we need to sign [on the client side] some sort of an intention/message/transaction that would be sent to the server"
 * "then the server will recover (from that signature) the addres/public key of the person who sent this"
 * "The transfer function is going to take the private key eventually and is going to use it to generate a signed transaction / a signature 
 * so that way the server can then take that signature and get the public address from it"
 * 
 * 1. User inputs the send amount
 * 2. User inputs the recipient address
 *    *At this point I have the private key, the sender address, the send amount and the recipient address
 * 3. The method uses the private key of the sender to sign an intent message (hash(senderAddress_sendAmount_recipientAddress))
 * 4. Then, the method sends the: "signature", "intentMessageHash", "senderPublicKey", "sendAmount" and the "recipient" address.
 *    
 *  *The server will then recover the sender's address from the signature, basically authenticating the user!
 *  *(only the owner of the private key counter part to the recovered public key could have signed that message) 
 *  ** the logic is a bit different due to js-ethereum-cryptography update -> see /send endpoint's comments
 * @param {*} evt 
 */
  async function transfer(evt) { 

    evt.preventDefault();

    try {
      console.log("private key: " + privateKey)
      console.log("public key address: " + address)
      console.log("sendAmount: " + sendAmount)
      console.log("recipient: " + recipient)

      const intentMessage = address + "_" + sendAmount + "_" + recipient;
      const intentMessageHash = toHex(hashMessage(intentMessage));
      console.log("intent hex: " + intentMessageHash);

      const signature = signMessage(intentMessageHash, privateKey); // also hashes msg before signing
      console.log("signature: " + signature.s)

      const jsonSignature = JSON.stringify(signature, (key, value) =>
        typeof value === 'bigint'
            ? value.toString()
            : value // return everything else unchanged
          );

      const {
        data: { balance },
      } = await server.post(`send`, {
        signature: jsonSignature,
        senderPublicKey: address,
        intentMessageHash: intentMessageHash,
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      console.log(ex);
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
