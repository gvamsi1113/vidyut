# Retro Code Explorer

A retro console-themed educational website using p5.js to help kids learn coding concepts through interactive visualizations.

## Overview

This project creates an interactive educational platform styled like a retro gaming console. It features various p5.js sketches that demonstrate coding and physics concepts in a way that's engaging for kids.

## Features

- Retro console UI with pixelated fonts and neon colors
- Interactive p5.js sketches demonstrating different concepts
- Interactive controls to modify sketch parameters in real-time
- Responsive design that works on various screen sizes

## Included Sketches

1. **Bouncing Ball**: Basic physics simulation of a ball bouncing around the screen
2. **Wave Patterns**: Interactive wave patterns demonstrating sine/cosine concepts
3. **Particle System**: Complex particle system with interactive mouse forces
4. **Pendulum Physics**: Simple pendulum simulation showing basic physics principles

## Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technology Stack

- **Next.js**: React framework for server rendering and routing
- **React**: UI library for component-based development
- **p5.js**: JavaScript library for creative coding visualizations
- **CSS**: Custom styling for the retro console interface

## Project Structure

```
retro-code-explorer/
├── components/        # React components
│   ├── sketches/      # P5.js sketch components
│   ├── ConsoleFrame.js
│   ├── ControlPanel.js
│   └── ...
├── pages/             # Next.js pages
│   ├── _document.js
│   ├── index.js
│   └── ...
├── styles/            # CSS styles
│   ├── globals.css
│   └── ...
├── public/            # Static assets
├── package.json       # Project dependencies
└── next.config.js     # Next.js configuration
```

## Customization

### Adding New Sketches

1. Create a new sketch component in the `components/sketches/` directory
2. Import and add it to the `SKETCH_COMPONENTS` object in `components/GameScreen.js`
3. Add it to the sketches array in `pages/index.js`
4. Add custom control labels in `components/ControlPanel.js`

### Modifying UI

The retro console styling can be customized in `styles/globals.css`. Key elements include:

- Color scheme (defined in CSS variables at the top)
- Console frame dimensions and styling
- Typography and pixel-style effects

## Development

### Requirements

- Node.js 14.x or higher
- npm 7.x or higher

### Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT
