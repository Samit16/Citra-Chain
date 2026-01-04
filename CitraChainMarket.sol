// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CitraChainMarket {

    struct Batch {
        address farmer;
        uint256 quantity;
        uint256 pricePerKgWei; // price stored in WEI
        uint256 harvestDate;
        bool sold;
        bool isActive;
    }

    uint256 public batchCount;
    mapping(uint256 => Batch) public batches;

    event BatchCreated(
        uint256 batchId,
        address farmer,
        uint256 quantity,
        uint256 pricePerKgWei
    );

    event BatchPurchased(
        uint256 batchId,
        address buyer,
        uint256 totalPriceWei
    );
    
    event BatchUpdated(uint256 batchId, uint256 quantity, uint256 pricePerKgWei);
    event BatchDeactivated(uint256 batchId);

    function createBatch(
        uint256 quantity,
        uint256 pricePerKgWei,
        uint256 harvestDate
    ) external {
        require(quantity > 0, "Quantity must be > 0");
        require(pricePerKgWei > 0, "Price must be > 0");

        batchCount++;

        batches[batchCount] = Batch({
            farmer: msg.sender,
            quantity: quantity,
            pricePerKgWei: pricePerKgWei,
            harvestDate: harvestDate,
            sold: false,
            isActive: true
        });

        emit BatchCreated(batchCount, msg.sender, quantity, pricePerKgWei);
    }

    function buyBatch(uint256 batchId) external payable {
        require(batchId > 0 && batchId <= batchCount, "Invalid batch");

        Batch storage b = batches[batchId];
        require(b.isActive, "Batch is not active");
        require(!b.sold, "Batch already sold");

        uint256 totalPriceWei = b.quantity * b.pricePerKgWei;
        require(msg.value == totalPriceWei, "Incorrect payment");

        b.sold = true;

        (bool success, ) = b.farmer.call{value: msg.value}("");
        require(success, "Payment failed");

        emit BatchPurchased(batchId, msg.sender, msg.value);
    }

    function updateBatch(uint256 batchId, uint256 quantity, uint256 pricePerKgWei) external {
        require(batchId > 0 && batchId <= batchCount, "Invalid batch");
        Batch storage b = batches[batchId];
        require(msg.sender == b.farmer, "Only farmer can edit");
        require(!b.sold, "Cannot edit sold batch");
        require(b.isActive, "Cannot edit inactive batch");

        b.quantity = quantity;
        b.pricePerKgWei = pricePerKgWei;

        emit BatchUpdated(batchId, quantity, pricePerKgWei);
    }

    function deactivateBatch(uint256 batchId) external {
        require(batchId > 0 && batchId <= batchCount, "Invalid batch");
        Batch storage b = batches[batchId];
        require(msg.sender == b.farmer, "Only farmer can deactivate");
        require(!b.sold, "Cannot deactivate sold batch");
        
        b.isActive = false;
        
        emit BatchDeactivated(batchId);
    }
}
