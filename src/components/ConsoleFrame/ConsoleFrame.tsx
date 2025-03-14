import React from 'react';
import styles from './ConsoleFrame.module.css';

interface ConsoleFrameProps {
  children: React.ReactNode;
}

const ConsoleFrame: React.FC<ConsoleFrameProps> = ({ children }) => {
  return (
    <div className={styles.consoleFrame}>
      {children}
    </div>
  );
};

export default ConsoleFrame; 