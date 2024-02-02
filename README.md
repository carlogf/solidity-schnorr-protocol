# Solidity Schnorr Verifier Smart Contract

run ```npx hardhat test``` to run the tests

## Introduction

This is the result of an exploratory project with the aim of deploying a Schnorr Signature verifier on the Ethereum Testnet.

The project involved
* Getting familiar with developing smart contracts in hardhat.
* Revising the Schnorr protocol and implementing it.
* Getting an ethereum address and using it on the testnet.

## Structure
The project is structured in the following folders

* contracts - smart contracts in solidity.
* test - Contract tests in Javascript
* scripts - a single script for deploying the contract in the testnet
* schnorr.ipynb - Not a folder. Python implementation of the schnorr protocol in a jupyter notebook. Used for learning purposes.
* hardhat.config.js - Also not a folder. You should create your own config file with your private keys to interact with the testnet.

## The Schnorr Verifier Smart Contract

### The main functions

The smart contract is coded in solidity and has 2 parameters, the prime $p$ and the generator $g$. It also has 3 main functions. 


#### ModExp(base, exponent, modulo). 
The best way to perform modular exponentation onchain is to use a precompiled contract that can be found on address 0x0...05.
Calls to precompiled contracts must be done from assembly and are quite cumbersome. This code prepares and makes the call to the precompile and returns the result.
It emits an event so that I can test the function.

#### HashModp(data)
Since we use the fiat-shamir heuristic to remove the interactiveness of the protocol, we need to hash the concatenation of some parameters of the protocol to generate a random number. Since we are working in a finite field we only need the modulo p of the hash. This function calcualtes the hash and returns its congruency modulo p.

#### verifyProof(A, R, z)
The verifier. It starts by calculating the random value b with the hash function.
It calculates both sides of the equality using the modular exponentiation and compares them. It returns a boolean value and emmits an event so we can use its result offchain

### Some comments

#### modifiers
Functions in solidity can ahve modifiers that allow the compiler to know how it will be used and called. We used a few.
* *view* - It will only read some value son the state and return it. It doesnt change anything. These functions don't cost gas
* *external* This functions can only be called from outside the contract. They can't be used by other functions inside the contract.
* *public* Can be used and called from anywhere.

One doubt I had is that the modExp doensnt change the chain state but the compiler doesn't let me set it as *view*. This has something to do with the fact it calls a precompiled contract. There is still much to learn.

#### OpenZeppelin string library
I needed to operate on strings and solidity doesnt natively has many strings manipulation functions. I imported this library from OpenZeppelin.
As it turns out, you should not convert your integers to strings for concatenating them. You should convert them to bytes and concatenate the bytes arrays instead.

#### Events
A function that is executed inside a smart contract doesn't *return* a value that you can read and operate with offchain. Not in the traditional way at least. The way you solve this is you emmit an *event* with the value you want to return. This event is then logged in the confirmed transaction and stored on chain. You can access them with the block explorer or, in our case, with the transaction receipt we get from ether.js.

## Tests

We use ethers.js and its hardhat extension to develop the tests

To run the tests, run in terminal
```npx hardhat test test/Schnorr.js```

here something crazy happens. If I comment line 65 which is just a print in terminal, the transaction doesnt run because it runs out of gas. Really weird.

All tests have the same format
* It gets a signer with getSigners from the config file which has the private key of a wallet.
* It deploys the contract and assigns it as a cotnract object to a variable. We can now call the contract functions by their name.
* We execute our tests, read the result from the emmitted messages and make our assertions.

#### Testing on the testnet
We deployed our contract on the Sepolia testnet. 

```npx hardhat run scripts/deploy.js --network sepolia```

The deploying script returns the contract address where the contract was deployed. We can even search for it with the block explorer.

We used Infura (poner aca el link) to access the testnet node and to get sepolitaEth from its faucet.

To run the tests on the testnet, make sure you have a valid config file and run

```npx hardhat test test/DeployedSchnorrProtocol.js --network sepolia```

This should make calls to our deployed contract and return and verify the different proofs we send them with out tests. Keep in mind these tests spend sepoliaETH
