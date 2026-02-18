export interface AIModel {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
  region: string;
  country: string;
  gender: 'Male' | 'Female';
  age?: number;
  source?: 'library' | 'user-saved';
}
