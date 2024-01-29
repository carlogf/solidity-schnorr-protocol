pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Schnorr {
    using Strings for uint256;
    

    uint256 p = 0x800000000000011000000000000000000000000000000000000000000000001;

    uint256 g = 7;

    // A good practice would be to put this function in its own contract to create Finite field operations.
    function modExp(uint256 base, uint256 exponent, uint256 modulus) public pure returns (uint256 result) {
        result = 1;

        while (exponent > 0) {
            result = (result * base) % modulus;
            exponent = exponent-1;
        }
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

    function verifyProof(uint A, uint R, uint z) external view returns(bool) {
        string memory concatenated_string = string.concat(g.toString(), A.toString());
        concatenated_string = string.concat(concatenated_string, R.toString());

        uint b = hashModp(concatenated_string);

        uint lhs = modExp(g, z, p);
        uint rhs = (R * modExp(A, b, p))%p;


        console.log("my value b is %s",b);

        return lhs == rhs;
    }
}