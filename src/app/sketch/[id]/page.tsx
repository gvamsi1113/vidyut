'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header/Header';
import GameScreen from '@/components/GameScreen/GameScreen';
import { Sketch } from '@/types';
import styles from './SketchPage.module.css';

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
    const sketchId = params.id as string;
    const sketch = SKETCHES.find((s) => s.id === sketchId);

    if (sketch) {
      setActiveSketch(sketch);
    } else {
      router.push('/');
    }
  }, [params, router]);

  const handleStart = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  const handlePrevious = () => {
    if (!activeSketch) return;

    const currentIndex = SKETCHES.findIndex((s) => s.id === activeSketch.id);
    // If first sketch, go to the last sketch; otherwise go to previous
    const prevIndex = currentIndex <= 0 ? SKETCHES.length - 1 : currentIndex - 1;
    const prevSketch = SKETCHES[prevIndex];
    router.push(`/sketch/${prevSketch.id}`);
  };

  const handleNext = () => {
    if (!activeSketch) return;

    const currentIndex = SKETCHES.findIndex((s) => s.id === activeSketch.id);
    // If last sketch, go to the first sketch; otherwise go to next
    const nextIndex = currentIndex >= SKETCHES.length - 1 ? 0 : currentIndex + 1;
    const nextSketch = SKETCHES[nextIndex];
    router.push(`/sketch/${nextSketch.id}`);
  };

  if (!activeSketch) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <main className={styles.sketchPage}>
      <Header
        toggleMenu={handleBackToHome}
        onStart={handleStart}
        onPause={handlePause}
        isPlaying={isPlaying}
        activeSketch={activeSketch}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />

      <div className={styles.content}>
        <GameScreen activeSketch={activeSketch} isPlaying={isPlaying} />
      </div>
    </main>
  );
}
