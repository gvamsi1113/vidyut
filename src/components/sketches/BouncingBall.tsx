// src/components/sketches/BouncingBall.tsx
'use client';

import React from 'react';
import p5 from 'p5';
import { ControlSettings } from '@/types';
import P5Wrapper from './P5Wrapper';

const BouncingBall: React.FC<ControlSettings> = ({ speed = 5, size = 5 }) => {
  const createSketch = (p: p5) => {
    const ball = {
      x: 100,
      y: 100,
      size: 20 + size * 5, // Base size + control value
      speedX: 2 + speed / 2, // Base speed + control value
      speedY: 2 + speed / 2,
      color: [255, 50, 200],
    };

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
    };

    p.draw = () => {
      p.background(0, 20); // Black with slight trail effect

      // Draw ball
      p.noStroke();
      p.fill(ball.color[0], ball.color[1], ball.color[2]);
      p.ellipse(ball.x, ball.y, ball.size);

      // Add glow effect
      p.drawingContext.shadowBlur = 15;
      p.drawingContext.shadowColor = `rgb(${ball.color[0]}, ${ball.color[1]}, ${ball.color[2]})`;

      // Update position
      ball.x += ball.speedX;
      ball.y += ball.speedY;

      // Bounce off walls
      if (ball.x > p.width - ball.size / 2 || ball.x < ball.size / 2) {
        ball.speedX *= -1;
        // Change color on bounce
        ball.color = [p.random(100, 255), p.random(50, 200), p.random(100, 255)];
      }

      if (ball.y > p.height - ball.size / 2 || ball.y < ball.size / 2) {
        ball.speedY *= -1;
        // Change color on bounce
        ball.color = [p.random(100, 255), p.random(50, 200), p.random(100, 255)];
      }
    };

    // Handle window resize
    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
  };

  return <P5Wrapper sketch={createSketch} />;
};

export default BouncingBall;
