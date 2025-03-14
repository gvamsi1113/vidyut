'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Sketch, ControlSettings } from '@/types';
import styles from './GameScreen.module.css';

// Dynamically import the sketches to avoid SSR issues with p5.js
const BouncingBall = dynamic(() => import('../sketches/BouncingBall'), { ssr: false });
const WavePatterns = dynamic(() => import('../sketches/WavePatterns'), { ssr: false });
const ParticleSystem = dynamic(() => import('../sketches/ParticleSystem'), { ssr: false });
const Pendulum = dynamic(() => import('../sketches/Pendulum'), { ssr: false });

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
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>
            Sketch &quot;{activeSketch.title}&quot; not implemented yet!
          </p>
        </div>
      );
    }

    return <SketchComponent {...controls} />;
  };

  return (
    <div className={styles.gameScreen}>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <p className={styles.loadingText}>LOADING {activeSketch.title}...</p>
          <div className={styles.loadingBarContainer}>
            <div className={styles.loadingProgress}></div>
          </div>
          <p className={`${styles.loadingText} ${styles.blink}`}>PLEASE WAIT</p>
        </div>
      ) : !isPlaying ? (
        <div className={styles.readyContainer}>
          <p className={styles.readyText}>{activeSketch.title} READY</p>
          <p className={`${styles.readyText} ${styles.blink}`}>PRESS START TO PLAY</p>
        </div>
      ) : (
        renderSketch()
      )}
    </div>
  );
};

export default GameScreen; 