//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "base64-sol/base64.sol";

import "./HexStrings.sol";

//learn more: https://docs.openzeppelin.com/contracts/5.x/erc721

contract MahJongNFT is ERC721Enumerable {
    using Strings for uint256;
    using HexStrings for uint160;

    uint256 private _currentTokenId;
    uint mahjongUnicodeStart = 126976; //0x1F000
    mapping(uint256 => uint256) idToNumber;

    // all funds go to buidlguidl.eth
    address payable public constant recipient = payable(0xa81a6a910FeD20374361B35C451a4a44F86CeD46);

    uint256 public constant limit = 3728;
    uint256 public constant curve = 1002; // price increase 0,4% with each purchase
    uint256 public price = 0.001 ether;

    // the 1154th optimistic loogies cost 0.01 ETH, the 2306th cost 0.1ETH, the 3459th cost 1 ETH and the last ones cost 1.7 ETH

    constructor() ERC721("MahJongCoin", "MJC") {
        // RELEASE THE OPTIMISTIC LOOGIES!
    }

    function mintItem() public payable returns (uint256) {
        require(_currentTokenId < limit, "DONE MINTING");
        require(msg.value >= price, "NOT ENOUGH");
        price = (price * curve) / 1000;
        _currentTokenId += 1;

        _safeMint(msg.sender, _currentTokenId);

        bytes32 predictableRandom = keccak256(
            abi.encodePacked(_currentTokenId, blockhash(block.number - 1), msg.sender, address(this))
        );
        idToNumber[_currentTokenId] = uint8(predictableRandom[0]) % 41;

        (bool success, ) = recipient.call{ value: msg.value }("");
        require(success, "could not send");

        return _currentTokenId;
    }

    function _getMahjongNumberAndType(uint256 id) internal view returns (uint mjNumber, string memory mjType) {
        uint number = idToNumber[id];
        if (number <= 6) {
            return (number + 1, "Feng");
        }
        if (number <= 6 + 9) {
            return (number - 6, "Wan");
        }
        if (number <= 6 + 9 + 9) {
            return (number - 6 - 9, "Tiao");
        }
        if (number <= 6 + 9 + 9 + 9) {
            return (number - 6 - 9 - 9, "Bing");
        }
        if (number <= 6 + 9 + 9 + 9 + 8) {
            return (number - 6 - 9 - 9 - 9, "Hua");
        }
    }

    function tokenURI(uint256 id) public view override returns (string memory) {
        require(_ownerOf(id) != address(0), "not exist");
        string memory name = string(abi.encodePacked("MahJongCoin #", id.toString()));
        (uint mjNumber, string memory mjType) = _getMahjongNumberAndType(id);
        string memory description = string(
            abi.encodePacked("This MahJongCoin is the ", mjType, " with a number of ", mjNumber.toString(), " !!!")
        );
        string memory image = Base64.encode(bytes(generateSVGofTokenById(id)));

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                name,
                                '", "description":"',
                                description,
                                '", "owner":"',
                                (uint160(ownerOf(id))).toHexString(20),
                                '", "image": "',
                                "data:image/svg+xml;base64,",
                                image,
                                '"}'
                            )
                        )
                    )
                )
            );
    }

    function generateSVGofTokenById(uint256 id) public view returns (string memory) {
        string memory text = string(abi.encodePacked("&#", uint(mahjongUnicodeStart + idToNumber[id]).toString(), ";"));
        string memory svg = string(
            abi.encodePacked(
                '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">',
                '<text x="50" y="80" font-size="85" text-anchor="middle" fill-opacity="inherit">',
                '<animate attributeName="fill-opacity" values="0.5;1;0.5" dur="2s" begin="0s" repeatCount="indefinite" />',
                text,
                "</text>",
                "</svg>"
            )
        );

        return svg;
    }
}
