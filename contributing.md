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
- [Adding New Sketches](#adding-new-sketches)
- [Accessibility Guidelines](#accessibility-guidelines)
- [Performance Considerations](#performance-considerations)
- [Documentation](#documentation)
- [Testing](#testing)
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
interface ControlPanelProps {
  parameters: Parameter[];
  onParameterChange: (id: string, value: number) => void;
  isActive: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ parameters, onParameterChange, isActive }) => {
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

- Create p5.js sketches as React components using the react-p5 library
- Implement p5.js sketches in instance mode, not global mode
- Define all sketch parameters as props for easy manipulation
- Optimize sketches for performance (especially particle systems)
- Include clear educational overlays

Example:

```typescript
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { P5SketchProps } from '@/types/sketch';

// Import p5 dynamically to avoid SSR issues
const Sketch = dynamic(() => import('react-p5').then(mod => mod.default), {
  ssr: false
});

interface BouncingBallSketchProps extends P5SketchProps {
  gravity: number;
  elasticity: number;
}

const BouncingBallSketch: React.FC<BouncingBallSketchProps> = ({
  width,
  height,
  gravity,
  elasticity
}) => {
  let ball = {
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    radius: 20
  };

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(width, height).parent(canvasParentRef);
    ball.position = { x: width / 2, y: height / 2 };
    ball.velocity = { x: p5.random(-5, 5), y: 0 };
  };

  const draw = (p5) => {
    p5.background(0);

    // Physics logic
    ball.velocity.y += gravity;
    ball.position.x += ball.velocity.x;
    ball.position.y += ball.velocity.y;

    // Collision detection
    if (ball.position.y > height - ball.radius) {
      ball.position.y = height - ball.radius;
      ball.velocity.y *= -elasticity;
    }

    if (ball.position.x < ball.radius || ball.position.x > width - ball.radius) {
      ball.velocity.x *= -elasticity;
    }

    // Render
    p5.fill(0, 255, 255);
    p5.stroke(255, 0, 255);
    p5.strokeWeight(2);
    p5.circle(ball.position.x, ball.position.y, ball.radius * 2);
  };

  return <Sketch setup={setup} draw={draw} />;
};

export default BouncingBallSketch;
```

## Adding New Sketches

1. Create a new TypeScript file in `components/sketches/`
2. Implement the sketch following the p5.js integration guidelines
3. Define appropriate props and interfaces for parameters
4. Add educational overlays explaining the concept
5. Register the sketch in `data/sketches.ts`
6. Add control panel configuration in `data/controls.ts`

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

## Community

- Join our [Discord server](https://discord.gg/example) for discussions
- Check the [Issues](https://github.com/example/vidyut/issues) page for tasks to work on
- Participate in code reviews to help others
- Share your ideas for new sketches or improvements

Thank you for contributing to making coding education more accessible and fun for kids through Vidyut!
