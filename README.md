<div align="center">
  <img src="public/citra-banner.png" alt="Citra-Chain Banner" width="100%" />

  # 🍊 Citra-Chain
  
  **Decentralized Citrus Marketplace**
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![Ethereum](https://img.shields.io/badge/Ethereum-Solidity-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white)](https://ethereum.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

  <p align="center">
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-smart-contract">Smart Contract</a>
  </p>
</div>

---

## 🚀 Overview

**Citra-Chain** is a next-generation decentralized application (dApp) designed to revolutionize the citrus supply chain. By leveraging the power of **Blockchain technology**, we connect farmers directly with buyers, ensuring transparency, trust, and fair pricing.

Gone are the days of opaque supply chains. With Citra-Chain, every batch of harvest is recorded on-chain, providing an immutable history of origin, quantity, and price.

## ✨ Features

### 🌾 For Farmers
- **Batch Creation**: Easily list new harvest batches with details like quantity (kg), price (WEI), and harvest date.
- **Management**: Update listing details or deactivate unsold batches.
- **Direct Sales**: sell directly to consumers without intermediaries.

### 🛒 For Buyers
- **Transparent Marketplace**: Browse available citrus batches with verified on-chain data.
- **Secure Purchasing**: Buy directly using ETH with instant settlement.
- **Traceability**: Know exactly where your fruit comes from.

### ⛓️ On-Chain Integrity
- **Immutable Records**: All transactions and batch data are stored on the Ethereum blockchain.
- **Smart Contract Escrow**: Secure fund transfer logic embedded in the contract.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/)
- **State/Data**: React Hooks
- **Icons**: [Lucide React](https://lucide.dev/)

### Blockchain
- **Smart Contract**: Solidity (`^0.8.20`)
- **Interaction**: [Ethers.js v6](https://docs.ethers.org/v6/)
- **Network**: Ethereum (Local/Testnet/Mainnet)

### Tools
- **AI**: Google Genkit (for intelligent features)
- **Charts**: Chart.js / Recharts for analytics

---

## 📜 Smart Contract

The core logic resides in `CitraChainMarket.sol`. 

**Key Structures:**
```solidity
struct Batch {
    address farmer;
    uint256 quantity;
    uint256 pricePerKgWei;
    uint256 harvestDate;
    bool sold;
    bool isActive;
}
```

**Key Functions:**
- `createBatch(...)`: List a new batch.
- `buyBatch(uint256 batchId)`: Purchase a batch with ETH.
- `updateBatch(...)`: Modify batch details (if not sold).
- `deactivateBatch(...)`: Remove a batch from the market.

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v18+)
- Wallet (Metamask, etc.)
- Local Blockchain (Hardhat/Ganache) *optional for local dev*

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/citra-chain.git
    cd citra-chain
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

4.  **Open in Browser**
    Visit `http://localhost:3000` to see the application.

---

## 📸 Demo

*(Add a GIF or Screenshot of your application flow here)*

> "Connecting the zest of the earth with the speed of the chain." 🍊-⛓️

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
