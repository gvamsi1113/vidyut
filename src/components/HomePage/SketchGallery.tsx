'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { Sketch } from '@/types';
import styles from '@/app/page.module.css';

interface SketchGalleryProps {
  sketches: Sketch[];
}

const SketchGallery: React.FC<SketchGalleryProps> = ({ sketches }) => {
  const galleryRef = useRef<HTMLDivElement>(null);
  
  // Handle horizontal scrolling with wheel
  const handleWheel = (e: React.WheelEvent) => {
    if (galleryRef.current) {
      galleryRef.current.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  };
  
  return (
    <div 
      className={styles.sketchGallery} 
      ref={galleryRef}
      onWheel={handleWheel}
    >
      {sketches.map((sketch) => (
        <Link href={`/sketch/${sketch.id}`} key={sketch.id}>
          <div className={styles.sketchCard}>
            <div className={styles.sketchPreview}>
              {/* Preview image based on sketch type */}
              {sketch.id === 'bouncing-ball' && (
                <div className={styles.previewBall}></div>
              )}
              {sketch.id === 'wave-patterns' && (
                <div className={styles.previewWave}></div>
              )}
              {sketch.id === 'particle-system' && (
                <div className={styles.previewParticle}></div>
              )}
              {sketch.id === 'pendulum' && (
                <div className={styles.previewPendulum}></div>
              )}
            </div>
            <h3 className={styles.sketchTitle}>{sketch.title}</h3>
            {/* <span className={`${styles.difficultyBadge} ${styles[`difficulty${sketch.difficulty}`]}`}>
              {sketch.difficulty}
            </span> */}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SketchGallery; 