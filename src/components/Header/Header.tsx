'use client';

import React from 'react';
import styles from './Header.module.css';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  toggleMenu: () => void;
  onStart: () => void;
  onReset: () => void;
  isPlaying: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleMenu, onStart, onReset, isPlaying }) => {
  const router = useRouter();

  const handleHomeClick = () => {
    router.push('/');
  };

  const handleContributeClick = () => {
    // Navigate to contribute page or open modal
  };

  const handleContactClick = () => {
    // Navigate to contact page or open modal
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.title} onClick={handleHomeClick}>
        VIDYUT
      </h1>

      <div className={styles.buttonContainer}>
        <div className={styles.homeButtons}>
          <button
            onClick={handleContributeClick}
            className={`${styles.navButton} ${styles.accentButton}`}
          >
            CONTRIBUTE
          </button>
          <button
            onClick={handleContactClick}
            className={`${styles.navButton} ${styles.accentButton}`}
          >
            CONTACT
          </button>
        </div>

        <div className={styles.sketchButtons}>
          <button onClick={toggleMenu} className={styles.navButton}>
            MENU
          </button>

          {!isPlaying ? (
            <button onClick={onStart} className={`${styles.navButton} ${styles.startButton}`}>
              START
            </button>
          ) : (
            <button onClick={onReset} className={`${styles.navButton} ${styles.resetButton}`}>
              RESET
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
