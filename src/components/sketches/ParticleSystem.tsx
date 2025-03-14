// src/components/sketches/ParticleSystem.tsx - Final fixed version
'use client';

import React from 'react';
import p5 from 'p5';
import { ControlSettings } from '@/types';
import P5Wrapper from './P5Wrapper/P5Wrapper';
import { 
  createSketch, 
  createSliderControl, 
  createToggleControl,
  SketchContext
} from '@/utils/p5SketchSystem';

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

interface ParticleSystemSettings {
  maxSpeed: number;
  particleCount: number;
  baseSize: number;
  particles: Particle[];
}

const ParticleSystem: React.FC<ControlSettings> = ({ speed = 5, size = 5 }) => {
  const sketch = createSketch(
    { 
      speed, 
      size,
      controlPanel: {
        theme: 'retro',
        position: 'bottom-left',
        title: 'PARTICLE SYSTEM'
      }
    },
    // Setup function
    (ctx: SketchContext) => {
      const { p, controlPanel, settings } = ctx;
      
      // Create Particle class with explicit type
      const ParticleClass = class implements Particle {
        position: p5.Vector;
        velocity: p5.Vector;
        acceleration: p5.Vector;
        color: number[];
        size: number;
        life: number;
        maxSpeed: number;

        constructor(maxSpeed: number, baseSize: number) {
          this.maxSpeed = maxSpeed;
          this.position = p.createVector(p.random(p.width), p.random(p.height));
          this.velocity = p.createVector(
            p.random(-this.maxSpeed, this.maxSpeed),
            p.random(-this.maxSpeed, this.maxSpeed)
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

        isDead() {
          return this.life <= 0;
        }
      };
      
      // Initialize particle system
      const particleSystem: ParticleSystemSettings = {
        maxSpeed: 0.5 + (settings?.speed ?? 5) * 0.2,
        particleCount: 50 + (settings?.size ?? 5) * 10,
        baseSize: 4 + (settings?.size ?? 5) * 0.5,
        particles: []
      };
      // Create initial particles
      for (let i = 0; i < particleSystem.particleCount; i++) {
        particleSystem.particles.push(
          new ParticleClass(particleSystem.maxSpeed, particleSystem.baseSize)
        );
      }
      
      // Register particle system and constructor for later use
      ctx.registerControl('particleSystem', particleSystem);
      ctx.registerControl('ParticleClass', ParticleClass);
      
      // Create UI controls
      if (controlPanel) {
        // Speed control
        const speedControl = createSliderControl(
          p,
          controlPanel,
          'PARTICLE SPEED',
          0.1,
          2,
          particleSystem.maxSpeed,
          0.1,
          val => val.toFixed(1),
          value => {
            particleSystem.maxSpeed = value;
          }
        );
        
        // Count control
        const countControl = createSliderControl(
          p,
          controlPanel,
          'PARTICLE COUNT',
          20,
          200,
          particleSystem.particleCount,
          10,
          val => val.toFixed(0),
          value => {
            particleSystem.particleCount = value;
            
            // Adjust particle count (add or remove)
            const ParticleConstructor = ctx.getControl<typeof ParticleClass>('ParticleClass');
            if (ParticleConstructor) {
              // Add more particles if needed
              while (particleSystem.particles.length < particleSystem.particleCount) {
                particleSystem.particles.push(
                  new ParticleConstructor(particleSystem.maxSpeed, particleSystem.baseSize)
                );
              }
              
              // Remove particles if needed
              if (particleSystem.particles.length > particleSystem.particleCount) {
                particleSystem.particles.length = particleSystem.particleCount;
              }
            }
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
            countControl.slider,
            countControl.labelEl
          ]
        );
        
        // Register controls
        ctx.registerControl('speedControl', speedControl);
        ctx.registerControl('countControl', countControl);
        ctx.registerControl('toggleControls', toggleControls);
      }
    },
    
    // Draw function
    (ctx: SketchContext) => {
      const { p } = ctx;
      const particleSystem = ctx.getControl<ParticleSystemSettings>('particleSystem');
      const ParticleClass = ctx.getControl<new (maxSpeed: number, baseSize: number) => Particle>('ParticleClass');
      
      if (!particleSystem || !ParticleClass) return;
      
      // Background with trail effect
      p.background(0, 40);
      
      // Create a force towards the mouse when pressed
      if (p.mouseIsPressed) {
        const mouseForce = p.createVector(p.mouseX, p.mouseY);
        
        for (const particle of particleSystem.particles) {
          // Calculate direction from particle to mouse
          const force = p5.Vector.sub(mouseForce, particle.position);
          force.normalize();
          force.mult(0.5); // Strength of attraction
          
          // Apply force to particle
          particle.applyForce(force);
        }
      }
      
      // Update and display particles
      for (let i = particleSystem.particles.length - 1; i >= 0; i--) {
        particleSystem.particles[i].update();
        particleSystem.particles[i].edges();
        particleSystem.particles[i].display(p);
        
        // Replace dead particles
        if (particleSystem.particles[i].isDead()) {
          particleSystem.particles[i] = new ParticleClass(
            particleSystem.maxSpeed, 
            particleSystem.baseSize
          );
        }
      }
      
      // Display info
      p.fill(255);
      p.noStroke();
      p.textSize(12);
      p.textAlign(p.LEFT);
      p.text(`Particles: ${particleSystem.particles.length}`, 20, 30);
      p.text(`FPS: ${p.frameRate().toFixed(0)}`, 20, 50);
      p.text(`Click and drag to attract particles`, 20, 70);
    }
  );

  return <P5Wrapper sketch={sketch} />;
};

export default ParticleSystem;