// src/components/sketches/P5Wrapper.tsx
'use client';

import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

interface P5WrapperProps {
  sketch: (p: p5) => void;
  className?: string;
}

const P5Wrapper: React.FC<P5WrapperProps> = ({ sketch, className }) => {
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sketchRef.current) return;

    // Create p5 instance
    const p5Instance = new p5(sketch, sketchRef.current);

    // Cleanup function
    return () => {
      p5Instance.remove();
    };
  }, [sketch]);

  return <div ref={sketchRef} className={className || 'w-full h-full'} />;
};

export default P5Wrapper;
