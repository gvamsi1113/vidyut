'use client';

import { useRef, useEffect } from 'react';
import p5 from 'p5';
import styles from '@/app/page.module.css';

const BackgroundSketch = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Skip if we're not in the browser or container is not ready
    if (typeof window === 'undefined' || !containerRef.current) return;
    
    const sketch = new p5((p: p5) => {
      // Star properties
      interface Star {
        x: number;
        y: number;
        z: number; // For parallax effect with mouse
        size: number;
        color: number[];
        twinkleSpeed: number;
        twinkleOffset: number;
        hasSpikes: boolean; // JWST-style diffraction spikes
      }
      
      // Comet properties
      interface Comet {
        x: number;
        y: number;
        direction: { x: number, y: number }; // Normalized direction vector
        speed: number;
        size: number;
        growFactor: number; // Positive = grows, negative = shrinks
        tail: number; // Tail length
        color: number[];
      }
      
      // Retro sprite properties
      interface RetroSprite {
        x: number;
        y: number;
        type: string; // 'invader', 'pacman', 'ghost', 'tetris', 'asteroid'
        color: number[];
        size: number;
        direction: number; // 1 = right, -1 = left
        frame: number; // For animation
        speed: number;
      }

      // CRT effects
      interface CRTEffect {
        glitchTimer: number;
        isGlitching: boolean;
        glitchIntensity: number;
        rgbShiftAmount: number;
        scanLineGap: number;
        scanLineOpacity: number;
      }
      
      // Arrays for different elements
      const stars: Star[] = [];
      const comets: Comet[] = [];
      const retroSprites: RetroSprite[] = [];
      
      // CRT effect properties
      const crtEffect: CRTEffect = {
        glitchTimer: 0,
        isGlitching: false,
        glitchIntensity: 0,
        rgbShiftAmount: 0,
        scanLineGap: 4,
        scanLineOpacity: 25  // Increased opacity for more visible scanlines
      };
      
      // Mouse position for parallax
      let mouseX = p.windowWidth / 2;
      let mouseY = p.windowHeight / 2;
      
      // Setup canvas and initial elements
      p.setup = () => {
        // Create canvas with the size of the window
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.position(0, 0);
        canvas.style('z-index', '-1');
        
        // Create stars with varied properties
        for (let i = 0; i < 300; i++) {
          // More smaller stars in the background
          const starType = p.random();
          let starSize, hasSpikeChance;
          
          if (starType < 0.8) {
            // 80% small background stars
            starSize = p.random(0.5, 2);
            hasSpikeChance = 0.05; // 5% chance for small stars
          } else if (starType < 0.95) {
            // 15% medium stars
            starSize = p.random(2, 3.5);
            hasSpikeChance = 0.3; // 30% chance for medium stars
          } else {
            // 5% large stars
            starSize = p.random(3.5, 5);
            hasSpikeChance = 0.8; // 80% chance for large stars
          }
          
          stars.push({
            x: p.random(p.width),
            y: p.random(p.height),
            z: p.random(0.1, 1), // Parallax depth (farther stars move less)
            size: starSize,
            color: [
              p.random([180, 200, 220, 240, 255]), // Red component
              p.random([180, 200, 220, 240, 255]), // Green component
              p.random([200, 220, 240, 255]),      // Blue component (biased toward blue for realism)
            ],
            twinkleSpeed: p.random(0.02, 0.1),
            twinkleOffset: p.random(0, p.TWO_PI),
            hasSpikes: p.random() < hasSpikeChance // More prominent JWST spikes on larger stars
          });
        }
        
        // Create initial comets from different edges (reduced number)
        for (let i = 0; i < 4; i++) { // Reduced from 8 to 4
          createComet();
        }
        
        // Create initial retro sprites
        for (let i = 0; i < 6; i++) {
          if (p.random() < 0.6) { // 60% chance of creating a sprite initially
            createRetroSprite();
          }
        }
      };
      
      // Create a new comet from a random edge
      const createComet = () => {
        // Determine which edge the comet comes from
        // Favor top-right and top-left corners for more dramatic comets like in the reference images
        const edgeWeight = p.random();
        let edge;
        
        if (edgeWeight < 0.4) {
          edge = 3; // Left edge (40% chance)
        } else if (edgeWeight < 0.8) {
          edge = 1; // Right edge (40% chance)
        } else if (edgeWeight < 0.9) {
          edge = 0; // Top edge (10% chance)
        } else {
          edge = 2; // Bottom edge (10% chance)
        }
        
        let x, y, dirX, dirY;
        
        switch (edge) {
          case 0: // Top edge
            x = p.random(p.width);
            y = -50;
            dirX = p.random(-0.3, 0.3);
            dirY = p.random(0.7, 1);
            break;
          case 1: // Right edge
            x = p.width + 50;
            y = p.random(p.height * 0.4); // Keep comets in upper portion
            dirX = p.random(-1, -0.7);
            dirY = p.random(-0.1, 0.5); // Angle slightly downward
            break;
          case 2: // Bottom edge
            x = p.random(p.width);
            y = p.height + 50;
            dirX = p.random(-0.3, 0.3);
            dirY = p.random(-1, -0.7);
            break;
          case 3: // Left edge
            x = -50;
            y = p.random(p.height * 0.4); // Keep comets in upper portion
            dirX = p.random(0.7, 1);
            dirY = p.random(-0.1, 0.5); // Angle slightly downward
            break;
          default:
            x = -50;
            y = p.random(p.height / 3);
            dirX = 1;
            dirY = 0.4;
        }
        
        // Normalize direction vector
        const magnitude = Math.sqrt(dirX * dirX + dirY * dirY);
        dirX /= magnitude;
        dirY /= magnitude;
        
        // Comet size and color based on reference images
        // Reference shows larger, more colorful comets with distinct tails
        const cometType = p.random();
        let size, tailLength, cometColor;
        
        if (cometType < 0.3) {
          // 30% small bluish comets
          size = p.random(2, 3.5);
          tailLength = p.random(20, 60);
          cometColor = [
            p.random(100, 180), // Less red
            p.random(150, 220), // Medium green
            p.random(220, 255)  // More blue
          ];
        } else if (cometType < 0.6) {
          // 30% medium reddish comets
          size = p.random(3.5, 5);
          tailLength = p.random(60, 100);
          cometColor = [
            p.random(220, 255), // More red
            p.random(100, 180), // Less green
            p.random(180, 220)  // Medium blue
          ];
        } else {
          // 40% large dramatic comets like in the reference
          size = p.random(5, 8);
          tailLength = p.random(100, 160);
          
          // Choose between iconic color schemes from reference
          if (p.random() < 0.5) {
            // Cyan/blue tail
            cometColor = [
              p.random(50, 100),  // Low red
              p.random(200, 255), // High green
              p.random(220, 255)  // High blue
            ];
          } else {
            // Pink/magenta tail
            cometColor = [
              p.random(220, 255), // High red
              p.random(50, 120),  // Low green
              p.random(180, 255)  // High blue
            ];
          }
        }
        
        comets.push({
          x,
          y,
          direction: { x: dirX, y: dirY },
          speed: p.random(2, 7),
          size: size,
          growFactor: p.random(-0.005, 0.01), // Mostly growing for dramatic effect
          tail: tailLength,
          color: cometColor
        });
      };
      
      // Create a new retro sprite
      const createRetroSprite = () => {
        // Randomly select sprite type
        const spriteTypes = ['invader', 'pacman', 'ghost', 'tetris', 'asteroid'];
        const type = p.random(spriteTypes);
        
        let x, y, direction;
        
        // Start from outside the screen
        if (p.random() < 0.5) {
          // Left or right edge
          x = p.random() < 0.5 ? -30 : p.width + 30;
          y = p.random(p.height * 0.2, p.height * 0.8);
          direction = x < 0 ? 1 : -1; // Move toward center
        } else {
          // Top or bottom edge
          x = p.random(p.width * 0.2, p.width * 0.8);
          y = p.random() < 0.5 ? -30 : p.height + 30;
          direction = y < 0 ? 1 : -1; // Direction doesn't matter as much for vertical movement
        }
        
        // Create sprite with random properties
        retroSprites.push({
          x,
          y,
          type,
          color: [
            p.random(150, 255),
            p.random(150, 255),
            p.random(150, 255)
          ],
          size: p.random(15, 30),
          direction,
          frame: 0,
          speed: p.random(0.5, 2)
        });
      };
      
      // Update glitch effect parameters
      const updateCRTEffects = () => {
        // Update glitch timer
        crtEffect.glitchTimer -= 1;
        
        // Randomly trigger glitch
        if (!crtEffect.isGlitching && p.random() < 0.001) {
          crtEffect.isGlitching = true;
          crtEffect.glitchTimer = p.random(5, 15);
          crtEffect.glitchIntensity = p.random(5, 20);
        }
        
        // Turn off glitch when timer expires
        if (crtEffect.isGlitching && crtEffect.glitchTimer <= 0) {
          crtEffect.isGlitching = false;
          crtEffect.rgbShiftAmount = 0;
        }
        
        // Update RGB shift amount during glitch
        if (crtEffect.isGlitching) {
          crtEffect.rgbShiftAmount = p.random(1, crtEffect.glitchIntensity);
          
          // Occasionally change scan line properties during glitch
          if (p.random() < 0.2) {
            crtEffect.scanLineGap = p.random([2, 3, 4, 6]);
            crtEffect.scanLineOpacity = p.random(8, 15);
          }
        } else {
          // Gradually reset scan line properties
          crtEffect.scanLineGap = 4;
          crtEffect.scanLineOpacity = 10;
        }
      };
      
      // Track mouse movement for parallax effect
      p.mouseMoved = () => {
        mouseX = p.mouseX;
        mouseY = p.mouseY;
      };
      
      // Draw function
      p.draw = () => {
        // Update CRT effects
        updateCRTEffects();
        
        // Dark space background with subtle gradient
        const gradientTop = p.color(20, 10, 40); // Slightly purple at top
        const gradientBottom = p.color(5, 2, 15); // Very dark at bottom
        
        p.background(10, 5, 25);
        
        // Draw subtle gradient background
        p.push();
        p.noStroke();
        for (let y = 0; y < p.height; y++) {
          const inter = p.map(y, 0, p.height, 0, 1);
          const c = p.lerpColor(gradientTop, gradientBottom, inter);
          p.stroke(c);
          p.line(0, y, p.width, y);
        }
        p.pop();
        
        // Add subtle grid horizon like in the reference images
        p.push();
        // This creates the vanishing point grid seen in the reference
        if (p.height > 400) { // Only add grid on taller screens
          const gridY = p.height * 0.65; // Position grid below center
          const vanishingX = p.width / 2;
          const vanishingY = gridY - 50; // Vanishing point slightly above grid
          
          // Draw horizontal lines
          p.strokeWeight(1);
          const horizonLineCount = 20;
          const maxWidth = p.width * 1.5;
          
          for (let i = 0; i < horizonLineCount; i++) {
            const y = gridY + i * (p.height * 0.3) / horizonLineCount;
            const alpha = p.map(i, 0, horizonLineCount, 40, 5);
            const lineWidth = p.map(i, 0, horizonLineCount, p.width * 0.8, maxWidth);
            
            p.stroke(0, 255, 255, alpha); // Cyan lines
            p.line(vanishingX - lineWidth/2, y, vanishingX + lineWidth/2, y);
          }
          
          // Draw vertical lines
          const verticalLineCount = 30;
          for (let i = -verticalLineCount/2; i <= verticalLineCount/2; i++) {
            const startX = vanishingX + i * (maxWidth / verticalLineCount);
            const alpha = p.map(Math.abs(i), 0, verticalLineCount/2, 40, 5);
            
            p.stroke(255, 0, 255, alpha); // Magenta lines
            p.line(startX, gridY, vanishingX, vanishingY);
          }
        }
        p.pop();
        
        // Apply RGB shift if glitching (splitting color channels)
        if (crtEffect.isGlitching && crtEffect.rgbShiftAmount > 0) {
          // Red channel
          p.push();
          p.drawingContext.globalCompositeOperation = 'lighten';
          p.fill(255, 0, 0, 50);
          p.noStroke();
          p.rect(-crtEffect.rgbShiftAmount, 0, p.width, p.height);
          p.pop();
          
          // Blue channel
          p.push();
          p.drawingContext.globalCompositeOperation = 'lighten';
          p.fill(0, 0, 255, 50);
          p.noStroke();
          p.rect(crtEffect.rgbShiftAmount, 0, p.width, p.height);
          p.pop();
        }
        
        // Calculate parallax center (normalized mouse position from -1 to 1)
        const centerX = p.map(mouseX, 0, p.width, -1, 1);
        const centerY = p.map(mouseY, 0, p.height, -1, 1);
        
        // Add occasional large planets like in the reference images
        // These are fixed positions, not randomly generated every frame
        drawPlanets();
        
        // Draw stars with parallax and twinkling
        drawStars(centerX, centerY);
        
        // Draw comets with tails
        drawComets();
        
        // Draw retro sprites
        drawRetroSprites();
        
        // Draw CRT scan lines on top of everything
        drawScanLines();
        
        // Randomly create new elements
        if (p.random() < 0.003) createComet(); // Reduced probability
        if (p.random() < 0.002) createRetroSprite();
      };
      
      // Draw CRT scan lines effect
      const drawScanLines = () => {
        p.push();
        
        // Overlay scanlines across the entire screen with a semi-transparent gradient
        p.drawingContext.globalCompositeOperation = 'overlay';
        p.noStroke();
        
        // Semi-transparent overlay for CRT look
        p.fill(0, 0, 20, 30);
        p.rect(0, 0, p.width, p.height);
        
        // Primary scan lines
        p.stroke(255, 255, 255, crtEffect.scanLineOpacity);
        p.strokeWeight(1);
        
        for (let i = 0; i < p.height; i += crtEffect.scanLineGap) {
          // Add slight horizontal offset during glitches
          const offset = crtEffect.isGlitching ? p.random(-3, 3) : 0;
          const lineWidth = crtEffect.isGlitching && p.random() < 0.05 ? p.random(p.width * 0.5, p.width) : p.width;
          
          p.line(offset, i, lineWidth + offset, i);
        }
        
        // Add occasional horizontal distortion lines during glitches
        if (crtEffect.isGlitching && p.random() < 0.3) {
          const y = p.random(p.height);
          const height = p.random(2, 10);
          p.fill(0, 0, 0, 150);
          p.noStroke();
          p.rect(0, y, p.width, height);
        }
        
        // Add subtle vertical scan lines for the grid effect seen in the reference
        p.stroke(255, 255, 255, 5);
        p.strokeWeight(1);
        for (let i = 0; i < p.width; i += p.width/80) {
          p.line(i, 0, i, p.height);
        }
        
        p.pop();
      };
      
      // Draw stars with parallax, twinkling, and JWST spikes - enhanced for reference match
      const drawStars = (centerX: number, centerY: number) => {
        p.push();
        p.noStroke();
        
        // First pass - draw subtle glow around larger stars
        for (const star of stars) {
          if (star.size > 3 || star.hasSpikes) {
            // Calculate parallax offset based on depth (z)
            const parallaxX = centerX * (1 - star.z) * 30;
            const parallaxY = centerY * (1 - star.z) * 20;
            
            // Apply parallax to position
            const posX = (star.x + parallaxX + p.width) % p.width;
            const posY = (star.y + parallaxY + p.height) % p.height;
            
            // Calculate twinkle effect
            const twinkle = p.sin(p.frameCount * star.twinkleSpeed + star.twinkleOffset) * 0.5 + 0.5;
            
            // Add glow for bigger stars
            p.drawingContext.shadowBlur = star.size * 3;
            p.drawingContext.shadowColor = `rgba(${star.color[0]}, ${star.color[1]}, ${star.color[2]}, ${0.3 + 0.3 * twinkle})`;
            p.fill(star.color[0], star.color[1], star.color[2], 50 + 30 * twinkle);
            p.circle(posX, posY, star.size * 3.5);
          }
        }
        
        // Main pass - draw all stars and spikes
        for (const star of stars) {
          // Calculate parallax offset based on depth (z)
          const parallaxX = centerX * (1 - star.z) * 30;
          const parallaxY = centerY * (1 - star.z) * 20;
          
          // Apply parallax to position
          const posX = (star.x + parallaxX + p.width) % p.width;
          const posY = (star.y + parallaxY + p.height) % p.height;
          
          // Calculate twinkle effect
          const twinkle = p.sin(p.frameCount * star.twinkleSpeed + star.twinkleOffset) * 0.5 + 0.5;
          const finalSize = star.size * (0.7 + 0.5 * twinkle);
          
          // Draw the star core
          p.fill(star.color[0], star.color[1], star.color[2], 150 + 105 * twinkle);
          
          // Add glow effect for larger stars
          if (star.size > 2) {
            p.drawingContext.shadowBlur = star.size * 2;
            p.drawingContext.shadowColor = `rgba(${star.color[0]}, ${star.color[1]}, ${star.color[2]}, 0.8)`;
          }
          
          p.circle(posX, posY, finalSize);
          
          // Draw enhanced JWST-style diffraction spikes for selected stars
          if (star.hasSpikes && finalSize > 1.8) {
            p.push();
            
            // Draw the six diffraction spikes with enhanced glow
            p.drawingContext.shadowBlur = 3;
            p.drawingContext.shadowColor = `rgba(${star.color[0]}, ${star.color[1]}, ${star.color[2]}, 0.8)`;
            
            const baseColor = [star.color[0], star.color[1], star.color[2]];
            
            // First pass: wider, more transparent spikes for glow
            p.stroke(baseColor[0], baseColor[1], baseColor[2], 40 + 30 * twinkle);
            p.strokeWeight(1.5);
            
            const spikeLength = finalSize * (star.size > 3 ? 8 : 4); // Longer spikes for larger stars
            
            // Draw three pairs of opposing spikes (6 total)
            for (let angle = 0; angle < p.PI; angle += p.PI / 3) {
              p.line(
                posX - Math.cos(angle) * spikeLength * 0.8,
                posY - Math.sin(angle) * spikeLength * 0.8,
                posX + Math.cos(angle) * spikeLength * 0.8,
                posY + Math.sin(angle) * spikeLength * 0.8
              );
            }
            
            // Second pass: thinner, brighter core of spikes
            p.stroke(baseColor[0], baseColor[1], baseColor[2], 70 + 80 * twinkle);
            p.strokeWeight(0.5);
            
            for (let angle = 0; angle < p.PI; angle += p.PI / 3) {
              p.line(
                posX - Math.cos(angle) * spikeLength,
                posY - Math.sin(angle) * spikeLength,
                posX + Math.cos(angle) * spikeLength,
                posY + Math.sin(angle) * spikeLength
              );
            }
            p.pop();
          }
        }
        p.pop();
      };
            
      
      // Draw comets with dynamic tails - enhanced to match reference images
      const drawComets = () => {
        for (let i = comets.length - 1; i >= 0; i--) {
          const comet = comets[i];
          
          // Update comet size (grow or shrink)
          comet.size += comet.growFactor;
          comet.size = p.constrain(comet.size, 1.5, 10); // Allow larger comets
          
          // Draw enhanced tail/trail in opposite direction of movement
          p.push();
          p.noStroke();
          
          // Add a glow effect to the entire tail
          p.drawingContext.shadowBlur = 20;
          p.drawingContext.shadowColor = `rgba(${comet.color[0]}, ${comet.color[1]}, ${comet.color[2]}, 0.4)`;
          
          // First pass: Draw larger, more transparent particles for glow
          for (let j = 0; j < comet.tail; j += 3) {
            const alpha = p.map(j, 0, comet.tail, 120, 0);
            const size = p.map(j, 0, comet.tail, comet.size * 3, 1);
            
            // Calculate tail position (opposite to movement direction)
            const tailX = comet.x - (comet.direction.x * j * 0.5);
            const tailY = comet.y - (comet.direction.y * j * 0.5);
            
            p.fill(comet.color[0], comet.color[1], comet.color[2], alpha * 0.4);
            p.circle(tailX, tailY, size);
          }
          
          // Second pass: Draw the main tail particles
          for (let j = 0; j < comet.tail; j++) {
            const alpha = p.map(j, 0, comet.tail, 255, 0);
            const size = p.map(j, 0, comet.tail, comet.size, 0.2);
            
            // Calculate tail position (opposite to movement direction)
            const tailX = comet.x - (comet.direction.x * j * 0.5);
            const tailY = comet.y - (comet.direction.y * j * 0.5);
            
            // Add some variation to the tail particles
            const jitter = p.random(-0.5, 0.5) * Math.min(j * 0.15, 3);
            const tailJitterX = tailX + jitter * Math.abs(comet.direction.y);
            const tailJitterY = tailY + jitter * Math.abs(comet.direction.x);
            
            p.fill(comet.color[0], comet.color[1], comet.color[2], alpha);
            p.circle(tailJitterX, tailJitterY, size);
          }
          
          // Draw comet body with enhanced glow
          p.drawingContext.shadowBlur = 25; // Increased blur
          p.drawingContext.shadowColor = `rgba(${comet.color[0]}, ${comet.color[1]}, ${comet.color[2]}, 0.9)`;
          
          // Core glow
          p.fill(255, 255, 255, 200);
          p.circle(comet.x, comet.y, comet.size * 1.2);
          
          // Outer body
          p.fill(comet.color[0], comet.color[1], comet.color[2]);
          p.circle(comet.x, comet.y, comet.size * 2);
          
          p.pop();
          
          // Move comet
          comet.x += comet.direction.x * comet.speed;
          comet.y += comet.direction.y * comet.speed;
          
          // Remove if off screen in any direction (with padding)
          if (
            comet.x < -100 || 
            comet.x > p.width + 100 || 
            comet.y < -100 || 
            comet.y > p.height + 100
          ) {
            comets.splice(i, 1);
            
            // Only create a new comet if we're not over the limit
            // Keep fewer comets as requested
            if (comets.length < 5 && p.random() < 0.8) {
              createComet();
            }
          }
        }
      };
      
      // Draw retro game sprites
      const drawRetroSprites = () => {
        p.push();
        
        for (let i = retroSprites.length - 1; i >= 0; i--) {
          const sprite = retroSprites[i];
          
          // Update animation frame
          if (p.frameCount % 10 === 0) {
            sprite.frame = (sprite.frame + 1) % 2;
          }
          
          // Move sprite
          if (sprite.type === 'pacman' || sprite.type === 'ghost' || sprite.type === 'invader') {
            // Horizontal movement
            sprite.x += sprite.direction * sprite.speed;
          } else {
            // More random movement for other sprites
            sprite.x += sprite.direction * sprite.speed * p.cos(p.frameCount * 0.02);
            sprite.y += sprite.speed * 0.5 * p.sin(p.frameCount * 0.02);
          }
          
          // Draw the sprite (pixelated)
          p.push();
          p.noStroke();
          p.fill(sprite.color[0], sprite.color[1], sprite.color[2]);
          
          // Switch based on sprite type
          switch (sprite.type) {
            case 'invader':
              drawInvader(sprite.x, sprite.y, sprite.size, sprite.frame);
              break;
            case 'pacman':
              drawPacman(sprite.x, sprite.y, sprite.size, sprite.frame, sprite.direction);
              break;
            case 'ghost':
              drawGhost(sprite.x, sprite.y, sprite.size, sprite.frame);
              break;
            case 'tetris':
              drawTetrisPiece(sprite.x, sprite.y, sprite.size);
              break;
            case 'asteroid':
              drawAsteroid(sprite.x, sprite.y, sprite.size);
              break;
          }
          p.pop();
          
          // Remove if off screen with wide margin
          if (
            sprite.x < -50 || 
            sprite.x > p.width + 50 || 
            sprite.y < -50 || 
            sprite.y > p.height + 50
          ) {
            retroSprites.splice(i, 1);
            
            // Only create a new sprite sometimes
            if (retroSprites.length < 10 && p.random() < 0.5) {
              createRetroSprite();
            }
          }
        }
        
        p.pop();
      };
      
      // Space Invader drawing function
      const drawInvader = (x: number, y: number, size: number, frame: number) => {
        const pixelSize = size / 8;
        
        // 8x8 pixel art for frame 0
        const invaderPixels0 = [
          [0,0,0,1,1,0,0,0],
          [0,0,1,1,1,1,0,0],
          [0,1,1,1,1,1,1,0],
          [1,1,0,1,1,0,1,1],
          [1,1,1,1,1,1,1,1],
          [0,0,1,0,0,1,0,0],
          [0,1,0,1,1,0,1,0],
          [1,0,1,0,0,1,0,1]
        ];
        
        // 8x8 pixel art for frame 1
        const invaderPixels1 = [
          [0,0,0,1,1,0,0,0],
          [0,0,1,1,1,1,0,0],
          [0,1,1,1,1,1,1,0],
          [1,1,0,1,1,0,1,1],
          [1,1,1,1,1,1,1,1],
          [0,0,1,0,0,1,0,0],
          [0,1,0,0,0,0,1,0],
          [0,0,1,0,0,1,0,0]
        ];
        
        const pixels = frame === 0 ? invaderPixels0 : invaderPixels1;
        
        // Draw the invader pixel by pixel
        for (let py = 0; py < 8; py++) {
          for (let px = 0; px < 8; px++) {
            if (pixels[py][px] === 1) {
              p.rect(
                x - size/2 + px * pixelSize, 
                y - size/2 + py * pixelSize, 
                pixelSize, 
                pixelSize
              );
            }
          }
        }
      };
      
      // Pac-Man drawing function
      const drawPacman = (x: number, y: number, size: number, frame: number, direction: number) => {
        // Direction is -1 or 1, use it to flip pacman
        const startAngle = direction > 0 ? p.QUARTER_PI : p.PI + p.QUARTER_PI;
        const endAngle = direction > 0 ? p.TWO_PI - p.QUARTER_PI : p.TWO_PI + p.QUARTER_PI;
        
        // Frame defines how open the mouth is
        const mouthSize = frame === 0 ? p.QUARTER_PI : p.PI/8;
        
        // Draw Pac-Man as an arc
        p.arc(
          x, y, 
          size, size, 
          startAngle + mouthSize, 
          endAngle - mouthSize, 
          p.PIE
        );
      };
      
      // Ghost drawing function
      const drawGhost = (x: number, y: number, size: number, frame: number) => {
        // Body (upper semicircle + rectangle)
        p.arc(x, y - size/6, size, size, p.PI, p.TWO_PI);
        p.rect(x - size/2, y - size/6, size, size/2);
        
        // Wavy bottom
        p.beginShape();
          p.vertex(x - size/2, y + size/3);
          p.vertex(x - size/3, y + size/6);
          p.vertex(x - size/6, y + size/3);
          p.vertex(x, y + size/6);
          p.vertex(x + size/6, y + size/3);
          p.vertex(x + size/3, y + size/6);
          p.vertex(x + size/2, y + size/3);
        p.endShape();
        
        // Eyes
        p.fill(255);
        p.ellipse(x - size/6, y - size/6, size/5, size/4);
        p.ellipse(x + size/6, y - size/6, size/5, size/4);
        
        // Pupils (moving based on frame)
        p.fill(0, 0, 255);
        const pupilOffset = frame === 0 ? -1 : 1;
        p.ellipse(x - size/6 + pupilOffset * 2, y - size/6, size/10, size/8);
        p.ellipse(x + size/6 + pupilOffset * 2, y - size/6, size/10, size/8);
      };
      
      // Tetris piece drawing function (L piece)
      const drawTetrisPiece = (x: number, y: number, size: number) => {
        const blockSize = size / 2;
        const pieces = [
          // L piece
          [[0,0], [0,1], [0,2], [1,2]],
          
          // Square piece
          [[0,0], [0,1], [1,0], [1,1]],
          
          // Line piece
          [[0,0], [0,1], [0,2], [0,3]],
          
          // T piece
          [[0,0], [1,0], [2,0], [1,1]]
        ];
        
        // Choose a piece type based on position
        const pieceIndex = Math.floor((x * y) % pieces.length);
        const piece = pieces[pieceIndex];
        
        // Draw each block of the piece
        for (const [bx, by] of piece) {
          p.rect(
            x - blockSize + bx * blockSize, 
            y - blockSize + by * blockSize, 
            blockSize - 1, 
            blockSize - 1
          );
        }
      };
      
      // Asteroid drawing function
      const drawAsteroid = (x: number, y: number, size: number) => {
        // Draw a polygon with random vertices
        p.push();
        p.beginShape();
        
        // Use consistent randomness based on position
        const seed = x * y;
        
        for (let i = 0; i < 8; i++) {
          const angle = p.map(i, 0, 8, 0, p.TWO_PI);
          // Get a radius that varies slightly for each vertex
          const radius = size/2 * p.map(p.noise(seed + i * 0.5), 0, 1, 0.7, 1.3);
          p.vertex(
            x + p.cos(angle) * radius,
            y + p.sin(angle) * radius
          );
        }
        
        p.endShape(p.CLOSE);
        p.pop();
      };
      
      // Draw planets like in the reference images
      const drawPlanets = () => {
        // Fixed planets based on screen size - similar to the reference images
        // These use unique seeds to ensure consistent appearance
        
        // Planet 1 - Saturn-like planet
        if (p.width > 800) { // Only show on wider screens
          const planetX = p.width * 0.15;
          const planetY = p.height * 0.3;
          const planetSize = p.min(p.width, p.height) * 0.15;
          
          p.push();
          // Outer glow
          p.drawingContext.shadowBlur = 20;
          p.drawingContext.shadowColor = 'rgba(120, 255, 200, 0.5)';
          
          // Planet
          p.noStroke();
          p.fill(100, 220, 180);
          p.circle(planetX, planetY, planetSize);
          
          // Ring
          p.push();
          p.noFill();
          p.stroke(140, 255, 220, 180);
          p.strokeWeight(planetSize * 0.05);
          p.ellipse(planetX, planetY, planetSize * 1.8, planetSize * 0.5);
          
          // Inner ring
          p.stroke(100, 220, 180, 150);
          p.strokeWeight(planetSize * 0.03);
          p.ellipse(planetX, planetY, planetSize * 1.6, planetSize * 0.4);
          p.pop();
          
          // Surface details
          p.stroke(80, 200, 160, 100);
          p.strokeWeight(1);
          p.arc(planetX, planetY - planetSize * 0.1, planetSize * 0.8, planetSize * 0.2, 0, p.PI);
          p.arc(planetX, planetY + planetSize * 0.1, planetSize * 0.7, planetSize * 0.15, p.PI, p.TWO_PI);
          
          p.pop();
        }
        
        // Planet 2 - Red/Orange planet
        if (p.width > 600) { // Only show on medium and larger screens
          const planetX = p.width * 0.85;
          const planetY = p.height * 0.35;
          const planetSize = p.min(p.width, p.height) * 0.13;
          
          p.push();
          // Outer glow
          p.drawingContext.shadowBlur = 20;
          p.drawingContext.shadowColor = 'rgba(255, 150, 100, 0.5)';
          
          // Main planet
          p.noStroke();
          
          // Gradient fill
          const grad = p.drawingContext.createRadialGradient(
            planetX, planetY, 0,
            planetX, planetY, planetSize/2
          );
          grad.addColorStop(0, 'rgba(255, 180, 120, 1)');
          grad.addColorStop(0.7, 'rgba(200, 100, 80, 1)');
          grad.addColorStop(1, 'rgba(150, 50, 50, 1)');
          
          p.drawingContext.fillStyle = grad;
          p.circle(planetX, planetY, planetSize);
          
          // Surface details
          p.stroke(255, 200, 150, 100);
          p.strokeWeight(1);
          p.noFill();
          p.arc(planetX, planetY - planetSize * 0.2, planetSize * 0.6, planetSize * 0.3, 0, p.PI);
          p.arc(planetX, planetY + planetSize * 0.1, planetSize * 0.8, planetSize * 0.2, p.PI, p.TWO_PI);
          
          p.pop();
        }
      };
      
      // Handle window resize - important for maintaining full size
      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        
        // Reposition stars to maintain relative positions
        for (const star of stars) {
          star.x = p.map(star.x, 0, p.width, 0, p.windowWidth);
          star.y = p.map(star.y, 0, p.height, 0, p.windowHeight);
        }
      };
    }, containerRef.current);
    
    // Cleanup on unmount
    return () => {
      sketch.remove();
    };
  }, []);
  
  return <div ref={containerRef} className={styles.backgroundSketch} />;
};

export default BackgroundSketch;