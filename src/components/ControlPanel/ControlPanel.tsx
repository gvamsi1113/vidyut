import React, { useState, useEffect } from 'react';
import { Sketch, ControlSettings } from '@/types';
import styles from './ControlPanel.module.css';

interface ControlLabels {
  speed: string;
  size: string;
}

interface ControlPanelProps {
  activeSketch: Sketch;
  controls: ControlSettings;
  setControls: (controls: ControlSettings) => void;
  onStart: () => void;
  onReset: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  activeSketch,
  controls,
  setControls,
  onStart,
  onReset,
}) => {
  const [controlLabels, setControlLabels] = useState<ControlLabels>({
    speed: 'SPEED',
    size: 'SIZE',
  });

  // Update control labels based on active sketch
  useEffect(() => {
    switch (activeSketch.id) {
      case 'bouncing-ball':
        setControlLabels({
          speed: 'SPEED',
          size: 'BALL SIZE',
        });
        break;
      case 'wave-patterns':
        setControlLabels({
          speed: 'WAVE SPEED',
          size: 'AMPLITUDE',
        });
        break;
      case 'particle-system':
        setControlLabels({
          speed: 'PARTICLE SPEED',
          size: 'PARTICLE COUNT',
        });
        break;
      case 'pendulum':
        setControlLabels({
          speed: 'GRAVITY',
          size: 'LENGTH',
        });
        break;
      default:
        setControlLabels({
          speed: 'SPEED',
          size: 'SIZE',
        });
    }
  }, [activeSketch]);

  // Handle control changes
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setControls({
      ...controls,
      speed: parseInt(e.target.value),
    });
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setControls({
      ...controls,
      size: parseInt(e.target.value),
    });
  };

  return (
    <div className={styles.controlPanel}>
      <div className={styles.controlsContainer}>
        <h3 className={styles.controlsTitle}>{activeSketch.title} CONTROLS</h3>
        <div className={styles.sliderContainer}>
          <div className={styles.sliderGroup}>
            <label className={styles.sliderLabel}>
              {controlLabels.speed}: {controls.speed}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={controls.speed}
              onChange={handleSpeedChange}
              className={styles.speedSlider}
            />
          </div>
          <div className={styles.sliderGroup}>
            <label className={styles.sliderLabel}>
              {controlLabels.size}: {controls.size}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={controls.size}
              onChange={handleSizeChange}
              className={styles.sizeSlider}
            />
          </div>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button
          onClick={onStart}
          className={styles.startButton}
        >
          START
        </button>
        <button
          onClick={onReset}
          className={styles.resetButton}
        >
          RESET
        </button>
      </div>
    </div>
  );
};

export default ControlPanel; 