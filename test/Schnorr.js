const { expect } = require("chai");

describe("Schnorr Protocol contract", function () {
  it("Deployment should xxxxx", async function () {
    const [owner] = await ethers.getSigners();

    const schnorr = await ethers.deployContract("Schnorr");

    const primeOrder = await schnorr.primeOrder();
    const prime = BigInt("0x800000000000011000000000000000000000000000000000000000000000001")
    expect(primeOrder).to.equal(prime);
  });
});