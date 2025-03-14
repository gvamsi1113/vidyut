// src/components/sketches/BouncingBall.tsx - Final fixed version
'use client';

import React from 'react';
import { ControlSettings } from '@/types';
import P5Wrapper from './P5Wrapper/P5Wrapper';
import { 
  createSketch, 
  createSliderControl, 
  createToggleControl,
  addGlowEffect,
  SketchContext
} from '@/utils/p5SketchSystem';

interface Ball {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: number[];
}

const BouncingBall: React.FC<ControlSettings> = ({ speed = 5, size = 5 }) => {
  const sketch = createSketch(
    { 
      speed, 
      size,
      controlPanel: {
        theme: 'retro',
        position: 'bottom-left',
        title: 'BOUNCING BALL'
      }
    },
    // Setup function
    (ctx: SketchContext) => {
      const { p, controlPanel, settings } = ctx;
      
      // Initial ball state
      const ball: Ball = {
        x: p.width / 2,
        y: p.height / 2,
        size: 20 + (settings?.size ?? 5) * 5,
        speedX: 2 + (settings?.speed ?? 5) / 2,
        speedY: 2 + (settings?.speed ?? 5) / 2,
        color: [255, 50, 200],
      };
      
      // Register ball in context
      ctx.registerControl('ball', ball);
      
      // Create UI controls
      if (controlPanel) {
        // Speed control
        const speedControl = createSliderControl(
          p,
          controlPanel,
          'SPEED',
          1,
          10,
          ball.speedX,
          0.1,
          val => val.toFixed(1),
          value => {
            ball.speedX = value * Math.sign(ball.speedX);
            ball.speedY = value * Math.sign(ball.speedY);
          }
        );
        
        // Size control
        const sizeControl = createSliderControl(
          p,
          controlPanel,
          'BALL SIZE',
          10,
          100,
          ball.size,
          1,
          val => val.toFixed(0),
          value => {
            ball.size = value;
          }
        );
        
        // Toggle button
        const toggleControls = createToggleControl(
          p,
          controlPanel,
          'HIDE CONTROLS',
          'SHOW CONTROLS',
          true,
          [
            speedControl.slider,
            speedControl.labelEl,
            sizeControl.slider,
            sizeControl.labelEl
          ]
        );
        
        // Register controls for access in draw
        ctx.registerControl('speedControl', speedControl);
        ctx.registerControl('sizeControl', sizeControl);
        ctx.registerControl('toggleControls', toggleControls);
      }
    },
    
    // Draw function
    (ctx: SketchContext) => {
      const { p } = ctx;
      const ball = ctx.getControl<Ball>('ball');
      
      if (!ball) return;
      
      // Background with trail effect
      p.background(0, 20);
      
      // Draw ball
      p.noStroke();
      p.fill(ball.color[0], ball.color[1], ball.color[2]);
      p.ellipse(ball.x, ball.y, ball.size);
      
      // Add glow effect
      addGlowEffect(p, ball.color);
      
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
      
      // Display info
      p.fill(255);
      p.noStroke();
      p.textSize(12);
      p.textAlign(p.LEFT);
      p.text(`Speed: ${Math.abs(ball.speedX).toFixed(1)}`, 20, 30);
      p.text(`Size: ${ball.size.toFixed(0)}`, 20, 50);
      p.text(`FPS: ${p.frameRate().toFixed(0)}`, 20, 70);
    }
  );

  return <P5Wrapper sketch={sketch} />;
};

export default BouncingBall;