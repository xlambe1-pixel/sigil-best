// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SigilNFT is ERC721, Ownable {
    uint256 public mintPrice;
    uint256 public maxSupply;
    uint256 public totalMinted;
    uint256 public maxPerWallet;
    bool public mintOpen;
    string public baseTokenURI;

    mapping(address => uint256) public mintedPerWallet;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _mintPrice,
        uint256 _maxSupply,
        uint256 _maxPerWallet,
        string memory _baseTokenURI
    ) ERC721(_name, _symbol) Ownable(msg.sender) {
        mintPrice = _mintPrice;
        maxSupply = _maxSupply;
        maxPerWallet = _maxPerWallet;
        baseTokenURI = _baseTokenURI;
        mintOpen = false;
    }

    function mint(uint256 quantity) external payable {
        require(mintOpen, "Mint not open");
        require(totalMinted + quantity <= maxSupply, "Exceeds max supply");
        require(msg.value >= mintPrice * quantity, "Insufficient payment");
        require(mintedPerWallet[msg.sender] + quantity <= maxPerWallet, "Exceeds max per wallet");

        for (uint256 i = 0; i < quantity; i++) {
            totalMinted++;
            _safeMint(msg.sender, totalMinted);
            mintedPerWallet[msg.sender]++;
        }
    }

    function setMintOpen(bool _open) external onlyOwner {
        mintOpen = _open;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }
}