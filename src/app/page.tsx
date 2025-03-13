'use client';

import { useState } from 'react';
import ConsoleFrame from '@/components/ConsoleFrame';
import Header from '@/components/Header';
import SideMenu from '@/components/SideMenu';
import GameScreen from '@/components/GameScreen';
import ControlPanel from '@/components/ControlPanel';
import Footer from '@/components/Footer';
import { Sketch, ControlSettings } from '@/types';
import './retro-effects.css';

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
  const [controls, setControls] = useState<ControlSettings>({
    speed: 5,
    size: 5,
  });

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleStart = () => {
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 100);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-black">
      <ConsoleFrame>
        <Header toggleMenu={toggleMenu} />

        <div className="flex-1 relative">
          <SideMenu
            sketches={SKETCHES}
            activeSketch={activeSketch}
            setActiveSketch={setActiveSketch}
            isOpen={menuOpen}
            toggleMenu={toggleMenu}
          />

          <GameScreen activeSketch={activeSketch} controls={controls} isPlaying={isPlaying} />
        </div>

        <ControlPanel
          activeSketch={activeSketch}
          controls={controls}
          setControls={setControls}
          onStart={handleStart}
          onReset={handleReset}
        />
        <Footer />
      </ConsoleFrame>
    </main>
  );
}
