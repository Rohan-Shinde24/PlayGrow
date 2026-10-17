export type CampaignLevel = {
  id: string;
  name: string;
  reward: number;
};

export type CampaignGame = {
  id: string;
  title: string;
  imageUrl: string;
  playStoreUrl: string;
  description: string;
  budget: number;
  maxPlayers: number;
  players: number;
  spent: number;
  levels: CampaignLevel[];
  createdAt: string;
};

export type PlayGrowUser = {
  email: string;
  companyName: string;
};
