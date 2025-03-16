'use client';

import React, { useEffect, useState } from 'react';
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
  isPlaying: boolean;
}

const GameScreen: React.FC<GameScreenProps> = ({ activeSketch, isPlaying }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasStartedOnce, setHasStartedOnce] = useState(false);

  // Handle sketch loading
  useEffect(() => {
    setIsLoading(true);
    setHasStartedOnce(false); // Reset when sketch changes

    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [activeSketch]);

  // Track if sketch has been started at least once
  useEffect(() => {
    if (isPlaying && !hasStartedOnce) {
      setHasStartedOnce(true);
    }
  }, [isPlaying, hasStartedOnce]);

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

    return <SketchComponent isPlaying={isPlaying} />;
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
      ) : hasStartedOnce || isPlaying ? (
        // If sketch has started at least once OR is currently playing, show the sketch
        renderSketch()
      ) : (
        // Otherwise show the ready container
        <div className={styles.readyContainer}>
          <p className={styles.readyText}>{activeSketch.title} READY</p>
          <p className={`${styles.readyText} ${styles.blink}`}>PRESS START TO PLAY</p>
        </div>
      )}
    </div>
  );
};

export default GameScreen;
