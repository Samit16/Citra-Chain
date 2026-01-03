import type { HarvestBatch, CustomerHarvestBatch, Tag } from './types';

export const mockBatches: HarvestBatch[] = [
  {
    id: '#ORG-2023-8821',
    cropType: 'Nagpur Orange',
    quantity: 1200,
    harvestDate: new Date('2023-10-22'),
    farmLocation: 'Nagpur, India',
    status: 'Listed',
    image: {
      src: 'https://picsum.photos/seed/fruit1/600/400',
      hint: 'fresh oranges',
    },
    bids: 0,
    minBid: 40,
    blockchainTransaction:
      '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
  },
  {
    id: '#ORG-2023-8790',
    cropType: 'Nagpur Orange',
    quantity: 850,
    harvestDate: new Date('2023-09-15'),
    farmLocation: 'Wardha, India',
    status: 'Sold',
    image: {
      src: 'https://picsum.photos/seed/orchard1/600/400',
      hint: 'orange orchard',
    },
    finalPrice: 38250,
    blockchainTransaction:
      '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c',
  },
  {
    id: '#ORG-2023-8822',
    cropType: 'Nagpur Orange',
    quantity: 2000,
    harvestDate: new Date('2023-10-20'),
    farmLocation: 'Amravati, India',
    status: 'Listed',
    image: {
      src: 'https://picsum.photos/seed/orangehalf/600/400',
      hint: 'orange slice',
    },
    bids: 1,
    blockchainTransaction:
      '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
  },
];

export const customerMockBatches: CustomerHarvestBatch[] = [
  {
    id: '1',
    name: 'Nagpur Mandarin',
    location: 'Kalmeshwar, Nagpur',
    quantity: 5000,
    harvestDate: new Date('2024-10-24'),
    highestBid: 25.5,
    verified: true,
    grade: { name: 'Grade A', color: 'bg-amber-100 text-amber-800' },
    image: {
      src: 'https://picsum.photos/seed/mandarinbasket/400/250',
      hint: 'mandarin basket',
    },
  },
  {
    id: '2',
    name: 'Kinnow Variety',
    location: 'Katol, Nagpur',
    quantity: 2500,
    harvestDate: new Date('2024-10-26'),
    highestBid: 28.0,
    verified: false,
    grade: { name: 'Organic', color: 'bg-green-100 text-green-800' },
    image: {
      src: 'https://picsum.photos/seed/orangeslices/400/250',
      hint: 'orange slices',
    },
  },
  {
    id: '3',
    name: 'Nagpur Mandarin',
    location: 'Ramtek, Nagpur',
    quantity: 10000,
    harvestDate: new Date('2024-10-23'),
    highestBid: 22.1,
    verified: true,
    timeLeft: '1H LEFT',
    grade: { name: 'Grade B', color: 'bg-blue-100 text-blue-800' },
    image: {
      src: 'https://picsum.photos/seed/orangetree/400/250',
      hint: 'orange tree',
    },
  },
  {
    id: '4',
    name: 'Nagpur Gold',
    location: 'Saoner, Nagpur',
    quantity: 1200,
    harvestDate: new Date('2024-10-28'),
    highestBid: 32.0,
    verified: false,
    grade: { name: 'Premium', color: 'bg-purple-100 text-purple-800' },
    image: {
      src: 'https://picsum.photos/seed/orangecrate/400/250',
      hint: 'orange crate',
    },
  },
  {
    id: '5',
    name: 'Local Mandarin',
    location: 'Umred, Nagpur',
    quantity: 8500,
    harvestDate: new Date('2024-10-25'),
    highestBid: 24.8,
    verified: false,
    grade: { name: 'Grade A', color: 'bg-amber-100 text-amber-800' },
    image: {
      src: 'https://picsum.photos/seed/orangehand/400/250',
      hint: 'orange hand',
    },
  },
  {
    id: '6',
    name: 'Mandarin Bulk',
    location: 'Kondhali, Nagpur',
    quantity: 15000,
    harvestDate: new Date('2024-10-24'),
    highestBid: 18.5,
    verified: false,
    grade: { name: 'Grade C', color: 'bg-red-100 text-red-800' },
    image: {
      src: 'https://picsum.photos/seed/orangefield/400/250',
      hint: 'orange field',
    },
  },
];

export const mockTags: Tag[] = ['Nagpur Mandarin', 'Grade A', 'Organic'];
