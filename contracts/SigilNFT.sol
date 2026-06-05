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

    address public constant SIGIL_TREASURY = 0xb8922f9591B36f82a671EF38C54C60b1396F59C8;
    uint256 public constant PROTOCOL_FEE_BPS = 10; // 0.10% in basis points (1 bps = 0.01%)

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

        uint256 totalPayment = mintPrice * quantity;
        uint256 protocolFee = (totalPayment * PROTOCOL_FEE_BPS) / 10000;
        uint256 creatorPayment = totalPayment - protocolFee;

        if (protocolFee > 0) {
            payable(SIGIL_TREASURY).transfer(protocolFee);
        }
        payable(owner()).transfer(creatorPayment);

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