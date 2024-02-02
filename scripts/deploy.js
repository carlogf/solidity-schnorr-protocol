const hre = require("hardhat");

async function main() {
  try {
    // Get the ContractFactory of your SimpleContract
    const SchnorrContract = await hre.ethers.getContractFactory('Schnorr');

    // Deploy the contract
    const contract = await SchnorrContract.deploy();

    // Wait for the deployment transaction to be mined
    await contract.waitForDeployment();

    console.log(`SchnorrContract deployed to: ${contract.target}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();