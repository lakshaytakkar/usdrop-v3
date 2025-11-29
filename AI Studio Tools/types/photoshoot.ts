
export interface PhotoshootConcept {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

export interface GeneratedPhotoshootImage {
  id: string;
  conceptId: string;
  url?: string;
  status: 'pending' | 'done' | 'error';
  error?: string;
}
