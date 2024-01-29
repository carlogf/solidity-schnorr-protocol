const { expect } = require("chai");

describe("Schnorr Protocol contract", function () {
  
    it("Deployment should instantiate prime p and generator g", async function () {
    const [owner] = await ethers.getSigners();
    const schnorr = await ethers.deployContract("Schnorr");
    const expected_prime = BigInt("0x800000000000011000000000000000000000000000000000000000000000001")
    const expected_generator = 7;

    const primeOrder = await schnorr.primeOrder();
    const generator = await schnorr.generator();
    
    expect(primeOrder).to.equal(expected_prime);
    expect(generator).to.equal(expected_generator);
    });

    it("auxiliary hash function can hash string to integer mod p", async function(){
        const [owner] = await ethers.getSigners();
        const schnorr = await ethers.deployContract("Schnorr");
        const expected_hash = BigInt("964435252078914263505232038807229274609877103166756773955666328431077743481");

        const string_to_hash = "hola"
        const hash = await schnorr.hashModp(string_to_hash);

        //const hash = await schnorr.generator();
        expect(hash).to.equal(expected_hash);

    })


    it("auxiliary hash function can correctly hash 3 concatenated bigints", async function(){
        const [owner] = await ethers.getSigners();
        const schnorr = await ethers.deployContract("Schnorr");
        const expected_hash = BigInt("1402792775372648592525927564370757360609555190463462275225337945118506663348");
        const A = BigInt("3193911330048772750163466840708703342603689863347316625363164265906920649196");
        const R = BigInt("3381150360092203933314116350121226761344165239458780575523012581341808801475");
        const g = BigInt("7");
        
        const hash = await schnorr.hashModp(g.toString()+A.toString()+R.toString());

        expect(hash).to.equal(expected_hash);

    })


    it("can verify xxxx", async function(){
        const [owner] = await ethers.getSigners();
        const schnorr = await ethers.deployContract("Schnorr");

        const A = BigInt("3193911330048772750163466840708703342603689863347316625363164265906920649196");
        const R = BigInt("3381150360092203933314116350121226761344165239458780575523012581341808801475");
        const z = BigInt("2581178580202173231983361769606702596438937575219053452360943336669012096641");

        validity = await schnorr.verifyProof(A,R,z);
        expect(validity).to.equal(true);
    })


    


});