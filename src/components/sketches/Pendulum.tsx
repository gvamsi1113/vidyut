// src/components/sketches/Pendulum.tsx
'use client';

import React from 'react';
import p5 from 'p5';
import { ControlSettings } from '@/types';
import P5Wrapper from './P5Wrapper';

const Pendulum: React.FC<ControlSettings> = ({ speed = 5, size = 5 }) => {
  const createSketch = (p: p5) => {
    // Pendulum physics parameters
    const gravity = 0.4 + speed * 0.05; // Gravity constant
    const pendulumLength = 100 + size * 10; // Length of pendulum
    const bobSize = 20 + size * 2; // Size of pendulum bob
    const dampening = 0.995; // Dampening factor

    // Pendulum state
    let angle = p.PI / 4; // Starting angle
    let angleVelocity = 0;
    let angleAcceleration = 0;

    // Origin point
    let origin: p5.Vector;

    // Trail array to store previous positions
    const trail: p5.Vector[] = [];
    const maxTrailLength = 50;

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);

      // Set origin to center top of canvas
      origin = p.createVector(p.width / 2, p.height / 4);
    };

    p.draw = () => {
      p.background(0, 40); // Black with trail effect

      // Physics calculation
      angleAcceleration = ((-1 * gravity) / pendulumLength) * p.sin(angle);
      angleVelocity += angleAcceleration;
      angleVelocity *= dampening;
      angle += angleVelocity;

      // Calculate pendulum bob position
      const bobX = origin.x + pendulumLength * p.sin(angle);
      const bobY = origin.y + pendulumLength * p.cos(angle);

      // Add current position to trail
      trail.push(p.createVector(bobX, bobY));

      // Remove oldest position if trail is too long
      if (trail.length > maxTrailLength) {
        trail.shift();
      }

      // Draw trail
      p.noFill();
      p.beginShape();
      for (let i = 0; i < trail.length; i++) {
        const alpha = p.map(i, 0, trail.length, 50, 255);
        p.stroke(255, 50, 150, alpha);
        p.strokeWeight(1);
        p.vertex(trail[i].x, trail[i].y);
      }
      p.endShape();

      // Draw pendulum arm
      p.stroke(200);
      p.strokeWeight(2);
      p.line(origin.x, origin.y, bobX, bobY);

      // Draw origin point
      p.fill(200);
      p.noStroke();
      p.ellipse(origin.x, origin.y, 10, 10);

      // Draw pendulum bob
      p.fill(255, 50, 150);
      p.noStroke();
      p.ellipse(bobX, bobY, bobSize, bobSize);

      // Add glow effect to bob
      p.drawingContext.shadowBlur = 15;
      p.drawingContext.shadowColor = 'rgba(255, 50, 150, 0.8)';

      // Display physics info
      p.fill(255);
      p.noStroke();
      p.textSize(12);
      p.textAlign(p.LEFT);
      p.text(`Angle: ${p.nf(angle, 1, 2)}`, 20, 30);
      p.text(`Velocity: ${p.nf(angleVelocity, 1, 4)}`, 20, 50);
      p.text(`Gravity: ${p.nf(gravity, 1, 2)}`, 20, 70);

      // Handle user interaction - drag pendulum
      if (p.mouseIsPressed) {
        const mouseVec = p.createVector(p.mouseX, p.mouseY);
        const originVec = p.createVector(origin.x, origin.y);

        // Calculate angle from mouse position
        const v = p5.Vector.sub(mouseVec, originVec);
        angle = p.atan2(v.x, v.y);

        // Reset velocity when dragging
        angleVelocity = 0;
      }
    };

    // Handle window resize
    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
      origin = p.createVector(p.width / 2, p.height / 4);
    };
  };

  return <P5Wrapper sketch={createSketch} />;
};

export default Pendulum;
