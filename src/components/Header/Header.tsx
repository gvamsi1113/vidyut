import React from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  toggleMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleMenu }) => {
  return (
    <header className={styles.header}>
      <button
        onClick={toggleMenu}
        className={styles.menuButton}
      >
        ≡
      </button>

      <h1 className={styles.title}>
        VIDYUT
      </h1>

      <div className={styles.powerIndicator}>
        <div className={styles.powerLed}></div>
        <span className={styles.powerLabel}>POWER</span>
      </div>
    </header>
  );
};

export default Header; 