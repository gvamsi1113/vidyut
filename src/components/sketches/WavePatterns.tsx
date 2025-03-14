// src/components/sketches/WavePatterns.tsx - Final fixed version
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
  SketchContext
} from '@/utils/p5SketchSystem';

interface WaveState {
  waveSpeed: number;
  amplitude: number;
  waveCount: number;
  waveColors: number[][];
  time: number;
  waveSpacing: number;
}

const WavePatterns: React.FC<ControlSettings> = ({ speed = 5, size = 5 }) => {
  const sketch = useMemo(() => {
    return createSketch(
      { 
        speed, 
        size,
        controlPanel: {
          theme: 'retro',
          position: 'bottom-left',
          title: 'WAVE PATTERNS'
        }
      },
      // Setup function
      (ctx: SketchContext) => {
        const { p, controlPanel, settings } = ctx;
        
        // Create wave state
        const waveState: WaveState = {
          waveSpeed: (settings.speed ?? 5) * 0.02,
          amplitude: 50 + (settings.size ?? 5) * 10,
          waveCount: 3,
          waveColors: [
            [0, 255, 255],   // Cyan
            [255, 0, 255],   // Magenta
            [255, 255, 0]    // Yellow
          ],
          time: 0,
          waveSpacing: p.height / 4 // Will be recalculated
        };
        
        // Calculate wave spacing
        waveState.waveSpacing = p.height / (waveState.waveCount + 1);
        
        // Store in context
        ctx.registerControl('waveState', waveState);
        
        // Create UI controls
        if (controlPanel) {
          // Wave speed control
          const speedControl = createSliderControl(
            p,
            controlPanel,
            'WAVE SPEED',
            0.01,
            0.5,
            waveState.waveSpeed,
            0.01,
            val => (val * 50).toFixed(1),
            value => {
              waveState.waveSpeed = value;
            }
          );
          
          // Amplitude control
          const amplitudeControl = createSliderControl(
            p,
            controlPanel,
            'AMPLITUDE',
            10,
            200,
            waveState.amplitude,
            5,
            val => val.toFixed(0),
            value => {
              waveState.amplitude = value;
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
              amplitudeControl.slider,
              amplitudeControl.labelEl
            ]
          );
          
          // Register controls
          ctx.registerControl('speedControl', speedControl);
          ctx.registerControl('amplitudeControl', amplitudeControl);
          ctx.registerControl('toggleControls', toggleControls);
        }
      },
      
      // Draw function
      (ctx: SketchContext) => {
        const { p } = ctx;
        const waveState = ctx.getControl<WaveState>('waveState');
        
        if (!waveState) return;
        
        // Background with trail effect
        p.background(0, 40);
        
        // Update time
        waveState.time += waveState.waveSpeed;
        
        // Draw each wave layer
        for (let i = 0; i < waveState.waveCount; i++) {
          drawWave(
            p,
            waveState.waveSpacing * (i + 1),
            waveState.waveColors[i],
            waveState.amplitude,
            0.01 + i * 0.005, // Frequency
            waveState.time + i * 2 // Offset
          );
        }
        
        // Display info
        p.fill(255);
        p.noStroke();
        p.textSize(12);
        p.textAlign(p.LEFT);
        p.text(`Speed: ${(waveState.waveSpeed * 50).toFixed(1)}`, 20, 30);
        p.text(`Amplitude: ${waveState.amplitude.toFixed(0)}`, 20, 50);
        p.text(`Wave Count: ${waveState.waveCount}`, 20, 70);
      },
      
      // Resize function
      (ctx: SketchContext) => {
        const { p } = ctx;
        const waveState = ctx.getControl<WaveState>('waveState');
        
        if (waveState) {
          waveState.waveSpacing = p.height / (waveState.waveCount + 1);
        }
      }
    );
  }, [speed, size]); // Only recreate when speed or size change
  
  // Helper function to draw a wave
  const drawWave = (
    p: p5,
    baseY: number,
    color: number[],
    amp: number,
    freq: number,
    timeOffset: number
  ) => {
    p.stroke(color[0], color[1], color[2]);
    p.strokeWeight(3);
    p.noFill();
    
    // Add glow effect
    addGlowEffect(p, color);
    
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
  };

  return <P5Wrapper sketch={sketch} />;
};

export default WavePatterns;