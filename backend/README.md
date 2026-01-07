# Sudoku Web - Backend API

Express.js REST API for the Sudoku web game with online leaderboards and authentication.

## Features

- **Authentication**: User registration and login with JWT tokens
- **Leaderboards**: Global leaderboards per difficulty level
- **Daily Challenges**: Seed-based daily puzzles
- **Rate Limiting**: Protects against API abuse
- **Input Validation**: Ensures data integrity

## Prerequisites

- Node.js 18+
- PostgreSQL (running via Docker or locally)

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```

   Required environment variables:
   ```env
   DATABASE_URL="postgresql://sudoku:sudoku_dev_password@localhost:5432/sudoku_db?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   PORT=3001
   NODE_ENV=development
   CORS_ORIGIN="http://localhost:5173"
   ```

3. **Start PostgreSQL**:
   ```bash
   # From project root
   docker-compose up -d
   ```

4. **Run database migrations**:
   ```bash
   npm run prisma:migrate
   ```

5. **Generate Prisma Client**:
   ```bash
   npm run prisma:generate
   ```

## Development

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info (requires auth)

### Leaderboard

- `GET /api/leaderboard/:difficulty` - Get leaderboard for difficulty
- `POST /api/leaderboard` - Submit score (requires auth)
- `GET /api/leaderboard/player/:playerId` - Get player's best scores (requires auth)

### Daily Challenges

- `GET /api/daily/:date/:difficulty` - Get daily challenge seed
- `POST /api/daily/complete` - Submit daily completion (requires auth)

## Database Schema

```prisma
model Player {
  id        String   @id @default(cuid())
  username  String   @unique
  password  String?  // Optional for simple username-only mode
  createdAt DateTime @default(now())
  scores    Score[]
}

model Score {
  id           String     @id @default(cuid())
  playerId     String
  player       Player     @relation(fields: [playerId], references: [id])
  difficulty   Difficulty
  timeSeconds  Int
  moves        Int
  hintsUsed    Int          @default(0)
  completedAt  DateTime    @default(now())

  @@index([difficulty, timeSeconds])
}

enum Difficulty {
  EASY
  MEDIUM
  HARD
  EXPERT
}
```

## Prisma Commands

```bash
# Open Prisma Studio (database GUI)
npm run prisma:studio

# Create a new migration
npm run prisma:migrate

# Reset database (dev only)
npx prisma migrate reset
```

## License

MIT
