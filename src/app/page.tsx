'use client';

import { useState } from 'react';
import ConsoleFrame from '@/components/ConsoleFrame/ConsoleFrame';
import Header from '@/components/Header/Header';
import SideMenu from '@/components/SideMenu/SideMenu';
import GameScreen from '@/components/GameScreen/GameScreen';
import ControlPanel from '@/components/ControlPanel/ControlPanel';
import Footer from '@/components/Footer/Footer';
import { Sketch, ControlSettings } from '@/types';
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
    <main className="main">
      <ConsoleFrame>
        <Header toggleMenu={toggleMenu} />

        <div className="content">
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
