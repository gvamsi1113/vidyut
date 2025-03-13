// src/components/sketches/WavePatterns.tsx
'use client';

import React from 'react';
import p5 from 'p5';
import { ControlSettings } from '@/types';
import P5Wrapper from './P5Wrapper';

const WavePatterns: React.FC<ControlSettings> = ({ speed = 5, size = 5 }) => {
  const createSketch = (p: p5) => {
    // Parameters
    const amplitude = 50 + size * 10; // How tall the waves are
    const waveSpeed = speed * 0.02; // How fast the waves move
    const waveCount = 3; // Number of wave layers
    const waveColors = [
      [0, 255, 255], // Cyan
      [255, 0, 255], // Magenta
      [255, 255, 0], // Yellow
    ];

    let time = 0;
    let waveSpacing = 0;

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      waveSpacing = p.height / (waveCount + 1);
    };

    p.draw = () => {
      p.background(0, 40); // Black with trail effect

      // Update time
      time += waveSpeed;

      // Draw each wave layer
      for (let i = 0; i < waveCount; i++) {
        drawWave(
          waveSpacing * (i + 1),
          waveColors[i],
          amplitude,
          0.01 + i * 0.005, // Frequency
          time + i * 2 // Offset
        );
      }
    };

    // Function to draw a single wave
    const drawWave = (
      baseY: number,
      color: number[],
      amp: number,
      freq: number,
      timeOffset: number
    ) => {
      p.stroke(color[0], color[1], color[2]);
      p.strokeWeight(3);
      p.noFill();

      p.beginShape();
      for (let x = 0; x < p.width; x += 5) {
        // Calculate y position with sine function
        const y =
          baseY +
          p.sin(x * freq + timeOffset) * amp +
          p.cos(x * freq * 0.5 + timeOffset * 1.5) * (amp * 0.5);

        p.vertex(x, y);
      }
      p.endShape();

      // Add glow effect
      p.drawingContext.shadowBlur = 15;
      p.drawingContext.shadowColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    };

    // Handle window resize
    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
      waveSpacing = p.height / (waveCount + 1);
    };
  };

  return <P5Wrapper sketch={createSketch} />;
};

export default WavePatterns;
