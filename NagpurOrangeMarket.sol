// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
contract NagpurOrangeMarket {
    struct Batch {
        address farmer;
        uint256 quantity;
        uint256 harvestDate;
        uint256 highestBid;
        address highestBidder;
        bool isSold;
    }

    uint256 public batchCount;
    mapping(uint256 => Batch) public batches;

    event BatchCreated(uint256 batchId, address farmer);
    event BidPlaced(uint256 batchId, address bidder, uint256 amount);
    event BatchSold(uint256 batchId, address buyer, uint256 amount);

    function createBatch(uint256 quantity, uint256 harvestDate) external {
        batchCount++;

        batches[batchCount] = Batch({
            farmer: msg.sender,
            quantity: quantity,
            harvestDate: harvestDate,
            highestBid: 0,
            highestBidder: address(0),
            isSold: false
        });
        emit BatchCreated(batchCount,msg.sender);
    }
    function placeBid(uint256 batchId) external payable {
        Batch storage b = batches[batchId];

        require(!b.isSold, "Batch already sold");
        require(msg.value> b.highestBid, "Bid too low");

        if(b.highestBidder != address(0)){
            payable(b.highestBidder).transfer(b.highestBid);
        }

        b.highestBid= msg.value;
        b.highestBidder= msg.sender;

        emit BidPlaced(batchId, msg.sender, msg.value);
    }
    function acceptBid(uint256 batchId) external {
        Batch storage b= batches[batchId];

        require(msg.sender == b.farmer, "Only farmer can accept");
        require(!b.isSold, "Batch already sold!");

        b.isSold = true;
        payable(b.farmer).transfer(b.highestBid);
        emit BatchSold(batchId, b.highestBidder, b.highestBid);
    }
}