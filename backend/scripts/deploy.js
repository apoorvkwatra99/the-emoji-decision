const main = async () => {
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await deployer.getBalance();
  
    console.log('Deploying contracts with account: ', deployer.address);
    console.log('Account balance: ', accountBalance.toString());
  
    const emojiContractFactory = await hre.ethers.getContractFactory('EmojiDecision');
    const emojiContract = await emojiContractFactory.deploy({
        value: hre.ethers.utils.parseEther('0.01'),
    });
    await emojiContract.deployed();
  
    console.log('EmojiDecision address:', emojiContract.address);
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };
  
  runMain();