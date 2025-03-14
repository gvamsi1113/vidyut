# Contributing to Vidyut

Thank you for your interest in contributing to Vidyut, the educational coding platform with a retro console interface! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
  - [Development Environment](#development-environment)
  - [Project Setup](#project-setup)
- [Development Workflow](#development-workflow)
  - [Branching Strategy](#branching-strategy)
  - [Commit Guidelines](#commit-guidelines)
  - [Pull Requests](#pull-requests)
- [Coding Standards](#coding-standards)
  - [TypeScript](#typescript)
  - [React & Next.js](#react--nextjs)
  - [CSS & Tailwind](#css--tailwind)
  - [p5.js Integration](#p5js-integration)
- [The p5SketchSystem](#the-p5sketchsystem)
  - [Overview](#p5sketchsystem-overview)
  - [Key Components](#key-components)
- [Adding New Sketches](#adding-new-sketches)
  - [Step 1: Create the Component File](#step-1-create-the-component-file)
  - [Step 2: Define Your State Interface](#step-2-define-your-state-interface)
  - [Step 3: Set Up the Sketch Function](#step-3-set-up-the-sketch-function)
  - [Step 4: Implement the Setup Function](#step-4-implement-the-setup-function)
  - [Step 5: Implement the Draw Function](#step-5-implement-the-draw-function)
  - [Step 6: Add Optional Resize Function](#step-6-add-optional-resize-function)
  - [Step 7: Register Your Sketch](#step-7-register-your-sketch)
- [Sketch System Utilities](#sketch-system-utilities)
  - [Control Panel](#control-panel)
  - [Interactive Controls](#interactive-controls)
  - [Visual Effects](#visual-effects)
- [Accessibility Guidelines](#accessibility-guidelines)
- [Performance Considerations](#performance-considerations)
- [Documentation](#documentation)
- [Testing](#testing)
- [Online Resources](#online-resources)
- [Community](#community)

## Code of Conduct

We are committed to providing a welcoming and inclusive experience for everyone. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

### Development Environment

To contribute to Vidyut, you'll need:

- **Node.js** (v14.x or higher)
- **npm** (v7.x or higher) or **yarn** (v1.22.x or higher)
- A code editor (we recommend VS Code with the following extensions):
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript support

### Project Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/vidyut.git
   cd vidyut
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```
4. Create a branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```
5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
6. Visit `http://localhost:3000` to see the application running

## Development Workflow

### Branching Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/feature-name` - Individual feature branches
- `bugfix/issue-number` - Bug fix branches
- `docs/topic` - Documentation updates

### Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) for clear, structured commit messages:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Types include:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `perf`: Performance improvements
- `test`: Adding or modifying tests
- `chore`: Changes to the build process or auxiliary tools

### Pull Requests

1. Update your branch with the latest changes from the upstream develop branch
2. Ensure your code passes all tests and linting
3. Submit a pull request to the `develop` branch
4. Include a clear description of the changes
5. Reference any related issues using GitHub's linking syntax
6. Wait for review and address any feedback

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define interfaces and types for all props, state, and function parameters
- Aim for strict type safety with minimal use of `any`
- Use functional components with hooks rather than class components

Example:

```typescript
// Define clear interfaces for your component props
interface ControlPanelProps {
  parameters: Parameter[];
  onParameterChange: (id: string, value: number) => void;
  isActive: boolean;
}

// Use the interface in your functional component
const ControlPanel: React.FC<ControlPanelProps> = ({ 
  parameters, 
  onParameterChange,
  isActive 
}) => {
  // Component implementation
};
```

### React & Next.js

- Use the App Router for routing
- Implement server components where appropriate
- Keep components focused on a single responsibility
- Use custom hooks to abstract complex logic
- Implement proper error boundaries

### CSS & Tailwind

- Use Tailwind CSS for most styling needs
- Create custom utilities in the Tailwind config when needed
- Use CSS modules for complex custom styles that go beyond Tailwind
- Maintain the retro aesthetic with consistent use of:
  - Neon colors (blues, magentas, greens)
  - Pixelated fonts and UI elements
  - Glow effects and scan lines

### p5.js Integration

- Create p5.js sketches using the provided `p5SketchSystem` utilities
- Use the type-safe approach for all p5.js sketch components
- Follow the sketch lifecycle pattern with setup, draw, and (optional) resize functions
- Make sketches responsive and interactive
- Add educational overlays to explain concepts

## The p5SketchSystem

### p5SketchSystem Overview

The p5SketchSystem is a custom utility framework built to streamline the creation of interactive p5.js sketches within our React application. It provides a consistent architecture for sketch development with built-in features for:

- Sketch lifecycle management (setup, draw, resize)
- Control panel and interactive UI elements
- State management with TypeScript type safety
- Visual effects and common utilities
- Responsive canvas sizing

This system enables developers to focus on the creative and educational aspects of each sketch while providing a consistent user interface and experience.

### Key Components

The p5SketchSystem consists of several key parts:

1. **Sketch Creation**
   ```typescript
   // The createSketch function handles the p5.js lifecycle
   const sketch = createSketch(
     options,     // Sketch options (speed, size, controlPanel settings)
     setupFn,     // Called once during initialization
     drawFn,      // Called every frame to render the sketch
     resizeFn     // Optional function called when window resizes
   );
   ```

2. **Context System**
   ```typescript
   // The SketchContext provides access to p5, controlPanel, and state
   interface SketchContext {
     p: p5;                        // The p5 instance
     controlPanel: p5.Element | null; // The control panel element
     controls: Record<string, unknown>; // Storage for controls and state
     settings: ControlSettings;    // User-provided settings
     width: number;                // Canvas width
     height: number;               // Canvas height
     registerControl: <T>(name: string, control: T) => void; // Store state
     getControl: <T>(name: string) => T | undefined; // Retrieve state
   }
   ```

3. **UI Controls**
   ```typescript
   // Control panel and interactive elements
   const panel = createControlPanel(p, options);
   const slider = createSliderControl(p, panel, label, min, max, value);
   const toggle = createToggleControl(p, panel, onText, offText);
   ```

4. **Visual Effects**
   ```typescript
   // Utilities for visual enhancements
   addGlowEffect(p, color, blurAmount, alpha);
   const trail = createTrailManager<T>(maxLength);
   ```

The system uses TypeScript generics and type safety throughout to ensure a smooth development experience.

## Adding New Sketches

To create a new interactive sketch for Vidyut, follow these steps:

### Step 1: Create the Component File

Create a new file in `src/components/sketches/` with a descriptive name for your sketch:

```tsx
// src/components/sketches/MyNewSketch.tsx
'use client';

import React from 'react';
import { ControlSettings } from '@/types';
import P5Wrapper from './P5Wrapper';
import { 
  createSketch, 
  createSliderControl, 
  createToggleControl,
  addGlowEffect,
  SketchContext
} from '@/utils/p5SketchSystem';
```

### Step 2: Define Your State Interface

Create TypeScript interfaces for your sketch state:

```tsx
// Define a clear interface for your sketch's state
// This improves type safety and makes your code more maintainable
interface MySketchState {
  // Properties specific to your sketch
  parameter1: number;  // A numeric parameter that controls some aspect of the sketch
  parameter2: number;  // Another parameter that affects the visualization
  someProperty: string;  // Any other properties needed for your sketch
  // Add any other properties needed for your sketch's state
}
```

### Step 3: Set Up the Sketch Function

Create your sketch component:

```tsx
const MyNewSketch: React.FC<ControlSettings> = ({ speed = 5, size = 5 }) => {
  // Create the sketch using our utility function
  const sketch = createSketch(
    { 
      speed,  // Pass through the speed prop from parent component 
      size,   // Pass through the size prop from parent component
      controlPanel: {
        theme: 'retro',  // Use retro theme for the control panel
        position: 'bottom-left',  // Position control panel at bottom-left of canvas
        title: 'MY NEW SKETCH'  // Display title at top of control panel
      }
    },
    // Setup function will be implemented in step 4
    setupFn,
    // Draw function will be implemented in step 5
    drawFn,
    // Optional resize function will be implemented in step 6
    resizeFn
  );

  // Return the P5Wrapper with our sketch function
  return <P5Wrapper sketch={sketch} />;
};

export default MyNewSketch;
```

### Step 4: Implement the Setup Function

The setup function initializes your sketch state and UI controls:

```tsx
const setupFn = (ctx: SketchContext) => {
  const { p, controlPanel, settings } = ctx;
  
  // Use null coalescing to handle potential undefined values
  // This ensures we have default values even if settings are missing
  const speedValue = settings.speed ?? 5;
  const sizeValue = settings.size ?? 5;
  
  // Create initial state object based on our interface
  const sketchState: MySketchState = {
    parameter1: speedValue * 2,  // Convert the generic speed to a sketch-specific parameter
    parameter2: sizeValue * 10,  // Convert the generic size to a sketch-specific parameter
    someProperty: 'initial value'
  };
  
  // Register state in context for access in the draw function
  ctx.registerControl('sketchState', sketchState);
  
  // Create UI controls (if controlPanel exists)
  if (controlPanel) {
    // Create a slider control for parameter1
    const param1Control = createSliderControl(
      p,                         // p5 instance
      controlPanel,              // Parent element
      'PARAMETER 1',             // Label text
      0,                         // Minimum value
      100,                       // Maximum value
      sketchState.parameter1,    // Initial value
      1,                         // Step size
      val => val.toFixed(0),     // Format function to display integer values
      value => {                 // Change handler
        sketchState.parameter1 = value;  // Update state when slider changes
      }
    );
    
    // Create another slider for parameter2
    const param2Control = createSliderControl(
      p,
      controlPanel,
      'PARAMETER 2',
      0,
      100,
      sketchState.parameter2,
      5,                        // Larger step size for this parameter
      val => val.toFixed(0),
      value => {
        sketchState.parameter2 = value;
      }
    );
    
    // Create a toggle button to show/hide controls
    const toggleControls = createToggleControl(
      p,
      controlPanel,
      'HIDE CONTROLS',          // Text when controls are visible
      'SHOW CONTROLS',          // Text when controls are hidden
      true,                     // Initially visible
      [                         // Elements to toggle
        param1Control.slider,
        param1Control.labelEl,
        param2Control.slider,
        param2Control.labelEl
      ]
    );
    
    // Register controls for access in draw function if needed
    ctx.registerControl('param1Control', param1Control);
    ctx.registerControl('param2Control', param2Control);
    ctx.registerControl('toggleControls', toggleControls);
  }
};
```

### Step 5: Implement the Draw Function

The draw function runs every frame and renders your sketch:

```tsx
const drawFn = (ctx: SketchContext) => {
  const { p } = ctx;
  
  // Retrieve the sketch state from the context
  // Use type assertion for type safety
  const sketchState = ctx.getControl<MySketchState>('sketchState');
  
  // Always check if state exists before using it
  if (!sketchState) return;
  
  // Clear the background with slight opacity for trail effect
  p.background(0, 20); // Black with slight trail effect
  
  // Draw something based on your sketch state
  p.fill(255);
  p.noStroke();
  p.ellipse(
    p.width / 2,               // Center X position
    p.height / 2,              // Center Y position
    sketchState.parameter1,    // Width controlled by parameter1
    sketchState.parameter2     // Height controlled by parameter2
  );
  
  // Add visual effects like glow
  addGlowEffect(p, [255, 100, 200]);
  
  // Display information about the sketch state
  p.fill(255);
  p.textSize(12);
  p.textAlign(p.LEFT);
  p.text(`Parameter 1: ${sketchState.parameter1}`, 20, 30);
  p.text(`Parameter 2: ${sketchState.parameter2}`, 20, 50);
};
```

### Step 6: Add Optional Resize Function

If your sketch needs special handling when the window is resized:

```tsx
const resizeFn = (ctx: SketchContext) => {
  const { p } = ctx;
  
  // Retrieve the sketch state from the context
  const sketchState = ctx.getControl<MySketchState>('sketchState');
  
  if (sketchState) {
    // Update state based on new dimensions if needed
    // For example, recalculate positions relative to canvas size
    
    // Example: If you had elements positioned based on canvas size,
    // you would update them here
  }
};
```

### Step 7: Register Your Sketch

Add your new sketch to the sketch registry in `src/data/sketches.ts`:

```tsx
// src/data/sketches.ts
import MyNewSketch from '@/components/sketches/MyNewSketch';

export const sketches: SketchInfo[] = [
  // ... other sketches
  {
    id: 'my-new-sketch',              // Unique identifier for the sketch
    name: 'My New Sketch',            // Display name in the UI
    description: 'This is my awesome new interactive sketch!', // Description
    component: MyNewSketch,           // The sketch component
    defaultControls: {                // Default control values
      speed: 5,
      size: 5
    }
  }
];
```

## Sketch System Utilities

### Control Panel

The system provides a customizable control panel with three theme options:

```tsx
// Control panel configuration options
controlPanel: {
  theme: 'retro',        // Theme options: 'retro', 'dark', or 'light'
  position: 'bottom-left', // Position options: 'top-left', 'top-right', 'bottom-left', or 'bottom-right'
  title: 'SKETCH TITLE',   // Optional title displayed at the top of the panel
  width: '200px',          // Optional width (default is '200px')
  visible: true            // Optional initial visibility (default is true)
}
```

### Interactive Controls

#### Slider Control

```tsx
// Create a slider with label and value display
const sliderControl = createSliderControl(
  p,                     // p5 instance
  controlPanel,          // Parent element
  'LABEL TEXT',          // Label for the control
  0,                     // Minimum value
  100,                   // Maximum value
  50,                    // Initial value
  1,                     // Step size (optional, default is 1)
  val => val.toFixed(1), // Format function (optional)
  value => {             // Change handler (optional)
    // Update sketch state when slider changes
    sketchState.someValue = value;
  }
);

// The returned object contains:
// - slider: The p5.Element for the slider
// - labelEl: The p5.Element for the label
// - getValue(): Function to get the current value
// - setValue(val): Function to set the value programmatically
```

#### Toggle Button

```tsx
// Create a toggle button
const toggleControl = createToggleControl(
  p,                   // p5 instance
  controlPanel,        // Parent element
  'ON TEXT',           // Text when state is true
  'OFF TEXT',          // Text when state is false
  true,                // Initial state (default is true)
  [element1, element2] // Elements to show/hide (optional)
);

// The returned object contains:
// - button: The p5.Element for the button
// - state(): Function to get the current state
```

### Visual Effects

#### Glow Effect

```tsx
// Add a glow to subsequently drawn elements
addGlowEffect(
  p,                  // p5 instance
  [255, 0, 255],      // Color (RGB array or CSS color string)
  15,                 // Blur amount (optional, default is 15)
  0.8                 // Alpha (optional, default is 0.8)
);

// Example usage:
addGlowEffect(p, [0, 255, 255]); // Cyan glow
p.ellipse(100, 100, 50);         // This ellipse will have the glow effect
```

#### Trail Manager

```tsx
// Create a trail manager for tracking positions or other data
const trail = createTrailManager<p5.Vector>(50); // 50 = max length

// Add a point to the trail
trail.add(p.createVector(x, y));

// Get all points in the trail
const points = trail.getPoints();

// Draw the trail
p.beginShape();
for (const point of points) {
  p.vertex(point.x, point.y);
}
p.endShape();

// Clear the trail if needed
trail.clear();
```

## Accessibility Guidelines

- Maintain a minimum contrast ratio of 4.5:1 for text
- Ensure all interactive elements are keyboard accessible
- Provide alternative methods for color-dependent interactions
- Include proper ARIA labels for custom controls
- Test with screen readers periodically
- Ensure animations can be paused or disabled

## Performance Considerations

- Optimize p5.js sketches to maintain 60fps
- Implement requestAnimationFrame for complex animations
- Use React.memo and useMemo for expensive computations
- Lazy load sketches that aren't immediately visible
- Implement proper cleanup of event listeners and animations
- Consider device capabilities and provide simplified versions for less powerful devices

## Documentation

- Document all components, hooks, and utilities with JSDoc comments
- Keep the README updated with new features and changes
- Include explanations of educational concepts for each sketch
- Document the educational purpose of each interactive element

## Testing

- Write unit tests for utilities and hooks
- Create component tests for UI elements
- Add integration tests for important user flows
- Test across different browsers and devices
- Verify accessibility with automated tools

## Online Resources

Here are helpful resources for working with the technologies used in Vidyut:

### p5.js Resources
- [p5.js Official Documentation](https://p5js.org/reference/)
- [p5.js Examples](https://p5js.org/examples/)
- [The Coding Train p5.js Tutorials](https://thecodingtrain.com/tracks/code-programming-with-p5-js)
- [Nature of Code](https://natureofcode.com/) - Great resource for simulations

### TypeScript Resources
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### React Resources
- [React Documentation](https://react.dev/learn)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Educational Coding Resources
- [CS Teaching Tips](https://csteachingtips.org/)
- [Teaching with Visualizations](https://teachingwithvisualization.org/)
- [Interactive Mathematics](https://www.intmath.com/)
- [Explorable Explanations](https://explorabl.es/)

## Community

- Join our [Discord server](https://discord.gg/example) for discussions
- Check the [Issues](https://github.com/example/vidyut/issues) page for tasks to work on
- Participate in code reviews to help others
- Share your ideas for new sketches or improvements

Thank you for contributing to making coding education more accessible and fun for kids through Vidyut!
