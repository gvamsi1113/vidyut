// src/components/ControlPanel.tsx
import React, { useState, useEffect } from 'react';
import { Sketch, ControlSettings } from '@/types';

interface ControlPanelProps {
  activeSketch: Sketch;
  controls: ControlSettings;
  setControls: (controls: ControlSettings) => void;
  onStart: () => void;
  onReset: () => void;
}

interface ControlLabels {
  speed: string;
  size: string;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  activeSketch,
  controls,
  setControls,
  onStart,
  onReset,
}) => {
  const [controlLabels, setControlLabels] = useState<ControlLabels>({
    speed: 'SPEED',
    size: 'SIZE',
  });

  // Update control labels based on active sketch
  useEffect(() => {
    switch (activeSketch.id) {
      case 'bouncing-ball':
        setControlLabels({
          speed: 'SPEED',
          size: 'BALL SIZE',
        });
        break;
      case 'wave-patterns':
        setControlLabels({
          speed: 'WAVE SPEED',
          size: 'AMPLITUDE',
        });
        break;
      case 'particle-system':
        setControlLabels({
          speed: 'PARTICLE SPEED',
          size: 'PARTICLE COUNT',
        });
        break;
      case 'pendulum':
        setControlLabels({
          speed: 'GRAVITY',
          size: 'LENGTH',
        });
        break;
      default:
        setControlLabels({
          speed: 'SPEED',
          size: 'SIZE',
        });
    }
  }, [activeSketch]);

  // Handle control changes
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setControls({
      ...controls,
      speed: parseInt(e.target.value),
    });
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setControls({
      ...controls,
      size: parseInt(e.target.value),
    });
  };

  return (
    <div className="bg-zinc-800 p-4 border-t-2 border-zinc-700 flex justify-between items-center flex-wrap gap-4">
      <div className="w-full md:w-auto">
        <h3 className="font-pixel text-yellow-300 text-xs mb-2">{activeSketch.title} CONTROLS</h3>
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col gap-1">
            <label className="font-pixel text-[10px] text-gray-300">
              {controlLabels.speed}: {controls.speed}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={controls.speed}
              onChange={handleSpeedChange}
              className="w-32 accent-pink-600"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-pixel text-[10px] text-gray-300">
              {controlLabels.size}: {controls.size}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={controls.size}
              onChange={handleSizeChange}
              className="w-32 accent-cyan-500"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onStart}
          className="bg-pink-600 hover:bg-pink-700 text-white font-pixel py-2 px-4 rounded text-sm transition-colors duration-200"
        >
          START
        </button>
        <button
          onClick={onReset}
          className="bg-cyan-500 hover:bg-cyan-600 text-black font-pixel py-2 px-4 rounded text-sm transition-colors duration-200"
        >
          RESET
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
