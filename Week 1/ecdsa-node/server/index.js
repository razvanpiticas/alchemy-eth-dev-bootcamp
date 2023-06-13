const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const { secp256k1 } = require('ethereum-cryptography/secp256k1');
const { toHex, utf8ToBytes, hexToBytes } = require('ethereum-cryptography/utils');
const { keccak256 } = require('ethereum-cryptography/keccak');
const {getEthAddress} = require("./scripts/crypto.js");

app.use(cors());
app.use(express.json());

const balances = {
  //private key: ba36d384ae8863f0b4d7790111dda605cdc59a1fb3d950de4f40f5dc40937977
  //public key: 0253b7899a03db298bcd1e809b86d08bf4f23a2420bc572da5fb158101327070ac
  "07ac3f9c215bfb7555fe3d0901072ef62a522d70": 100,
  //private key: df9358907510f0e301bc9c9a775f2da596e42e6b5556bcf22c6d8ab1992adc0d
  //public key: 035f076f8ccb6da54e3d8373f28a9628cf486e165d9518a4876780fa9cfdb6f927
  "f6b1e756ed12434102f820781a9be57f479e22c1": 50,
  //private key: 9902c0e8a8a1a5748e2b91ab46e6ad6fc983a0f9195abb73af62d25321358977
  //public key: 02d939683315e1346794063e7fd90c2b0720c28c3d9cf34809ad0350c2229c5aea
  "e8f082b31bb7e06172ef250d2a1972ba1444b829": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

/**
 * Video transcript:
 * "get a signature from the client"
 * "get the sender's address from the signature - Don't allow the sender to be sent through the request"
 * 
 * Receive from the client:
 *    - signature
 *    - senderPublicKey
 *    - intentMessageHash
 *    - amount (optional)
 *    - recipient (optional)
 * 
 * In js-ethereum-cryptography 2.0 I can check if the PublicKey sent from the client matches the one in the signature
 * This way I can authenticate that whoever signed the message of the public key had the private key to sign it.
 * For this I also need the exact intentMessage used in the signature
 */
app.post("/send", (req, res) => {

  const { signature, senderPublicKey, intentMessageHash, amount, recipient } = req.body;
  let sig = JSON.parse(signature);

  console.log(signature);
  console.log("public key address: " + senderPublicKey);
  console.log("sendAmount: " + amount)
  console.log("recipient: " + recipient)
  console.log("intent hex: " + intentMessageHash);

  // since I sent the signature from the client to the server as json, it has lost it's recoverPublicKey method
  // instead of recovering the public address from the signature, I'm going to use secp256k1's "verify" method 
  // to check if the signature's public key matches the one sent from the client as such:

  sig.r = BigInt(sig.r);
	sig.s = BigInt(sig.s);
	if (!secp256k1.verify(sig, intentMessageHash, senderPublicKey)) {
    res.status(400).send({ message: "Invalid transaction" });
  }
  
  const pubKeyBytes = hexToBytes(senderPublicKey)
	const sender = getEthAddress(pubKeyBytes);
  console.log("sender: " + sender);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

