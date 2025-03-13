// src/components/SideMenu.tsx
import React from 'react';
import { Sketch } from '@/types';

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
    <div
      className={`absolute top-0 left-0 h-full w-64 bg-black/90 z-10 transition-transform duration-300 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } p-4 shadow-lg`}
    >
      <div className="flex justify-between items-center mb-6 pb-2 border-b-2 border-cyan-500">
        <h2 className="font-pixel text-sm text-cyan-500">SELECT GAME</h2>
        <button onClick={toggleMenu} className="text-gray-400 hover:text-white text-xl">
          ×
        </button>
      </div>

      <ul className="space-y-3">
        {sketches.map((sketch) => (
          <li
            key={sketch.id}
            className={`p-3 border-2 ${
              activeSketch.id === sketch.id
                ? 'border-pink-600 bg-pink-600/20'
                : 'border-zinc-700 hover:border-gray-500'
            } rounded cursor-pointer transition-colors duration-200`}
            onClick={() => {
              setActiveSketch(sketch);
              toggleMenu();
            }}
          >
            <div className="flex justify-between items-center">
              <span className="font-pixel text-xs text-white">{sketch.title}</span>
              <span
                className={`font-pixel text-[10px] ${
                  sketch.difficulty === 'Easy'
                    ? 'text-green-400'
                    : sketch.difficulty === 'Medium'
                      ? 'text-yellow-400'
                      : 'text-red-400'
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
