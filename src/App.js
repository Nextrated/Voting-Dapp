import "./App.css";
import { Box } from "@chakra-ui/react";
import Header from "./components/Header";
import Banner from "./components/banner";
import Dashboard from "./pages/dashboard";
import Chairman from "./pages/Chairman";
import SetVotingAndTime from "./pages/SetVotingAndTime";
import Home from "./pages/home";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ethers } from "ethers";
import abi from "./contracts/abi.json"
import contractAddress from "./contracts/contract_address.json"


function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isStakeholder, setIsStakeholder] = useState(false);
  const [isVoteCordinator, setIsVoteCordinator] = useState(false);
  

  // checks if a wallet is connected
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Please install metamask extension");
        window.open("https://metamask.io/download/", "_blank");
      } else {
        console.log("found one", ethereum);
      }
      /*
       * Check if we're authorized to access the user's wallet
       */

      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("account ", account);
        setCurrentAccount(account);
        setIsConnected(true);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //connect wallet with button click
  const connectWallet = async () => {
    if (!isConnected) {
      try {
        const { ethereum } = window;
        if (!ethereum) {
          alert("Please install metamask");
          window.open("https://metamask.io/download/", "_blank");
          return;
        }
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        console.log("Connected", accounts[0]);
        setCurrentAccount(accounts[0]);
        setIsConnected(true);
      } catch (error) {
        console.log(error);
      }
    } else {
      setCurrentAccount("");
      setIsConnected(false);
    }
  };
 


  useEffect(() => {
    setIsConnected(false);
    checkIfWalletIsConnected();

    const userCheck = async ()=>{
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract =  new ethers.Contract(contractAddress, abi, signer);
      const res= await contract.isStakeholder(signer);  
      const res1= await contract.isVoteCordinator(signer);
      res ? setIsStakeholder(true) : setIsStakeholder(false) 
      res1 ? setIsVoteCordinator(true) : setIsVoteCordinator(false);
    }
    userCheck();
    console.log(isStakeholder);
    console.log(isVoteCordinator);
  }, []);

  return (
    <BrowserRouter>
      <Box minH="100vh" w="100vw">
        <Header
          isConnected={isConnected}
          currentAccount={currentAccount}
          toggleWallet={connectWallet}
        />

        <Banner />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                connectWallet={connectWallet}
                currentAccount={currentAccount}
                isConnected={isConnected}
                isStakeholder={isStakeholder}
                isVoteCordinator={isVoteCordinator}
        
              />
            }
          />
          <Route
            path="/dashboard"
            element={<Dashboard currentAccount={currentAccount} />
            }
          />
          <Route
            path="/chairman"
            element={
                <Chairman currentAccount={currentAccount} />
            }
          />
          <Route path="/setvote" element={<SetVotingAndTime />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}

export default App;
