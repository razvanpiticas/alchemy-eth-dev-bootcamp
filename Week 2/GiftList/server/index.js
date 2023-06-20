const express = require('express');
const verifyProof = require('../utils/verifyProof');

const port = 1225;

const app = express();
app.use(express.json());

// TODO: hardcode a merkle root here representing the whole nice list
// paste the hex string in here, without the 0x prefix
const MERKLE_ROOT = 'd8c256ed2fb19db8dc87d0b7e0f80dfa4be9875685866ae155762b347d4009c5';

app.post('/gift', (req, res) => {
  // grab the parameters from the front-end here
  const body = req.body;

  const name = body.name;
  const proof = body.proof;

  // TODO: prove that a name is in the list 
  let isInTheList = false;
  if(verifyProof(proof, name, MERKLE_ROOT)){
    isInTheList = true;
  }
  if(isInTheList) {
    res.send("You got a toy robot!");
  }
  else {
    res.send("You are not on the list :(");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
