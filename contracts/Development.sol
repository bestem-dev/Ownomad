// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

struct CryptoTokenInfo {
    IERC20 paytoken;
    uint256 costvalue;
}

contract OwnomadNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    CryptoTokenInfo private paymentToken;
    uint256 public maxSupply;
    uint256 public maxMintAmount = 15;
    address private owner;
    string private _basetokenURI;

    constructor(
        string memory basetokenURI,
        address token,
        uint256 price,
        uint256 supply
    ) ERC721("OwnomadNFT", "Contract") {
        _basetokenURI = basetokenURI;
        paymentToken = CryptoTokenInfo(IERC20(token), price);
        maxSupply = supply;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _basetokenURI;
    }

    function getTokenPrice() public view returns (uint256) {
        return paymentToken.costvalue;
    }

    function getPaymentToken() public view returns (address) {
        return address(paymentToken.paytoken);
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        return _baseURI();
        // return
        //     string(abi.encodePacked(_baseURI(), Strings.toString(tokenId)));
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }

    function mintWithERCToken(uint256 mintAmount) external {
        IERC20 paytoken;
        paytoken = paymentToken.paytoken;
        uint256 costval;
        costval = paymentToken.costvalue;
        uint256 totalCost = costval * mintAmount;
        uint256 supply = totalSupply();
        uint256 senderBal = paytoken.balanceOf(msg.sender);

        require(mintAmount > 0, "You need to mint at least 1 NFT");
        require(
            mintAmount <= maxMintAmount,
            "Max mint amount per session exceeded"
        );
        console.log(supply);
        console.log(mintAmount);
        console.log(maxSupply);
        require(supply + mintAmount <= maxSupply, "Max NFT exceeded");

        require(senderBal >= totalCost, "You do not have enough tokens to pay");
        // I would transfer the total cost all at once
        paytoken.transferFrom(msg.sender, address(this), totalCost);
        // and only loop through the mint
        for (uint256 i = 1; i <= mintAmount; i++) {
            uint256 newItemId = _tokenIds.current();
            _safeMint(msg.sender, newItemId);
            _tokenIds.increment();
        }
    }
}
