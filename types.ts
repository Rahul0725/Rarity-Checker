export enum RarityLevel {
  ULTRA_RARE = 'Ultra Rare',
  RARE = 'Rare',
  COMMON = 'Common',
  VERY_COMMON = 'Very Common'
}

export interface AnalysisResult {
  username: string;
  score: number;
  rarity: RarityLevel;
  tags: string[];
  reasons: string[];
  category: 'SHORT' | 'UNIT' | 'GAMING' | 'POETIC' | 'NUMBER' | 'STATUS' | 'GENERAL';
}

export interface PlatformAvailability {
  platform: string;
  status: 'Likely Taken' | 'Likely Available' | 'Unknown';
  probability: number; // 0 to 100
}

export interface Suggestion {
  username: string;
  type: string;
}
