'use client';

import { Sketch } from '@/types';
// import BackgroundSketch from '@/components/HomePage/BackgroundSketch';
import SketchGallery from '@/components/HomePage/SketchGallery';
import styles from './page.module.css';
import Link from 'next/link';

// Sample sketch data
const SKETCHES: Sketch[] = [
  { id: 'bouncing-ball', title: 'Bouncing Ball', difficulty: 'Easy' },
  { id: 'wave-patterns', title: 'Wave Patterns', difficulty: 'Medium' },
  { id: 'particle-system', title: 'Particle System', difficulty: 'Medium' },
  { id: 'pendulum', title: 'Pendulum Physics', difficulty: 'Hard' },
];

export default function Home() {
  return (
    <main className={styles.homepage}>
      {/* <div className={styles.backgroundContainer}><BackgroundSketch /></div> */}

      {/* Global CRT effects */}
      <div className={styles.scanLines}></div>

      <div className={styles.content}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>VIDYUT</h1>
          <p className={styles.tagline}>RETRO GAMES THAT SPARK PHYSICS LEARNING!</p>
        </div>

        <div className={styles.navigationLinks}>
          <button className={`${styles.navButton} ${styles.accentButton}`}>CONTRIBUTE</button>
          {/* <button className={`${styles.navButton} ${styles.tea}`}>DONATE</button> */}
          <button className={`${styles.navButton} ${styles.accentButton}`}>CONTACT</button>
        </div>

        <div className={styles.sketchGalleryContainer}>
          <SketchGallery sketches={SKETCHES} />
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.copyright}>© 2025 VIDYUT. All rights reserved.</p>
          <div className={styles.footerRight}>
            <Link href="#" className={styles.footerLink}>
              GITHUB
            </Link>
            <Link href="#" className={styles.footerLink}>
              DISCORD
            </Link>
            <Link href="#" className={styles.footerLink}>
              TWITTER
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
