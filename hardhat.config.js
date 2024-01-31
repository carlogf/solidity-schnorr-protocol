require("@nomicfoundation/hardhat-toolbox");
require('@openzeppelin/hardhat-upgrades');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      gas: 1000000000429720,
      gasPrice: 1,
      initialBaseFeePerGas: 0,
      blockGasLimit: 1000000000429720,
    },
  }
};
