const axios = require('axios');
const niceList = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');

const serverUrl = 'http://localhost:1225';

/**
 * Your project this week is to build an application which gives out gifts, but only to names on the list. 
 * The catch is that on the server you are only allowed to store one 32 byte value in the server memory. 
 * This 32 byte value has to be enough for the server to be able to determine who is on the list.
 * 
 * Think of the client as the _prover_ here. It needs to prove to the server that some `name` is in the `MERKLE_ROOT` on the server. 
 * Think of the server as the _verifier_ here. It needs to verify that the `name` passed by the client is in the `MERKLE_ROOT`. If it is, then we can send the gift! 
 */
async function main() {
  // TODO: how do we prove to the server we're on the nice list? 
  const merkleTree = new MerkleTree(niceList);
  const name = 'Piticas Razvan';
  const index = niceList.findIndex(n => n === name);
  const proof = merkleTree.getProof(index);
  console.log(proof);

  const { data: gift } = await axios.post(`${serverUrl}/gift`, {
    // TODO: add request body parameters here!
    name:name,
    proof: proof
  });

  console.log({ gift });
}

main();