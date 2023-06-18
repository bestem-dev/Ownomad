// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
import "./Development.sol";

contract Ownomad is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _developmentIds;
    mapping(uint256 => OwnomadNFT) developments;

    function createDevelopment(
        string memory basetokenURI,
        address token,
        uint256 price,
        uint256 supply
    ) external onlyOwner returns (uint256) {
        uint256 newDevelopmentId = _developmentIds.current();
        developments[newDevelopmentId] = new OwnomadNFT(
            basetokenURI,
            token,
            price,
            supply
        );
        _developmentIds.increment();
        return newDevelopmentId;
    }

    function getDevelopment(uint256 id) external view returns (address) {
        return address(developments[id]);
    }

    function getDevelopmentsCount() external view returns (uint256) {
        return _developmentIds.current();
    }
}
