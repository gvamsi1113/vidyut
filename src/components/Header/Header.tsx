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
        <h1 className={styles.title}>RETRO CODE EXPLORER</h1>
      </div>
      
      <div className={styles.rightSection}>
        <button
          onClick={onStart}
          className={styles.startButton}
          disabled={isPlaying}
        >
          START
        </button>
        <button
          onClick={onReset}
          className={styles.resetButton}
        >
          RESET
        </button>

        <h1 className={styles.title}>
            VIDYUT
        </h1>

      </div>
        
    </header>
  );
};

export default Header; 