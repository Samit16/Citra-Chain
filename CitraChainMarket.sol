// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CitraChainMarket {

    struct Batch {
        address farmer;
        uint256 quantity;
        uint256 pricePerKg;
        uint256 harvestDate;
        bool sold;
    }

    uint256 public batchCount;
    mapping(uint256 => Batch) public batches;

    event BatchCreated(
        uint256 batchId,
        address farmer,
        uint256 quantity,
        uint256 pricePerKg
    );

    event BatchPurchased(
        uint256 batchId,
        address buyer,
        uint256 totalPrice
    );

    function createBatch(
        uint256 quantity,
        uint256 pricePerKg,
        uint256 harvestDate
    ) external {
        batchCount++;

        batches[batchCount] = Batch({
            farmer: msg.sender,
            quantity: quantity,
            pricePerKg: pricePerKg,
            harvestDate: harvestDate,
            sold: false
        });

        emit BatchCreated(batchCount, msg.sender, quantity, pricePerKg);
    }

    function buyBatch(uint256 batchId) external payable {
        Batch storage b = batches[batchId];

        require(!b.sold, "Batch already sold");

        uint256 totalPrice = b.quantity * b.pricePerKg;
        require(msg.value == totalPrice, "Incorrect payment amount");

        b.sold = true;
        payable(b.farmer).transfer(msg.value);

        emit BatchPurchased(batchId, msg.sender, msg.value);
    }
}
