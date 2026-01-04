export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

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
                "name": "pricePerKg",
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
                "name": "totalPrice",
                "type": "uint256"
            }
        ],
        "name": "BatchPurchased",
        "type": "event"
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
                "name": "pricePerKg",
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
            }
        ],
        "stateMutability": "view",
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
                "name": "pricePerKg",
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
    }
];
