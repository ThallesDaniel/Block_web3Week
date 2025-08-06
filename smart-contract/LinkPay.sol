// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LinkPay {
    struct Link {
        string url;
        address owner;
        uint256 fee;
    }

    uint256 public commission = 1 wei;
    address public immutable platformOwner;

    mapping(string => Link) private links;
    mapping(string => mapping(address => bool)) public hasAccess;

    event LinkAdded(string indexed linkId, address indexed owner, uint256 fee);
    event LinkAccessPaid(string indexed linkId, address indexed user, uint256 amount);

    modifier onlyOwner(string calldata linkId) {
        require(links[linkId].owner == msg.sender, "Not the link owner");
        _;
    }

    constructor() {
        platformOwner = msg.sender;
    }

    function addLink(string calldata url, string calldata linkId, uint256 fee) external {
        require(bytes(url).length > 0, "URL required");
        require(bytes(linkId).length > 0, "Link ID required");
        require(fee == 0 || fee > commission, "Fee too low");

        Link storage existingLink = links[linkId];

        if (existingLink.owner != address(0)) {
            require(existingLink.owner == msg.sender, "Link ID already owned by another user");
        }

        links[linkId] = Link({
            url: url,
            owner: msg.sender,
            fee: fee
        });

        hasAccess[linkId][msg.sender] = true;

        emit LinkAdded(linkId, msg.sender, fee);
    }

    function payLink(string calldata linkId) external payable {
        Link storage link = links[linkId];
        require(link.owner != address(0), "Link not found");
        require(!hasAccess[linkId][msg.sender], "Access already granted");
        require(msg.value >= link.fee, "Insufficient payment");

        hasAccess[linkId][msg.sender] = true;

        uint256 amountToOwner = msg.value - commission;
        payable(link.owner).transfer(amountToOwner);

        payable(platformOwner).transfer(commission);

        emit LinkAccessPaid(linkId, msg.sender, msg.value);
    }

    function getLink(string calldata linkId) external view returns (string memory url, address owner, uint256 fee) {
        Link storage link = links[linkId];
        if (link.owner == address(0)) return ("", address(0), 0);

        if (link.fee == 0 || hasAccess[linkId][msg.sender]) {
            return (link.url, link.owner, link.fee);
        } else {
            return ("", link.owner, link.fee);
        }
    }

    // Opcional: para o dono do contrato mudar a comissão
    function setCommission(uint256 newCommission) external {
        require(msg.sender == platformOwner, "Only platform owner");
        commission = newCommission;
    }
}
