export type UserPlan = 'free' | 'solo' | 'studio' | 'brand';

export interface User {
  id: string;
  email: string;
  plan: UserPlan;
  generationsUsed: number;
  dailyGenerationsUsed: number;
  lastGenerationDate: string;
}