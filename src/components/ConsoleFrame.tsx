// src/components/ConsoleFrame.tsx
import React from 'react';

interface ConsoleFrameProps {
  children: React.ReactNode;
}

const ConsoleFrame: React.FC<ConsoleFrameProps> = ({ children }) => {
  return (
    <div className="bg-zinc-800 border-8 border-zinc-700 rounded-lg shadow-lg shadow-cyan-500/20 p-5 w-[90%] max-w-6xl h-[90vh] flex flex-col relative overflow-hidden">
      {children}
    </div>
  );
};

export default ConsoleFrame;
