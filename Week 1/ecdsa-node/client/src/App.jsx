import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  // here we create some state variables to be shared across the "Wallet" & "Transfer" child components
  const [balance, setBalance] = useState(0);
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [ethAddress, setEthAddress] = useState("");
  
  
  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
        publicKey={publicKey}
        setPublicKey={setPublicKey} // the person sending the funds to the recipient sets the address state
        ethAddress={ethAddress}
        setEthAddress={setEthAddress} 
      />
      <Transfer setBalance={setBalance} address={publicKey} privateKey={privateKey} />
    </div>
  );
}

export default App;
