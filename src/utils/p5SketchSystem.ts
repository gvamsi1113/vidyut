// src/utils/p5SketchSystem.ts
import p5 from 'p5';
import { ControlSettings, SketchOptions } from '@/types';

// Type augmentation for p5.Element methods
declare module 'p5' {
  interface Element {
    input(fxn: () => void): Element;
    html(html: string): Element;
    mousePressed(fxn: () => void): Element;
  }
}

// ===== CONTROL PANEL SYSTEM =====

export interface ControlPanelOptions {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  theme?: 'retro' | 'dark' | 'light';
  width?: string;
  visible?: boolean;
  title?: string;
}

// Main panel creation
export const createControlPanel = (
  p: p5,
  options: ControlPanelOptions = {}
): p5.Element => {
  const {
    position = 'bottom-left',
    theme = 'retro',
    width = '200px',
    visible = true,
    title = ''
  } = options;
  
  // Create container
  const panel = p.createDiv();
  panel.id('control-panel');
  
  // Position
  panel.style('position', 'absolute');
  
  switch (position) {
    case 'top-left':
      panel.style('top', '20px');
      panel.style('left', '20px');
      break;
    case 'top-right':
      panel.style('top', '20px');
      panel.style('right', '20px');
      break;
    case 'bottom-right':
      panel.style('bottom', '20px');
      panel.style('right', '20px');
      break;
    default: // bottom-left
      panel.style('bottom', '20px');
      panel.style('left', '20px');
  }
  
  // Apply theme
  if (theme === 'retro') {
    panel.style('background-color', 'rgba(0, 0, 0, 0.7)');
    panel.style('padding', '15px');
    panel.style('border-radius', '5px');
    panel.style('border', '2px solid #00ddff');
    panel.style('font-family', '"Press Start 2P", cursive');
    panel.style('color', '#fff');
    panel.style('box-shadow', '0 0 10px rgba(0, 221, 255, 0.5)');
  } else if (theme === 'dark') {
    panel.style('background-color', 'rgba(30, 30, 30, 0.8)');
    panel.style('padding', '12px');
    panel.style('border-radius', '4px');
    panel.style('border', '1px solid #444');
    panel.style('color', '#eee');
  } else { // light
    panel.style('background-color', 'rgba(240, 240, 240, 0.8)');
    panel.style('padding', '12px');
    panel.style('border-radius', '4px');
    panel.style('border', '1px solid #ccc');
    panel.style('color', '#333');
  }
  
  // Common styles
  panel.style('width', width);
  panel.style('z-index', '100');
  
  // Optional title
  if (title) {
    const titleEl = p.createDiv(title);
    titleEl.parent(panel);
    titleEl.style('font-size', theme === 'retro' ? '12px' : '14px');
    titleEl.style('text-align', 'center');
    titleEl.style('margin-bottom', '15px');
    titleEl.style('font-weight', 'bold');
  }
  
  // Initial visibility
  if (!visible) {
    panel.hide();
  }
  
  return panel;
};

// Toggle button
export const createToggleControl = (
  p: p5, 
  parent: p5.Element,
  textOn: string = 'HIDE CONTROLS',
  textOff: string = 'SHOW CONTROLS',
  initialState: boolean = true,
  targets: p5.Element[] = []
): { button: p5.Element, state: () => boolean } => {
  const button = p.createButton(initialState ? textOn : textOff);
  button.parent(parent);
  
  // Style button
  button.style('font-family', '"Press Start 2P", cursive');
  button.style('font-size', '10px');
  button.style('background-color', '#ff0066');
  button.style('color', 'white');
  button.style('border', 'none');
  button.style('padding', '8px 12px');
  button.style('border-radius', '4px');
  button.style('cursor', 'pointer');
  button.style('margin-bottom', '15px');
  button.style('width', '100%');
  
  // Store state
  let state = initialState;
  
  // Click handler
  button.mousePressed(() => {
    state = !state;
    button.html(state ? textOn : textOff);
    
    // Toggle targets
    targets.forEach(target => {
      if (state) {
        target.show();
      } else {
        target.hide();
      }
    });
  });
  
  return { 
    button, 
    state: () => state 
  };
};

// Slider with label
export const createSliderControl = (
  p: p5,
  parent: p5.Element,
  label: string,
  min: number,
  max: number,
  value: number,
  step: number = 1,
  formatFn: (val: number) => string = val => val.toFixed(1),
  onChange?: (value: number) => void
): { 
  slider: p5.Element,
  labelEl: p5.Element, 
  getValue: () => number,
  setValue: (val: number) => void
} => {
  // Create label
  const labelEl = p.createDiv(`${label}: ${formatFn(value)}`);
  labelEl.id(`label-${label.toLowerCase().replace(/\s+/g, '-')}`);
  labelEl.parent(parent);
  labelEl.style('font-size', '10px');
  labelEl.style('margin-bottom', '5px');
  
  // Create slider
  const slider = p.createSlider(min, max, value, step);
  slider.parent(parent);
  slider.style('width', '100%');
  slider.style('margin-bottom', '15px');
  
  // Input handler
  slider.input(() => {
    const newValue = slider.value() as number;
    labelEl.html(`${label}: ${formatFn(newValue)}`);
    
    if (onChange) {
      onChange(newValue);
    }
  });
  
  // Helper functions
  const getValue = () => slider.value() as number;
  const setValue = (val: number) => {
    slider.value(val);
    labelEl.html(`${label}: ${formatFn(val)}`);
  };
  
  return { slider, labelEl, getValue, setValue };
};

// ===== VISUAL EFFECTS =====

// Add glow effect to objects
export const addGlowEffect = (
  p: p5, 
  color: number[] | string, 
  blurAmount: number = 15, 
  alpha: number = 0.8
) => {
  const colorStr = typeof color === 'string' 
    ? color 
    : `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
  
  p.drawingContext.shadowBlur = blurAmount;
  p.drawingContext.shadowColor = colorStr;
};

// Create trail effect
export interface TrailManager<T> {
  add: (point: T) => void;
  getPoints: () => T[];
  clear: () => void;
}

export const createTrailManager = <T>(maxLength: number = 50): TrailManager<T> => {
  const points: T[] = [];
  
  return {
    add: (point: T) => {
      points.push(point);
      if (points.length > maxLength) {
        points.shift();
      }
    },
    getPoints: () => points,
    clear: () => {
      points.length = 0;
    }
  };
};

// ===== SKETCH CREATION HELPER =====

export interface SketchContext {
  p: p5;
  controlPanel: p5.Element | null;
  controls: Record<string, unknown>;
  settings: ControlSettings;
  width: number;
  height: number;
  registerControl: <T>(name: string, control: T) => void;
  getControl: <T>(name: string) => T | undefined;
}

// Create a sketch with standard setup and options
export const createSketch = (
  options: SketchOptions, 
  setupFn: (ctx: SketchContext) => void,
  drawFn: (ctx: SketchContext) => void,
  resizeFn?: (ctx: SketchContext) => void
) => {
  return (p: p5) => {
    // Create context object
    const ctx: SketchContext = {
      p,
      controlPanel: null,
      controls: {},
      settings: {
        speed: options.speed ?? 5,
        size: options.size ?? 5
      },
      width: 0, // Will be set dynamically
      height: 0, // Will be set dynamically
      registerControl: <T>(name: string, control: T) => {
        ctx.controls[name] = control as unknown;
      },
      getControl: <T>(name: string) => ctx.controls[name] as T | undefined
    };

    // Function to get container dimensions
    const updateDimensions = () => {
      // Get the parent element dimensions - the container where the canvas is placed
      let container: HTMLElement | null = null;
      
      try {
        // Find the default canvas element using DOM methods
        const defaultCanvas = document.getElementById('defaultCanvas0');
        if (defaultCanvas && defaultCanvas.parentElement) {
          container = defaultCanvas.parentElement;
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      catch (e) {
        // Silent error handling - no console logging
      }
      
      if (container) {
        // Use the available space in the container, or fallback to window dimensions
        ctx.width = options.width ?? container.clientWidth;
        ctx.height = options.height ?? container.clientHeight;
      } else {
        // Fallback to window dimensions if container not available
        ctx.width = options.width ?? p.windowWidth;
        ctx.height = options.height ?? p.windowHeight;
      }
    };

    // Standard setup
    p.setup = () => {
      // Initially create the canvas with an educated guess size
      p.createCanvas(p.windowWidth, p.windowHeight);
      
      // Get correct dimensions after canvas is created
      updateDimensions();
      
      // Now resize to the correct dimensions
      p.resizeCanvas(ctx.width, ctx.height);
      
      // Create control panel if enabled
      if (options.controlPanel) {
        ctx.controlPanel = createControlPanel(p, options.controlPanel);
      }
      
      // Call custom setup
      setupFn(ctx);
    };
    
    // Standard draw
    p.draw = () => {
      drawFn(ctx);
    };
    
    // Standard resize handler
    p.windowResized = () => {
      updateDimensions();
      p.resizeCanvas(ctx.width, ctx.height);
      
      // Call custom resize if provided
      if (resizeFn) {
        resizeFn(ctx);
      }
    };
  };
};