// src/types/index.ts
export interface Sketch {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description?: string;
}

export interface ControlSettings {
  speed: number;
  size: number;
  [key: string]: number;
}
