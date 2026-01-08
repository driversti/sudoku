# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A modern, full-featured Sudoku web game with a React frontend and Node.js/Express backend. Features include online leaderboards, daily challenges, pencil marks, undo/redo, multiple themes, and persistent game state.

## Development Commands

### Full Stack Development (from root)
- `npm run dev` - Start both frontend and backend in parallel
- `npm run build` - Build both frontend and backend for production
- `npm run db:up` / `npm run db:down` - Start/stop PostgreSQL via Docker

### Backend (`backend/`)
- `npm run dev` - Start development server with hot reload (tsx watch)
- `npm run build` - Compile TypeScript to `dist/`
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

### Frontend (`frontend/`)
- `npm run dev` - Start Vite dev server on port 5173
- `npm run build` - Build for production (TypeScript check + Vite build)
- `npm run lint` - Run ESLint
- `npm run test` - Run Vitest tests in watch mode
- `npm run test:ui` - Run Vitest with UI
- `npm run test:run` - Run tests once

## Architecture

### Monorepo Structure
- **Frontend**: React 18 + TypeScript, Vite build system, runs on port 5173
- **Backend**: Express + TypeScript, runs on port 3001
- **Database**: PostgreSQL with Prisma ORM

### Core Game Logic (Frontend)

The Sudoku game logic is self-contained in the frontend at `frontend/src/lib/sudoku/`:

- **`generator.ts`**: Creates valid Sudoku puzzles using backtracking algorithm
  - Generates complete solution, then removes cells while ensuring unique solution
  - Supports deterministic generation via seed for daily challenges
  - Difficulty based on cells revealed (Easy: 36-40, Expert: 17-23)

- **`solver.ts`**: Validation and solving utilities
  - `isValidPlacement()` - Checks row, column, and 3x3 box constraints
  - `solve()` - Backtracking solver that can count solutions
  - Used for puzzle validation and hint system

### State Management

**Zustand Store** (`frontend/src/stores/gameStore.ts`):
- Central game state: board, puzzle, solution, pencil marks, timer, moves
- User actions: cell selection, value input, undo/redo
- Persistence middleware auto-saves to localStorage
- Complete move history for undo/redo functionality

**React Query** (`@tanstack/react-query`):
- API calls to backend (leaderboard, auth, daily challenge)
- Caching and stale-while-revalidate for scores/challenges

### Key Components

- **Board** (`frontend/src/components/Board.tsx`): 9x9 grid with cell highlighting
- **Cell** (`frontend/src/components/Cell.tsx`): Individual cells with pencil mark support
- **NumberPad**: Input controls (1-9, pencil mode toggle, erase, undo)
- **Game Features**: Hint system, pause/resume, theme switcher

### Database Schema (Prisma)

Located in `backend/prisma/schema.prisma`:
- `Player`: User accounts with username/password hash
- `Score`: Game results linked to player and difficulty
- `Difficulty` enum: EASY, MEDIUM, HARD, EXPERT

## Important Implementation Details

### Daily Challenges
Daily challenges use seeded random number generation in `generator.ts` to ensure all players get the same puzzle each day. The seed is based on the current date.

### Undo/Redo System
The game store maintains a complete history of moves. Each move records the previous state before changes, allowing full undo/redo functionality.

### Pencil Marks
Candidates are stored per cell as `Set<number>` in the game state. The pencil mode toggle in NumberPad switches between entering final values and adding/removing pencil marks.

### Authentication
JWT-based authentication stored in localStorage. Backend middleware protects routes like score submission.

### Docker Deployment
The `docker-compose.yml` sets up PostgreSQL. Production uses Nginx to serve the built frontend and proxy backend requests.
