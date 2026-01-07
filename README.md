# Sudoku Web Game

A modern, full-featured Sudoku web game built with React and Node.js.

## Features

- 🎮 Four difficulty levels (Easy, Medium, Hard, Expert)
- ✏️ Pencil marks for noting candidates
- ↩️ Undo/Redo functionality
- 💡 Hint system
- ⏱️ Timer and move counter
- 🎨 Multiple themes (Light, Dark, Sepia, Blue)
- 📅 Daily challenges
- 🏆 Online leaderboards
- 📊 Statistics tracking
- 💾 Auto-save game progress

## Project Structure

```
sudoku-web/
├── frontend/       # React + TypeScript frontend (Vite)
├── backend/        # Node.js + Express backend API
└── docker-compose.yml
```

## Getting Started

### Prerequisites

- Node.js 18+
- Docker (for PostgreSQL)

### Backend Setup

1. Start PostgreSQL:
```bash
docker-compose up -d
```

2. Install dependencies and run migrations:
```bash
cd backend
npm install
npm run prisma:migrate
npm run prisma:generate
```

3. Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:3001`

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Development

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run prisma:studio` - Open Prisma Studio

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Tech Stack

### Frontend
- React 18+ with TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Zustand (state management)
- React Query (API calls)
- Dexie.js (IndexedDB)

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT authentication

## License

MIT
