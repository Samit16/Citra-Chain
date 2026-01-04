export const CONTRACT_ADDRESS = "0x6DF059BA891131D1ebf3cb28Ad7268acEAB0B89c";

export const CONTRACT_ABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "batchId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "farmer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "quantity",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "pricePerKgWei",
                "type": "uint256"
            }
        ],
        "name": "BatchCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "batchId",
                "type": "uint256"
            }
        ],
        "name": "BatchDeactivated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "batchId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "totalPriceWei",
                "type": "uint256"
            }
        ],
        "name": "BatchPurchased",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "batchId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "quantity",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "pricePerKgWei",
                "type": "uint256"
            }
        ],
        "name": "BatchUpdated",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "batchId",
                "type": "uint256"
            }
        ],
        "name": "buyBatch",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "quantity",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "pricePerKgWei",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "harvestDate",
                "type": "uint256"
            }
        ],
        "name": "createBatch",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "batchId",
                "type": "uint256"
            }
        ],
        "name": "deactivateBatch",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "batchId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "quantity",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "pricePerKgWei",
                "type": "uint256"
            }
        ],
        "name": "updateBatch",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "batchCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "batches",
        "outputs": [
            {
                "internalType": "address",
                "name": "farmer",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "quantity",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "pricePerKgWei",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "harvestDate",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "sold",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
