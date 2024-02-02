pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Schnorr {
    using Strings for uint256;
    
    event modularExpResult(uint);
    event proofIsValid(bool);

    uint256 p = 0x800000000000011000000000000000000000000000000000000000000000001;

    uint256 g = 7;

    // A good practice would be to put this function in its own contract to create Finite field operations.

    //This code calls the precompiled contract at 0x05 using assembly code. 
    function modExp(uint256 _b, uint256 _e, uint256 _m) public returns (uint256 result) {
        assembly {
            // Free memory pointer
            let pointer := mload(0x40)

            // Define length of base, exponent and modulus. 0x20 == 32 bytes
            mstore(pointer, 0x20)
            mstore(add(pointer, 0x20), 0x20)
            mstore(add(pointer, 0x40), 0x20)

            // Define variables base, exponent and modulus
            mstore(add(pointer, 0x60), _b)
            mstore(add(pointer, 0x80), _e)
            mstore(add(pointer, 0xa0), _m)

            // Store the result
            let value := mload(0xc0)

            // Call the precompiled contract 0x05 = bigModExp
            if iszero(call(not(0), 0x05, 0, pointer, 0xc0, value, 0x20)) {
                revert(0, 0)
            }

            result := mload(value)
        }
        emit modularExpResult(result);
        return result;
    }


    function primeOrder() external view returns (uint256) {
        return p;
    }

    function generator() external view returns (uint256) {
        return g;
    }

    function hashModp(string memory data) public view returns (uint256) {
        uint256 aux = uint(sha256(bytes(data)));
        uint256 ret = aux%(p-1);
        return ret;
    }

    function verifyProof(uint A, uint R, uint z) external returns(bool) {
        uint startinggas = gasleft();

        console.log("starting gas %s", startinggas);

        string memory concatenated_string = string.concat(g.toString(), A.toString());
        concatenated_string = string.concat(concatenated_string, R.toString());

        uint trueb = hashModp(concatenated_string);

        uint lhs = modExp(g, z, p);
        uint aux_rhs = modExp(A, trueb, p);
        uint rhs = mulmod(R,aux_rhs,p);
        uint mygas = gasleft();
        //console.log("gas left %s", mygas);

        uint usedGas = startinggas - mygas;
        //console.log("used gas %s", usedGas);

        bool validity = (lhs == rhs);

        emit proofIsValid(validity);
        return validity;
    }
}