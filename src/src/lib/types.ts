export type HarvestBatch = {
  id: string;
  cropType: string;
  quantity: number;
  harvestDate: Date;
  farmLocation: string;
  status: 'Listed' | 'Sold' | 'Completed';
  image: {
    src: string;
    hint: string;
  };
  bids?: number;
  minBid?: number;
  finalPrice?: number;
  blockchainTransaction?: string;
};

export type CustomerHarvestBatch = {
  id: string;
  name: string;
  location: string;
  quantity: number;
  harvestDate: Date;
  highestBid: number;
  verified: boolean;
  timeLeft?: string;
  grade: {
    name: string;
    color: string;
  };
  image: {
    src: string;
    hint: string;
  };
};

export type Tag = string;
