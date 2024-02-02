const { expect } = require("chai");

describe("Schnorr Protocol in testnet Sepolia", function () {

  it("can get prime order and generator from deployed contract", async function () {

    const contractAddress_in_sepolia = "0x361c8dCcb449bda0A6B7912b93DA343EC08efe8D";

    const contractAddress = contractAddress_in_sepolia;

    const SchnorrContract = await hre.ethers.getContractAt("Schnorr", contractAddress);
    const [signer] = await ethers.getSigners();

    const primeOrder = await SchnorrContract.primeOrder();
    const generator = await SchnorrContract.generator();

    expect(generator).to.equal(7);
    expect(primeOrder).to.equal(BigInt("0x800000000000011000000000000000000000000000000000000000000000001"))
  });



  it("can verify a proof onchain", async function () {

    const contractAddress_in_sepolia = "0x361c8dCcb449bda0A6B7912b93DA343EC08efe8D";
    //const contractAddress_in_hardhatNetwork = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    const contractAddress = contractAddress_in_sepolia;

    const SchnorrContract = await hre.ethers.getContractAt("Schnorr", contractAddress);

    const [signer] = await ethers.getSigners();

    const A = BigInt("3193911330048772750163466840708703342603689863347316625363164265906920649196");
    const R = BigInt("3381150360092203933314116350121226761344165239458780575523012581341808801475");
    const z = BigInt("2581178580202173231983361769606702596438937575219053452360943336669012096641");


    const transaction_result = await SchnorrContract.verifyProof(A, R, z);
    const receipt = await transaction_result.wait();

    proof_validity = receipt.logs[2].args[0];
    //console.log(receipt.logs);
  
    expect(proof_validity).to.equal(true);

  });

  it("can reject an invalid proof onchain", async function () {

    const contractAddress_in_sepolia = "0x361c8dCcb449bda0A6B7912b93DA343EC08efe8D";
    //const contractAddress_in_hardhatNetwork = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const contractAddress = contractAddress_in_sepolia;
    const SchnorrContract = await hre.ethers.getContractAt("Schnorr", contractAddress);
    const [signer] = await ethers.getSigners();

    const A = BigInt("3193911330048772750163466840708703342603689863347316625363164265906920649196");
    const R = BigInt("3381150360092203933314116350121226761344165239458780575523012581341808801475");
    const z = BigInt("2581178580202173231983361769606702596438937575219053452360943336669012096641");

    
    //changing value z

    const transaction_result = await SchnorrContract.verifyProof(A, R, z+1n);
    const receipt = await transaction_result.wait();

    proof_validity = receipt.logs[2].args[0];
    //console.log(receipt.logs);
  
    expect(proof_validity).to.equal(false);

  });



});
