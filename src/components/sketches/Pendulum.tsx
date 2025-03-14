'use client';

import React, { useMemo } from 'react';
import p5 from 'p5';
import { ControlSettings } from '@/types';
import P5Wrapper from './P5Wrapper/P5Wrapper';
import { 
  createSketch, 
  createSliderControl, 
  createToggleControl,
  addGlowEffect,
  createTrailManager,
  SketchContext
} from '@/utils/p5SketchSystem';

interface PendulumState {
  gravity: number;
  length: number;
  bobSize: number;
  dampening: number;
  angle: number;
  angleVelocity: number;
  angleAcceleration: number;
  origin: p5.Vector;
  color: number[];
}

const Pendulum: React.FC<ControlSettings> = ({ speed = 5, size = 5 }) => {
  const sketch = useMemo(() => {
    return createSketch(
      { 
        speed, 
        size,
        controlPanel: {
          theme: 'retro',
          position: 'bottom-left',
          title: 'PENDULUM PHYSICS'
        }
      },
      // Setup function
      (ctx: SketchContext) => {
        const { p, controlPanel, settings } = ctx;
        
        // Create initial pendulum state
        const pendulum: PendulumState = {
          gravity: 0.4 + (settings?.speed ?? 5) * 0.05,
          length: 100 + (settings?.size ?? 5) * 10,
          bobSize: 20 + (settings?.size ?? 5) * 2,
          dampening: 0.995,
          angle: p.PI / 4,
          angleVelocity: 0,
          angleAcceleration: 0,
          origin: p.createVector(p.width / 2, p.height / 4),
          color: [255, 50, 150]
        };
        
        // Create trail manager
        const trail = createTrailManager<p5.Vector>(50);
        
        // Store in context
        ctx.registerControl('pendulum', pendulum);
        ctx.registerControl('trail', trail);
        
        // Create UI controls
        if (controlPanel) {
          // Gravity control
          const gravityControl = createSliderControl(
            p,
            controlPanel,
            'GRAVITY',
            0.1,
            1.5,
            pendulum.gravity,
            0.05,
            val => val.toFixed(2),
            value => {
              pendulum.gravity = value;
            }
          );
          
          // Length control
          const lengthControl = createSliderControl(
            p,
            controlPanel,
            'LENGTH',
            50,
            300,
            pendulum.length,
            10,
            val => val.toFixed(0),
            value => {
              pendulum.length = value;
              pendulum.bobSize = pendulum.length * 0.15;
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
              gravityControl.slider,
              gravityControl.labelEl,
              lengthControl.slider,
              lengthControl.labelEl
            ]
          );
          
          // Register controls
          ctx.registerControl('gravityControl', gravityControl);
          ctx.registerControl('lengthControl', lengthControl);
          ctx.registerControl('toggleControls', toggleControls);
        }
      },
      
      // Draw function
      (ctx: SketchContext) => {
        const { p } = ctx;
        
        const pendulum = ctx.getControl<PendulumState>('pendulum');
        const trail = ctx.getControl<{
          add: (point: p5.Vector) => void;
          getPoints: () => p5.Vector[];
        }>('trail');
        
        if (!pendulum || !trail) return;
        
        // Background with trail effect
        p.background(0, 40);
        
        // Physics calculations
        pendulum.angleAcceleration = 
          ((-1 * pendulum.gravity) / pendulum.length) * p.sin(pendulum.angle);
        pendulum.angleVelocity += pendulum.angleAcceleration;
        pendulum.angleVelocity *= pendulum.dampening;
        pendulum.angle += pendulum.angleVelocity;
        
        // Calculate bob position
        const bobX = pendulum.origin.x + pendulum.length * p.sin(pendulum.angle);
        const bobY = pendulum.origin.y + pendulum.length * p.cos(pendulum.angle);
        
        // Add to trail
        trail.add(p.createVector(bobX, bobY));
        
        // Draw trail
        p.noFill();
        p.beginShape();
        const points = trail.getPoints();
        for (let i = 0; i < points.length; i++) {
          const alpha = p.map(i, 0, points.length, 50, 255);
          p.stroke(255, 50, 150, alpha);
          p.strokeWeight(1);
          p.vertex(points[i].x, points[i].y);
        }
        p.endShape();
        
        // Draw pendulum arm
        p.stroke(200);
        p.strokeWeight(2);
        p.line(pendulum.origin.x, pendulum.origin.y, bobX, bobY);
        
        // Draw origin point
        p.fill(200);
        p.noStroke();
        p.ellipse(pendulum.origin.x, pendulum.origin.y, 10, 10);
        
        // Draw pendulum bob
        p.fill(pendulum.color[0], pendulum.color[1], pendulum.color[2]);
        p.noStroke();
        p.ellipse(bobX, bobY, pendulum.bobSize, pendulum.bobSize);
        
        // Add glow effect
        addGlowEffect(p, pendulum.color);
        
        // Display physics info
        p.fill(255);
        p.noStroke();
        p.textSize(12);
        p.textAlign(p.LEFT);
        p.text(`Angle: ${p.nf(pendulum.angle, 1, 2)}`, 20, 30);
        p.text(`Velocity: ${p.nf(pendulum.angleVelocity, 1, 4)}`, 20, 50);
        p.text(`Gravity: ${p.nf(pendulum.gravity, 1, 2)}`, 20, 70);
        
        // Handle user interaction - drag pendulum
        if (p.mouseIsPressed) {
          const mouseVec = p.createVector(p.mouseX, p.mouseY);
          const originVec = p.createVector(pendulum.origin.x, pendulum.origin.y);
          
          // Calculate angle from mouse position
          const v = p5.Vector.sub(mouseVec, originVec);
          pendulum.angle = p.atan2(v.x, v.y);
          
          // Reset velocity when dragging
          pendulum.angleVelocity = 0;
        }
      },
      
      // Resize function
      (ctx: SketchContext) => {
        const { p } = ctx;
        const pendulum = ctx.getControl<PendulumState>('pendulum');
        
        if (pendulum) {
          pendulum.origin = p.createVector(p.width / 2, p.height / 4);
        }
      }
    );
  }, [speed, size]); // Only recreate when speed or size change

  return <P5Wrapper sketch={sketch} />;
};

export default Pendulum;