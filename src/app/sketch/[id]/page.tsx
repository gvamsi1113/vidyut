'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header/Header';
import GameScreen from '@/components/GameScreen/GameScreen';
import Footer from '@/components/Footer/Footer';
import { Sketch } from '@/types';
import styles from './SketchPage.module.css';

// Sample sketch data (same as in homepage)
const SKETCHES: Sketch[] = [
  { id: 'bouncing-ball', title: 'Bouncing Ball', difficulty: 'Easy' },
  { id: 'wave-patterns', title: 'Wave Patterns', difficulty: 'Medium' },
  { id: 'particle-system', title: 'Particle System', difficulty: 'Medium' },
  { id: 'pendulum', title: 'Pendulum Physics', difficulty: 'Hard' },
];

export default function SketchPage() {
  const router = useRouter();
  const params = useParams();
  const [activeSketch, setActiveSketch] = useState<Sketch | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Find the sketch by ID from the URL parameter
    const sketchId = params.id as string;
    const sketch = SKETCHES.find((s) => s.id === sketchId);

    if (sketch) {
      setActiveSketch(sketch);
    } else {
      // Redirect to homepage if sketch not found
      router.push('/');
    }
  }, [params, router]);

  const handleStart = () => {
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 100);
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  if (!activeSketch) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <main className={styles.sketchPage}>
      <Header
        toggleMenu={handleBackToHome}
        onStart={handleStart}
        onReset={handleReset}
        isPlaying={isPlaying}
      />

      <div className={styles.content}>
        <GameScreen activeSketch={activeSketch} isPlaying={isPlaying} />
      </div>

      <Footer />
    </main>
  );
}
