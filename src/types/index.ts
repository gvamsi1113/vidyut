// src/types/index.ts - Final fixed TypeScript types
import { ControlPanelOptions } from '@/utils/p5SketchSystem';

export interface Sketch {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description?: string;
}

export interface ControlSettings {
  // Controls for all sketch components
  speed?: number; // Generic speed control (0-10)
  size?: number; // Generic size control (0-10)
  isPlaying?: boolean; // Whether the sketch is playing
}

// Sketch initialization options - separate interface
export interface SketchOptions {
  // Pass-through of ControlSettings props
  speed?: number;
  size?: number;

  // Additional sketch options
  width?: number;
  height?: number;
  controlPanel?: ControlPanelOptions;
}

// Interface for sketch information
export interface SketchInfo {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<ControlSettings>;
  defaultControls?: ControlSettings;
}
