import React from 'react';
import { Sketch } from '@/types';
import styles from './SideMenu.module.css';

interface SideMenuProps {
  sketches: Sketch[];
  activeSketch: Sketch;
  setActiveSketch: (sketch: Sketch) => void;
  isOpen: boolean;
  toggleMenu: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({
  sketches,
  activeSketch,
  setActiveSketch,
  isOpen,
  toggleMenu,
}) => {
  return (
    <div className={`${styles.sideMenu} ${isOpen ? styles.open : ''}`}>
      <div className={styles.menuHeader}>
        <h2 className={styles.menuTitle}>SELECT GAME</h2>
        <button onClick={toggleMenu} className={styles.closeButton}>
          ×
        </button>
      </div>

      <ul className={styles.sketchList}>
        {sketches.map((sketch) => (
          <li
            key={sketch.id}
            className={`${styles.sketchItem} ${
              activeSketch.id === sketch.id ? styles.activeSketch : ''
            }`}
            onClick={() => {
              setActiveSketch(sketch);
              toggleMenu();
            }}
          >
            <div className={styles.sketchInfo}>
              <span className={styles.sketchTitle}>{sketch.title}</span>
              <span
                className={`${styles.difficultyLabel} ${
                  sketch.difficulty === 'Easy'
                    ? styles.easyDifficulty
                    : sketch.difficulty === 'Medium'
                    ? styles.mediumDifficulty
                    : styles.hardDifficulty
                }`}
              >
                {sketch.difficulty}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideMenu; 