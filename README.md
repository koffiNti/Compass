# Compass - AI-Powered Personal Operating System

> **Compass** is a second brain and AI-powered personal operating system that records your life, analyzes daily habits, tracks long-term goals, and evaluates personal discipline over multi-year horizons. Inspired by Apple's software design philosophy: minimal, beautiful, fast, calm, dark mode first, with zero clutter.

---

## Architecture Stack

* **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion, Recharts, Lucide Icons, Zustand State Store.
* **Backend**: Python 3.13, FastAPI, Pydantic v2, SQLAlchemy 2.0 Async, Passlib/Bcrypt, PyJWT.
* **Database**: PostgreSQL 16 + `pgvector` vector database extension (with SQLite `aiosqlite` dev fallback).
* **AI Provider Abstraction**: Modular Strategy pattern supporting OpenAI (GPT-4o), Anthropic (Claude 3.5 Sonnet), Google Gemini (1.5 Pro), and Local LLMs (Ollama / vLLM).
* **Deployment**: Docker & Docker Compose containerization.

---

## Quick Start Guide

### 1. Run with Docker Compose
```bash
docker-compose up -d --build
```
Access the application at `http://localhost`.

### 2. Manual Development Setup

#### Backend:
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### Frontend:
```bash
cd frontend
npm install
npm run dev
```
Access the application at `http://localhost:3000`.

---

## Key Modules & Features

1. **Overview & Daily Picture**: Live greeting, state of mind meters, habit execution strip, coding/study output summaries.
2. **Rich Daily Journal**: Markdown editor with mood/energy sliders, wins, challenges, gratitude, tags, and date browsing.
3. **Daily Metrics**: Configurable tracking for coding minutes, study hours, lecture attendance, gym, sleep, water, and trading notes.
4. **Habit Tracker**: Custom habit creation, daily log check-ins, current & record streak calculation, 365-day consistency heatmaps.
5. **Multi-Horizon Goals Engine**: Tiered goal management across Long-term, Quarterly, Monthly, Weekly, and Daily objectives with progress bars.
6. **Software Projects Hub**: Repository tracker with tech stack tags, milestone checklists, and architectural notes.
7. **Knowledge Vault & RAG Search**: Document chunking engine and vector similarity search.
8. **AI Personal Operating Coach**: Automated daily summaries, weekly reviews, monthly reviews, and diagnostic Q&A.
9. **AI Universal Search**: Natural language querying across all journals, vault items, projects, and metrics.
10. **Interactive Analytics & Command Palette**: Multi-year Recharts visualizations and global `Cmd+K` keyboard navigation overlay.

---

## License

MIT License - Developed for Compass OS.
