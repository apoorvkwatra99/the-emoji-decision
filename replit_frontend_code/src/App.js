import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/EmojiDecision.json';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allVotes, setAllVotes] = useState([]);
  const contractAddress = "0xaFFb618235DD9D093c0B8eEA0d9dc90E8eF66Ac3";
  const contractABI = abi.abi;
  
  const getAllVotes = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const emojiContract = new ethers.Contract(contractAddress, contractABI, signer);
        const votes = await emojiContract.getAllVotes();
        let votesCleaned = [];
        votes.forEach(vote => {
          votesCleaned.unshift({
            address: vote.voter,
            vote: vote.isAlien ? "👾" : "🦑",
            message: vote.message,
            timestamp: new Date(vote.timestamp * 1000)
          });
        });
        setAllVotes(votesCleaned);
        emojiContract.on("NewVote", (from, vote, message, timestamp) => {
          console.log("NewVote", from, vote, message, timestamp);

          setAllVotes(prevState => [{
            address: from,
            vote: vote ? "👾" : "🦑",
            message: message,
            timestamp: new Date(timestamp * 1000),
          },
          ...prevState]);
        });
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      
      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      console.log(accounts);
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        getAllVotes();
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }

  const vote = async (isAlien) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const emojiContract = new ethers.Contract(contractAddress, contractABI, signer);
        let message = document.getElementById("message").value;
        let voteTxn = await emojiContract.vote(isAlien, message, { gasLimit: 300000 });
        console.log("Mining...", voteTxn.hash);
        await voteTxn.wait();
        console.log("Mined -- ", voteTxn.hash);
        let diff = await emojiContract.getWinner();
        let diffNum = diff.toNumber();
        let pluralChar = (diffNum === 1) || (diffNum === -1) ? "" : "s";
        if (diffNum > 0) {
          console.log("The alien wins by %i vote%s!", diffNum, pluralChar);
          document.getElementById("currentWinner").innerHTML = "Current winner: 👾";
        } else if (diffNum < 0) {
          console.log("The squid wins by %i vote%s!", -1 * diffNum, pluralChar);
          document.getElementById("currentWinner").innerHTML = "Current winner: 🦑";
        } else {
          console.log("The alien and the squid are tied!");
          document.getElementById("currentWinner").innerHTML = "Both emoji are tied!";
        }
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
}


  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👾 Hey there! 🦑
        </div>

        <div className="bio">
        Send a message and tell me which emoji you think is cooler!
        </div>

        <div className="messageBox">
        <input type="text" id="message" placeholder="Your message will send when you vote for an emoji"></input>
        </div>

        <div className="emojiButtons">
          <button onClick={() => vote(true)}>👾</button>
          <button onClick={() => vote(false)}>🦑</button>
        </div>
        {!currentAccount && (
          <div className="connectButton">
            <button onClick={connectWallet}>
              Connect Wallet
            </button>
          </div>
        )}
        <div type="text" id="currentWinner" className="currentWinner" style={{ marginTop: "16px", padding: "8px", fontSize: "24px", textAlign: "center" }}>
        </div>
        {allVotes.map((vote, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px", border: 0, borderRadius: 5, }}>
              <div>Address: {vote.address}</div>
              <div>Vote: {vote.vote}</div>
              <div>Time: {vote.timestamp.toString()}</div>
              <div>Message: {vote.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
}

export default App
