# The Emoji Decision

The project can be viewed here: [https://the-emoji-decision.apoorvk.repl.co/](https://the-emoji-decision.replit.app/)

This Buildspace project runs on the Sepolia Test Network. A Metamask wallet with some Ethereum on this test network is all that is needed to test it out! Once a user clicks the link, they can connect their Metamask wallet and then vote for their favorite emoji between the two options. Upon the vote being mined, the current winner will be revealed, and the log of previous votes will be updated with the new vote. 10% of the time someone votes, they will receive a small amount of Ethereum (on the test network) as a prize. Because of this, users can only vote once every five minutes.

# Backend

The backend folder is where all the smart contract code lives. `contracts/EmojiDecision.sol` contains the contract `EmojiDecision` and has several helper functions. Some were only used as Solidity practice and are not actually used in the final project. The `scripts/run.js` script was mainly used for testing, and the `scripts/deploy.js` script was used to actually deploy the contract.

# Frontend

The frontend folder contains all the code written on Replit. It builds out the actual web page that is linked at the top of this file and calls the contract in the backend. `src/App.js` contains most of the code written here.
