import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <p className={styles.footerText}>
        © {new Date().getFullYear()} VIDYUT - INTERACTIVE CODE EXPLORER
      </p>
    </footer>
  );
};

export default Footer; 