pragma solidity ^0.8.0;

contract Schnorr {

    uint256 p = 0x800000000000011000000000000000000000000000000000000000000000001;

    uint256 g = 7;



    function primeOrder() external view returns (uint256) {
        return p;
    }
}