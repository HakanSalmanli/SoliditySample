
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTMinter is ERC721URIStorage, Ownable {

    uint256 public nextToken;
    uint256 public royaltyFeePercentage;
    address public treasuryWallet;
    address public liquidityWallet;

    constructor(string memory _name,string memory _symbol,uint256 _royaltyFeePercentage,address _liquidityWallet,address _treasuryWallet) 
    ERC721(_name, _symbol) Ownable(msg.sender) { 
        nextToken = 1; 
        royaltyFeePercentage = _royaltyFeePercentage; 
        liquidityWallet = _liquidityWallet; 
        treasuryWallet = _treasuryWallet; 
    }

    function mintNFT(string memory _tokenURI, uint256 _price) external payable {
        
        require(_price > 0, "Price Must Be Greater Than 0 ");
        require(msg.value >= _price, "Insufficient Funds");

        uint256 tokenId = nextToken;
        nextToken++;

        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);

        uint256 royaltyAmount = (_price * royaltyFeePercentage) / 100;
        uint256 liquidityAmount = (_price * (10 - royaltyFeePercentage)) / 100;

        (bool success, ) = treasuryWallet.call{value: royaltyAmount}("");
        require(success, "Treasury Wallet Transfer Failed");

        (success, ) = liquidityWallet.call{value: liquidityAmount}("");
        require(success, " Liquidity Wallet Transfer Failed");
    }
}
