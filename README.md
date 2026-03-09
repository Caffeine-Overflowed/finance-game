# Finance Game

**A multiplayer life simulation where every financial decision shapes your future**

![Python](https://img.shields.io/badge/Python-3.13-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)
![Strawberry GraphQL](https://img.shields.io/badge/Strawberry_GraphQL-0.281-E10098?logo=graphql&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini_AI-2.5-4285F4?logo=google&logoColor=white)

Finance Game is a turn-based multiplayer game where players navigate life's financial decisions across different age stages. AI-generated scenarios adapt to each player's history, creating unique storylines. No account needed — jump in with an anonymous session or sign in with Google.

## Architecture

```mermaid
graph LR
    Client["Next.js Client"] -->|GraphQL + Polling| API["FastAPI + Strawberry"]
    API --> DB["PostgreSQL"]
    API --> Cache["Redis"]
    API -->|Structured JSON| AI["Gemini AI"]
```

## Features

- **AI-Generated Scenarios** — Gemini creates personalized financial dilemmas based on each player's age group and decision history
- **Multiplayer Lobbies** — Create a game, share the code, and play with friends in real-time
- **Turn-Based Gameplay** — Players progress through life stages (childhood → retirement), making choices that affect their score
- **Dual Authentication** — Full JWT auth for registered users, plus anonymous session tokens for instant play
- **Live Game State** — Frontend polls every 500ms for seamless multiplayer synchronization
- **Leaderboard & Results** — Final rankings with AI-generated life summaries for each player
- **Google OAuth** — Optional account linking for persistent game history
- **Canvas Confetti** — Celebratory animations for winners

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 15, React 19, TypeScript, Apollo Client, Zustand, Tailwind CSS 4, Motion |
| **Backend** | FastAPI, Strawberry GraphQL, SQLAlchemy 2.0 (async), Alembic, Pydantic |
| **AI** | Google Gemini 2.5 (structured JSON output for questions and life summaries) |
| **Database** | PostgreSQL 15, Redis 7 |
| **Auth** | JWT tokens + anonymous participant sessions, Google OAuth 2.0, bcrypt |
| **DevOps** | Docker, Docker Compose |

## Screenshots

> _Screenshots coming soon_

## Getting Started

### Prerequisites

- Python 3.11+ with [Poetry](https://python-poetry.org/)
- Node.js 18+
- Docker & Docker Compose
- Google Gemini API key

### 1. Start infrastructure

```bash
docker compose up -d
```

This starts PostgreSQL and Redis.

### 2. Backend setup

```bash
cd backend
cp .env.example .env
# Fill in your secrets (especially GEMINI_API_KEY)

poetry install
alembic upgrade head
uvicorn app:app --reload --port 8000
```

The GraphQL API will be available at `http://localhost:8000/graphql`.

### 3. Frontend setup

```bash
cd frontend
cp .env.example .env

npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

## Game Flow

```mermaid
stateDiagram-v2
    [*] --> Lobby: Create/Join Game
    Lobby --> InProgress: Leader Starts
    InProgress --> GeneratingQuestion: New Turn
    GeneratingQuestion --> Answering: AI Ready
    Answering --> WaitingForPlayers: Submit Answer
    WaitingForPlayers --> GeneratingQuestion: All Answered
    WaitingForPlayers --> Results: Final Turn
    Results --> [*]: Game Over
```

1. **Leader creates a game** and shares the join code
2. **Players join the lobby** (with or without an account)
3. **Leader starts the game** — AI generates the first scenario
4. **Each turn**: players receive personalized questions and choose from multiple options
5. **Between turns**: intermediate leaderboard shows current standings
6. **Final round**: AI generates a life summary for each player based on all their choices
7. **Results**: podium rankings with scores

## API Overview

**Key operations:**

| Domain | Operations |
|--------|-----------|
| **Auth** | `register`, `login`, `googleAuth`, `refreshTokens` |
| **Game** | `createGame`, `startGame`, `getGame`, `getGameByCode` |
| **Participation** | `joinGame`, `getParticipants` |
| **Turns** | `advanceTurn`, `markTurnReady`, `getCurrentTurn` |
| **Choices** | `submitChoice`, `getChoices`, `getQuestions` |
| **Results** | `getGameResults`, `getLeaderboard` |

## Project Structure

```
finance-game/
├── docker-compose.yml          # Local dev infrastructure
├── backend/
│   ├── app/
│   │   ├── ai/                 # Gemini client, prompts, generation
│   │   ├── config/             # Configuration management
│   │   ├── models/             # SQLAlchemy ORM (game, turns, questions, choices)
│   │   ├── repositories/       # Data access layer
│   │   ├── services/           # Game logic, auth, AI integration
│   │   ├── graphql/
│   │   │   ├── mutations/      # Game management, turn progression
│   │   │   ├── queries/        # Game state, results
│   │   │   └── schema.py
│   │   └── utils/              # Auth, DB, logging helpers
│   ├── alembic/                # Database migrations
│   └── pyproject.toml
└── frontend/
    ├── src/
    │   ├── app/                # Next.js App Router
    │   │   ├── auth/           # Login/signup/OAuth
    │   │   └── game/           # Game pages (lobby, question, results)
    │   ├── features/
    │   │   ├── game/           # Game containers and UI components
    │   │   └── auth/           # Authentication forms
    │   └── shared/             # Apollo client, stores, hooks
    └── package.json
```
