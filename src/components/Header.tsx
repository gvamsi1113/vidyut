// src/components/Header.tsx
import React from 'react';

interface HeaderProps {
  toggleMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleMenu }) => {
  return (
    <header className="flex justify-between items-center bg-zinc-900 p-3 rounded-t-md border-b-2 border-zinc-700">
      <button
        onClick={toggleMenu}
        className="border-2 border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-black py-1 px-3 rounded transition-colors duration-200 font-pixel text-sm"
      >
        ≡
      </button>

      <h1
        className="font-pixel text-2xl text-center text-yellow-300 tracking-wider"
        style={{ textShadow: '2px 2px 0 #ff00ff, -2px -2px 0 #00ffff' }}
      >
        VIDYUT
      </h1>

      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-red-600 rounded-full led-blink"></div>
        <span className="font-pixel text-xs text-gray-400">POWER</span>
      </div>
    </header>
  );
};

export default Header;
