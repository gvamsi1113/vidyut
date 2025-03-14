'use client';

import { useState } from 'react';
import Header from '@/components/Header/Header';
import SideMenu from '@/components/SideMenu/SideMenu';
import GameScreen from '@/components/GameScreen/GameScreen';
import Footer from '@/components/Footer/Footer';
import { Sketch } from '@/types';
import './retro-effects.css';
import './globals.css';

// Sample sketch data
const SKETCHES: Sketch[] = [
  { id: 'bouncing-ball', title: 'Bouncing Ball', difficulty: 'Easy' },
  { id: 'wave-patterns', title: 'Wave Patterns', difficulty: 'Medium' },
  { id: 'particle-system', title: 'Particle System', difficulty: 'Medium' },
  { id: 'pendulum', title: 'Pendulum Physics', difficulty: 'Hard' },
];

export default function Home() {
  const [activeSketch, setActiveSketch] = useState<Sketch>(SKETCHES[0]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleStart = () => {
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 100);
  };

  return (
    <main className="main">
        <Header toggleMenu={toggleMenu} onStart={handleStart} onReset={handleReset} isPlaying={isPlaying} />

        <div className="content">
          <SideMenu
            sketches={SKETCHES}
            activeSketch={activeSketch}
            setActiveSketch={setActiveSketch}
            isOpen={menuOpen}
            toggleMenu={toggleMenu}
          />

          <GameScreen activeSketch={activeSketch} isPlaying={isPlaying} />
        </div>

        <Footer />
    </main>
  );
}
