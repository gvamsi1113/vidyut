// src/components/GameScreen.tsx
'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Sketch, ControlSettings } from '@/types';

// Dynamically import the sketches to avoid SSR issues with p5.js
const BouncingBall = dynamic(() => import('./sketches/BouncingBall'), { ssr: false });

const WavePatterns = dynamic(() => import('./sketches/WavePatterns'), { ssr: false });

const ParticleSystem = dynamic(() => import('./sketches/ParticleSystem'), { ssr: false });

const Pendulum = dynamic(() => import('./sketches/Pendulum'), { ssr: false });

// Map sketch IDs to their components
const SKETCH_COMPONENTS: Record<string, React.ComponentType<ControlSettings>> = {
  'bouncing-ball': BouncingBall,
  'wave-patterns': WavePatterns,
  'particle-system': ParticleSystem,
  pendulum: Pendulum,
};

interface GameScreenProps {
  activeSketch: Sketch;
  controls: ControlSettings;
  isPlaying: boolean;
}

const GameScreen: React.FC<GameScreenProps> = ({ activeSketch, controls, isPlaying }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Handle sketch loading
  useEffect(() => {
    setIsLoading(true);

    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [activeSketch]);

  // Render the active sketch
  const renderSketch = () => {
    const SketchComponent = SKETCH_COMPONENTS[activeSketch.id];

    if (!SketchComponent) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="font-pixel text-red-400 text-center p-4">
            Sketch &quot;{activeSketch.title}&quot; not implemented yet!
          </p>
        </div>
      );
    }

    return <SketchComponent {...controls} />;
  };

  return (
    <div className="flex-1 bg-black border-2 border-zinc-700 rounded relative scan-lines overflow-hidden">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <p className="font-pixel text-green-400 mb-4">LOADING {activeSketch.title}...</p>
          <div className="w-48 h-5 border-2 border-green-400 relative overflow-hidden mb-4">
            <div className="loading-progress bg-green-400"></div>
          </div>
          <p className="font-pixel text-green-400 blink">PLEASE WAIT</p>
        </div>
      ) : !isPlaying ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <p className="font-pixel text-green-400 mb-4">{activeSketch.title} READY</p>
          <p className="font-pixel text-green-400 blink">PRESS START TO PLAY</p>
        </div>
      ) : (
        renderSketch()
      )}
    </div>
  );
};

export default GameScreen;
