const main = async () => {
  const [owner, randomPerson1, randomPerson2] = await hre.ethers.getSigners();
  const emojiContractFactory = await hre.ethers.getContractFactory('EmojiDecision');
  const emojiContract = await emojiContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.001'),
  });
  await emojiContract.deployed();

  console.log("Contract deployed to:", emojiContract.address);
  console.log("Contract deployed by:", owner.address);

  let contractBalance = await hre.ethers.provider.getBalance(
    emojiContract.address
  );
  console.log(
    'Contract balance:',
    hre.ethers.utils.formatEther(contractBalance)
  );

  let voteCount, maxVoter, maxVotes, voteDiff;
  voteCount = await emojiContract.getTotalVotes();
  [maxVoter, maxVotes] = await emojiContract.getMaxVoterAndVotes();
  voteDiff = await emojiContract.getWinner();
  
  let voteTxn = await emojiContract.vote(true, "message1");
  await voteTxn.wait();
  voteCount = await emojiContract.getTotalVotes();
  [maxVoter, maxVotes] = await emojiContract.getMaxVoterAndVotes();
  
  voteDiff = await emojiContract.getWinner();
  
  voteTxn = await emojiContract.connect(randomPerson1).vote(false, "message2");
  await voteTxn.wait();
  voteCount = await emojiContract.getTotalVotes();
  [maxVoter, maxVotes] = await emojiContract.getMaxVoterAndVotes();
  voteDiff = await emojiContract.getWinner();

  voteTxn = await emojiContract.connect(randomPerson2).vote(false, "message3");
  await voteTxn.wait();
  voteCount = await emojiContract.getTotalVotes();
  [maxVoter, maxVotes] = await emojiContract.getMaxVoterAndVotes();
  voteDiff = await emojiContract.getWinner();
  
  voteTxn = await emojiContract.vote(true, "message4");
  await voteTxn.wait();
  voteCount = await emojiContract.getTotalVotes();
  [maxVoter, maxVotes] = await emojiContract.getMaxVoterAndVotes();
  voteDiff = await emojiContract.getWinner();

  voteTxn = await emojiContract.connect(randomPerson1).vote(true, "message5");
  await voteTxn.wait();
  voteCount = await emojiContract.getTotalVotes();
  [maxVoter, maxVotes] = await emojiContract.getMaxVoterAndVotes();
  voteDiff = await emojiContract.getWinner();

  voteTxn = await emojiContract.connect(randomPerson1).vote(true, "message6");
  await voteTxn.wait();
  voteCount = await emojiContract.getTotalVotes();
  [maxVoter, maxVotes] = await emojiContract.getMaxVoterAndVotes();
  voteDiff = await emojiContract.getWinner();

  let allVotes = await emojiContract.getAllVotes();
  console.log(allVotes);

  contractBalance = await hre.ethers.provider.getBalance(emojiContract.address);
  console.log(
    'Contract balance:',
    hre.ethers.utils.formatEther(contractBalance)
  );
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();