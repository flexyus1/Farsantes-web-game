# Farsantes

A logic puzzle game where players must identify liars among a group of colorful blob characters through deductive reasoning.

🚧 **This project is still a work in progress** 🚧

![hippo](https://s1.gifyu.com/images/SOOEU.gif)

A preview version is available at [farsant.es](https://farsant.es)  
*Psst... you can see the answer for the daily game in the browser console* 😉

## Project Structure

The project is organized as a monorepo with three main packages:

```plaintext
packages/
├── common/   # Shared types, utilities, and game logic
├── frontend/ # Browser-based game UI
└── backend/  # Express.js server
```

## Features

- **Multiple Difficulty Levels**: Easy, Medium, and Hard modes
- **Tutorial Levels**: Guides to help new players learn the mechanics
- **Daily Challenges**: Fresh puzzles each day
- **Progress Saving**: Resume your game anytime
- **Solution Validation**: Checks for correct answers
- **Hint System**: Get help when you’re stuck
- **Mobile-Friendly Interface**: Play on any device

## Development

### Frontend Development

The frontend is built with TypeScript and uses Webpack for bundling. Key features include:

- **Responsive Design**: Optimized for both mobile and desktop
- **Save States**: Allows players to save and resume puzzle progress
- **Interactive Blob Characters**: Animations bring the characters to life

### Backend Development

The backend uses Express.js and provides:

- **Level Generation and Validation**: Creates and verifies puzzle configurations
- **Daily Puzzle System**: Generates a new puzzle every day
- **API Endpoints**: Enables saving and retrieving game state

### Common Package

The common package contains shared game logic, including:

- **Level Generation Algorithms**: Generates unique puzzle configurations
- **Solution Validation**: Ensures player solutions are correct
- **Type Definitions**: For consistent data types across packages
- **Utility Functions**: Helper functions used throughout the game
