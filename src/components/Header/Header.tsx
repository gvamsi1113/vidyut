'use client';

import React from 'react';
import styles from './Header.module.css';
import { useRouter } from 'next/navigation';
import { Sketch } from '@/types';

interface HeaderProps {
  toggleMenu: () => void;
  onStart: () => void;
  onPause: () => void;
  isPlaying: boolean;
  activeSketch: Sketch;
  onPrevious: () => void;
  onNext: () => void;
}

const Header: React.FC<HeaderProps> = ({
  toggleMenu,
  onStart,
  onPause,
  isPlaying,
  activeSketch,
  onPrevious,
  onNext,
}) => {
  const router = useRouter();

  const handleHomeClick = () => {
    router.push('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.titleContainer}>
        <h1 className={styles.title} onClick={handleHomeClick}>
          VIDYUT
        </h1>
        {activeSketch && <h2 className={styles.sketchTitle}>- {activeSketch.title}</h2>}
      </div>

      <div className={styles.buttonContainer}>
        <div className={styles.sketchButtons}>
          <button
            onClick={onPrevious}
            className={`${styles.navButton} ${styles.accentButton} ${styles.iconButton}`}
          >
            &lt;
          </button>

          <button onClick={toggleMenu} className={styles.navButton}>
            MENU
          </button>

          {!isPlaying ? (
            <button
              onClick={onStart}
              className={`${styles.navButton} ${styles.startButton} ${styles.iconButton}`}
            >
              &#9658;
            </button>
          ) : (
            <button
              onClick={onPause}
              className={`${styles.navButton} ${styles.pauseButton} ${styles.iconButton}`}
            >
              &#10074;&#10074;
            </button>
          )}

          <button
            onClick={onNext}
            className={`${styles.navButton} ${styles.accentButton} ${styles.iconButton}`}
          >
            &gt;
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
