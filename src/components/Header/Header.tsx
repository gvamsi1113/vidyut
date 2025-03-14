'use client';

import React from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  toggleMenu: () => void;
  onStart: () => void;
  onReset: () => void;
  isPlaying: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleMenu, onStart, onReset, isPlaying }) => {
  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <button onClick={toggleMenu} className={styles.menuButton}>
          MENU
        </button>
      </div>
      <h1 className={styles.title}>VIDYUT - PHYSICS CONCEPTS in RETRO</h1>

      <div className={styles.rightSection}>
        {!isPlaying ? (
          <button onClick={onStart} className={styles.startButton}>
            START
          </button>
        ) : (
          <button onClick={onReset} className={styles.resetButton}>
            RESET
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
