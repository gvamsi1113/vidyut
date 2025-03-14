// src/components/sketches/P5Wrapper.tsx
'use client';

import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import styles from './P5Wrapper.module.css';

interface P5WrapperProps {
  sketch: (p: p5) => void;
}

const P5Wrapper: React.FC<P5WrapperProps> = ({ sketch }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);

  useEffect(() => {
    // Clean up any previous sketches
    if (p5Ref.current) {
      p5Ref.current.remove();
    }

    // Create new p5 instance
    if (containerRef.current) {
      p5Ref.current = new p5(sketch, containerRef.current);
    }

    // Function to handle resize events
    const handleResize = () => {
      if (p5Ref.current && p5Ref.current.windowResized) {
        p5Ref.current.windowResized();
      }
    };

    // Add resize observer to detect container size changes
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Cleanup on unmount
    return () => {
      if (p5Ref.current) {
        p5Ref.current.remove();
      }
      resizeObserver.disconnect();
    };
  }, [sketch]);

  return <div ref={containerRef} className={styles.p5Container} />;
};

export default P5Wrapper;
