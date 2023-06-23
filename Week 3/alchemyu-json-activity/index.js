const axios = require('axios');

// copy-paste your URL provided in your Alchemy.com dashboard
const ALCHEMY_URL = "https://eth-sepolia.g.alchemy.com/v2/ftdzS5fp1jpLbYUlZmCU4gmkzSEVu0zK";

axios.post(ALCHEMY_URL, {
  jsonrpc: "2.0",
  id: 1,
  method: "eth_getBlockByNumber",
  params: [
    "0xb443", // block 46147
    false  // retrieve the full transaction object in transactions array
  ]
}).then((response) => {
  console.log(response.data.result);
});

axios.post(ALCHEMY_URL, {
  jsonrpc: "2.0",
  id: 1,
  method: "eth_gasPrice",
}).then((response) => {
  console.log(response.data.result);
});