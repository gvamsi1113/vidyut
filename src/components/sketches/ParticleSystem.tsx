// src/components/sketches/ParticleSystem.tsx
'use client';

import React from 'react';
import p5 from 'p5';
import { ControlSettings } from '@/types';
import P5Wrapper from './P5Wrapper';

interface Particle {
  position: p5.Vector;
  velocity: p5.Vector;
  acceleration: p5.Vector;
  color: number[];
  size: number;
  life: number;
  update: () => void;
  applyForce: (force: p5.Vector) => void;
  edges: () => void;
  display: (p: p5) => void;
  isDead: () => boolean;
}

const ParticleSystem: React.FC<ControlSettings> = ({ speed = 5, size = 5 }) => {
  const createSketch = (p: p5) => {
    const particles: Particle[] = [];
    const particleCount = 50 + size * 10; // Number of particles based on size
    const baseSize = 4 + size * 0.5; // Base particle size
    const maxSpeed = 0.5 + speed * 0.2; // Max particle speed

    // Particle class
    class ParticleClass implements Particle {
      position: p5.Vector;
      velocity: p5.Vector;
      acceleration: p5.Vector;
      color: number[];
      size: number;
      life: number;

      constructor() {
        this.position = p.createVector(p.random(p.width), p.random(p.height));
        this.velocity = p.createVector(
          p.random(-maxSpeed, maxSpeed),
          p.random(-maxSpeed, maxSpeed)
        );
        this.acceleration = p.createVector(0, 0);
        this.color = [p.random(100, 255), p.random(100, 255), p.random(100, 255)];
        this.size = p.random(baseSize * 0.5, baseSize * 1.5);
        this.life = p.random(100, 200);
      }

      update() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
        this.life -= 1;
      }

      applyForce(force: p5.Vector) {
        this.acceleration.add(force);
      }

      edges() {
        if (this.position.x > p.width) {
          this.position.x = 0;
        }
        if (this.position.x < 0) {
          this.position.x = p.width;
        }
        if (this.position.y > p.height) {
          this.position.y = 0;
        }
        if (this.position.y < 0) {
          this.position.y = p.height;
        }
      }

      display(p: p5) {
        const alpha = p.map(this.life, 0, 200, 0, 255);
        p.noStroke();
        p.fill(this.color[0], this.color[1], this.color[2], alpha);
        p.circle(this.position.x, this.position.y, this.size);

        // Add glow effect
        p.drawingContext.shadowBlur = 10;
        p.drawingContext.shadowColor = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${alpha / 255})`;
      }

      // Method to check if particle is "dead"
      isDead() {
        return this.life <= 0;
      }
    }

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);

      // Initialize particles
      for (let i = 0; i < particleCount; i++) {
        particles.push(new ParticleClass());
      }
    };

    p.draw = () => {
      p.background(0, 20); // Black with trail effect

      // Create mouse force when mouse is pressed
      if (
        p.mouseIsPressed &&
        p.mouseX > 0 &&
        p.mouseY > 0 &&
        p.mouseX < p.width &&
        p.mouseY < p.height
      ) {
        const mousePos = p.createVector(p.mouseX, p.mouseY);

        // Draw attraction point
        p.noFill();
        p.stroke(255);
        p.ellipse(p.mouseX, p.mouseY, 30, 30);

        particles.forEach((particle) => {
          const force = p5.Vector.sub(mousePos, particle.position);
          const distance = force.mag();
          force.normalize();

          // Stronger force for closer particles
          const strength = (50 / (distance + 10)) * 0.5;
          force.mult(strength);

          particle.applyForce(force);
        });
      }

      // Update and display particles
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].edges();
        particles[i].display(p);

        // Remove dead particles and replace them
        if (particles[i].isDead()) {
          particles.splice(i, 1);
          particles.push(new ParticleClass());
        }
      }

      // Draw connection lines between nearby particles
      p.stroke(255, 50);
      p.strokeWeight(0.5);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const d = p5.Vector.dist(particles[i].position, particles[j].position);
          if (d < 50) {
            const alpha = p.map(d, 0, 50, 100, 0);
            p.stroke(255, alpha);
            p.line(
              particles[i].position.x,
              particles[i].position.y,
              particles[j].position.x,
              particles[j].position.y
            );
          }
        }
      }
    };

    // Handle window resize
    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
  };

  return <P5Wrapper sketch={createSketch} />;
};

export default ParticleSystem;
