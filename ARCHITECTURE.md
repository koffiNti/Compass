# Compass - AI-Powered Personal Operating System
## System Architecture & Product Blueprint

> **System Vision**: Compass is an AI-powered personal operating system ("second brain") designed to record life events, analyze daily habits, evaluate long-term goals, and cultivate discipline over multi-year horizons. Built with an Apple-inspired minimalist aesthetic (dark mode first, calm, fast, clutter-free), Compass unifies productivity tracking with modern RAG-driven AI intelligence.

---

## 1. High-Level Architecture Blueprint

Compass follows **Clean Architecture** and **SOLID principles**, enforcing a strict separation between domain logic, persistence, AI provider interfaces, and presentation layers.

```
+-----------------------------------------------------------------------------------+
|                                  FRONTEND LAYER                                   |
|   React 18 + TypeScript + Tailwind CSS + Framer Motion + Radix / shadcn/ui        |
|   - Apple Design System (Dark Mode First, Calm Aesthetic, Glassmorphism)         |
|   - Global Command Palette (Cmd+K) & Keyboard Navigation Shortcuts                |
|   - Reusable Component Library & Responsive Layouts                              |
+-----------------------------------------------------------------------------------+
                                          |
                                   REST / JSON APIs
                                          v
+-----------------------------------------------------------------------------------+
|                                API GATEWAY / FASTAPI                              |
|   - JWT Authentication & Authorization Middleware                                 |
|   - Rate Limiting & Input Validation (Pydantic v2)                                |
|   - Dynamic Route Handlers & Dependency Injection Container                       |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                                   SERVICE LAYER                                   |
|   - JournalService           - MetricService           - HabitService             |
|   - GoalService              - ProjectService          - VaultService             |
|   - AICoachService           - HybridSearchEngine      - AnalyticsEngine          |
+-----------------------------------------------------------------------------------+
                       /                  |                  \
                      /                   |                   \
                     v                    v                    v
+------------------------+   +------------------------+   +-------------------------+
|   REPOSITORY LAYER     |   |   MODULAR AI ENGINE    |   |     VECTOR & RAG        |
|  - SQLAlchemy 2.0 Async|   |  - Unified Provider    |   |  - Hybrid Search Engine |
|  - Postgres Database   |   |    Interface (Strategy) |   |    (Dense + Sparse RRF) |
|  - User Data Repos     |   |  - OpenAI Provider     |   |  - Text Chunking        |
|  - Audit & History     |   |  - Anthropic Provider  |   |  - pgvector Embeddings  |
|                        |   |  - Gemini Provider     |   |                         |
|                        |   |  - Local Ollama / vLLM |   |                         |
+------------------------+   +------------------------+   +-------------------------+
            |                                                           |
            +---------------------------+-------------------------------+
                                        |
                                        v
+-----------------------------------------------------------------------------------+
|                               DATABASE STORAGE                                    |
|   PostgreSQL 16 + pgvector Extension                                              |
|   - Relational Tables (Users, Entries, Habits, Goals, Projects, Metrics)          |
|   - Vector Embeddings (Vault Chunks, Journal Embeddings, 1536d / 768d vectors)    |
|   - Full-Text Search Indices (tsvector, GIN indices)                              |
+-----------------------------------------------------------------------------------+
```

---

## 2. Architectural Decisions & Technical Rationale

### 2.1 Clean Architecture & Repository Pattern
* **Why**: Decouples core domain entities (e.g., habit completion algorithms, streak calculations, goal progress tracking) from framework concerns (FastAPI, SQLAlchemy, PostgreSQL).
* **Benefit**: Enables pure unit testing of business logic without database mocks, supports seamlessly swapping storage implementations, and keeps service interfaces concise.

### 2.2 Unified Database Engine: PostgreSQL + pgvector
* **Why**: Instead of running separate PostgreSQL and Pinecone/Qdrant databases, Compass utilizes **PostgreSQL 16 with pgvector**.
* **Benefit**:
  1. **Single Source of Truth**: Eliminates multi-database synchronization bugs and dual-write transactional failures.
  2. **Relational-Vector Hybrid Queries**: Enables filtered vector searches in a single SQL query (e.g., "Find notes similar to 'procrastination' created between March and June 2026 for Goal X").
  3. **Simplified Infrastructure**: Reduces deployment overhead in Docker Compose.

### 2.3 Modular AI Provider Abstraction (Strategy Pattern)
* **Why**: Proprietary LLM APIs evolve rapidly, pricing fluctuates, and users require strict privacy controls (e.g., local LLM options).
* **Implementation**: Standardized Python abstract base interfaces (`BaseLLMProvider`, `BaseEmbeddingProvider`) defining:
  * `generate_completion(prompt, system_instruction, temperature)`
  * `generate_stream(...)`
  * `generate_embeddings(text_list)`
  * `structured_output(schema, prompt)`
* **Concrete Adapters**:
  * `OpenAIProvider` (GPT-4o, text-embedding-3-small)
  * `AnthropicProvider` (Claude 3.5 Sonnet / Claude 3 Opus)
  * `GeminiProvider` (Gemini 1.5 Pro / Flash)
  * `LocalOllamaProvider` (Llama 3, DeepSeek-R1, mistral)
* **Benefit**: Allows dynamic switching at runtime via environment variables or user settings without changing a single line of business logic.

### 2.4 Hybrid Search Engine for Knowledge Vault (RRF)
* **Why**: Dense vector similarity (cosine) excels at semantic concepts but fails on exact keyword matches (e.g., proper nouns, code snippets, specific project IDs). Full-text search (BM25/tsvector) excels at keyword precision but lacks semantic understanding.
* **Solution**: **Reciprocal Rank Fusion (RRF)** combining pgvector cosine similarity score and PostgreSQL `tsvector` keyword score:
  $$\text{RRF Score}(d) = \frac{1}{k + \text{rank}_{\text{vector}}(d)} + \frac{1}{k + \text{rank}_{\text{keyword}}(d)}$$

### 2.5 Apple-Inspired UI/UX Architecture
* **Dark Mode First Palette**: Deep zinc neutral backgrounds (`#09090b`), soft glassmorphism overlays (`backdrop-blur-md bg-white/5`), subtle borders (`border-white/10`).
* **Typography**: Crisp, highly legible sans-serif hierarchy (SF Pro / Inter variable font) with spacious leading.
* **Motion & Calm**: Framer Motion layout animations for smooth view transitions, progress ring micro-interactions, and instant keyboard navigation (`Cmd+K` Command Palette).

---

## 3. Project Folder Structure

```
compass/
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
├── README.md
├── .env.example
├── .gitignore
│
├── backend/
│   ├── pyproject.toml
│   ├── alembic.ini
│   ├── alembic/
│   │   ├── env.py
│   │   └── versions/
│   └── app/
│       ├── main.py
│       ├── core/
│       │   ├── config.py
│       │   ├── security.py
│       │   ├── db.py
│       │   └── exceptions.py
│       ├── domain/
│       │   ├── models/
│       │   │   ├── user.py
│       │   │   ├── journal.py
│       │   │   ├── metric.py
│       │   │   ├── habit.py
│       │   │   ├── goal.py
│       │   │   ├── project.py
│       │   │   ├── vault.py
│       │   │   ├── review.py
│       │   │   └── notification.py
│       │   └── schemas/
│       │       ├── user_schema.py
│       │       ├── journal_schema.py
│       │       ├── metric_schema.py
│       │       ├── habit_schema.py
│       │       ├── goal_schema.py
│       │       ├── project_schema.py
│       │       ├── vault_schema.py
│       │       ├── ai_schema.py
│       │       └── analytics_schema.py
│       ├── repositories/
│       │   ├── base.py
│       │   ├── user_repository.py
│       │   ├── journal_repository.py
│       │   ├── metric_repository.py
│       │   ├── habit_repository.py
│       │   ├── goal_repository.py
│       │   ├── project_repository.py
│       │   └── vault_repository.py
│       ├── services/
│       │   ├── auth_service.py
│       │   ├── journal_service.py
│       │   ├── metric_service.py
│       │   ├── habit_service.py
│       │   ├── goal_service.py
│       │   ├── project_service.py
│       │   ├── vault_service.py
│       │   ├── ai_coach_service.py
│       │   ├── ai_search_service.py
│       │   └── analytics_service.py
│       ├── ai_providers/
│       │   ├── base.py
│       │   ├── factory.py
│       │   ├── openai_provider.py
│       │   ├── anthropic_provider.py
│       │   ├── gemini_provider.py
│       │   └── local_provider.py
│       └── api/
│           ├── deps.py
│           └── v1/
│               ├── router.py
│               ├── auth.py
│               ├── journal.py
│               ├── metrics.py
│               ├── habits.py
│               ├── goals.py
│               ├── projects.py
│               ├── vault.py
│               ├── coach.py
│               ├── search.py
│               └── analytics.py
│
└── frontend/
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.js
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── index.css
        ├── components/
        │   ├── ui/               # Radix / shadcn core components
        │   │   ├── button.tsx
        │   │   ├── card.tsx
        │   │   ├── dialog.tsx
        │   │   ├── dropdown-menu.tsx
        │   │   ├── input.tsx
        │   │   ├── select.tsx
        │   │   ├── tabs.tsx
        │   │   └── badge.tsx
        │   ├── layout/           # Sidebar, TopNav, Apple-style Container
        │   │   ├── Sidebar.tsx
        │   │   ├── Header.tsx
        │   │   └── AppLayout.tsx
        │   ├── dashboard/        # Greeting, Metrics Bar, Quick Actions
        │   ├── journal/          # Rich Text / Markdown Editor, Tagging
        │   ├── metrics/          # Daily Tracker Config & Input Cards
        │   ├── habits/           # Heatmap, Streaks, Habit Cards
        │   ├── goals/            # Goal Hierarchy, Progress Rings
        │   ├── projects/         # Project Cards, Milestones, Tech Stack
        │   ├── vault/            # Knowledge Cards, Search Bar, Preview
        │   ├── coach/            # AI Conversation UI, Reviews, Insights
        │   ├── analytics/        # Recharts / Framer Motion Visualizations
        │   └── command/          # Cmd+K Command Palette Modal
        ├── hooks/
        │   ├── useAuth.ts
        │   ├── useTheme.ts
        │   ├── useCommandPalette.ts
        │   └── useKeyboardShortcuts.ts
        ├── store/                # Zustand global state modules
        │   ├── authStore.ts
        │   ├── journalStore.ts
        │   ├── metricsStore.ts
        │   ├── habitsStore.ts
        │   └── aiStore.ts
        ├── services/             # Axios API client bindings
        │   ├── api.ts
        │   ├── auth.ts
        │   ├── journal.ts
        │   ├── metrics.ts
        │   ├── habits.ts
        │   ├── goals.ts
        │   ├── projects.ts
        │   ├── vault.ts
        │   ├── coach.ts
        │   └── analytics.ts
        ├── types/                # TypeScript interface definitions
        │   └── index.ts
        └── utils/                # Date formatting, math, helpers
            ├── date.ts
            └── formatters.ts
```

---

## 4. Comprehensive Database Schema

### Entity-Relationship Architecture

```
  +---------------+        +----------------------+        +--------------------+
  |     Users     |------->|   User Preferences   |        |   Notifications    |
  +---------------+        +----------------------+        +--------------------+
    |    |    |
    |    |    +------------+
    |    |                 |
    v    v                 v
+---------------+  +----------------+  +---------------+
| JournalEntry  |  | DailyMetrics   |  |     Habit     |
+---------------+  +----------------+  +---------------+
        |                  |                   |
        v                  v                   v
+---------------+  +----------------+  +---------------+
| JournalEmbed  |  | MetricConfig   |  |   HabitLog    |
+---------------+  +----------------+  +---------------+

    |                      |                   |
    +----------------------+-------------------+
    |
    v
+---------------+  +----------------+  +---------------+
|     Goals     |  |    Projects    |  |  VaultItems   |
+---------------+  +----------------+  +---------------+
        |                  |                   |
        v                  v                   v
+---------------+  +----------------+  +---------------+
| GoalMilestone |  |Proj Milestone  |  | VaultEmbedding|
+---------------+  +----------------+  +---------------+
```

### SQL DDL Definitions

```sql
-- Enable vector & UUID extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Preferences Table
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ai_provider VARCHAR(50) DEFAULT 'openai', -- openai, anthropic, gemini, local
    ai_model VARCHAR(100) DEFAULT 'gpt-4o',
    theme VARCHAR(20) DEFAULT 'dark',
    daily_reminder_time TIME DEFAULT '21:00:00',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Daily Metrics Definition Config
CREATE TABLE metric_definitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    key VARCHAR(50) NOT NULL,            -- e.g. 'coding_minutes', 'lecture_attendance'
    label VARCHAR(100) NOT NULL,          -- e.g. 'Coding Time', 'Lecture Attendance'
    unit VARCHAR(20),                     -- e.g. 'mins', 'boolean', 'scale_1_10', 'glasses'
    metric_type VARCHAR(20) NOT NULL,    -- 'numeric', 'boolean', 'rating'
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Daily Metrics Data Log
CREATE TABLE daily_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    metric_id UUID REFERENCES metric_definitions(id) ON DELETE CASCADE,
    numeric_value FLOAT,
    boolean_value BOOLEAN,
    string_value VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date, metric_id)
);

-- Daily Journal Entries
CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL UNIQUE,
    mood_score INT CHECK (mood_score BETWEEN 1 AND 10),
    energy_score INT CHECK (energy_score BETWEEN 1 AND 10),
    content_markdown TEXT NOT NULL,
    wins TEXT,
    challenges TEXT,
    lessons TEXT,
    gratitude TEXT,
    tomorrow_goals TEXT,
    tags VARCHAR(50)[],
    embedding vector(1536),              -- Dynamic OpenAI/Gemini embedding vector
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Habit Definitions
CREATE TABLE habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'general', -- health, study, coding, mindfulness
    frequency VARCHAR(20) DEFAULT 'daily',  -- daily, weekdays, weekly
    target_count INT DEFAULT 1,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Habit Logs
CREATE TABLE habit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    completed BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(habit_id, date)
);

-- Goals Structure
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    parent_goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    timeframe VARCHAR(20) NOT NULL,      -- long_term, quarterly, monthly, weekly, daily
    target_date DATE,
    progress_percentage FLOAT DEFAULT 0.0,
    status VARCHAR(20) DEFAULT 'in_progress', -- in_progress, completed, paused, abandoned
    category VARCHAR(50),                -- career, health, academics, finance
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Goal Milestones
CREATE TABLE goal_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    due_date DATE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Projects Tracking
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    status VARCHAR(30) DEFAULT 'active', -- active, completed, on_hold
    technologies VARCHAR(50)[],
    repo_url VARCHAR(500),
    demo_url VARCHAR(500),
    progress_percentage FLOAT DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Project Milestones & Notes
CREATE TABLE project_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    target_date DATE
);

CREATE TABLE project_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content_markdown TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Knowledge Vault Storage
CREATE TABLE vault_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    item_type VARCHAR(30) NOT NULL,      -- article, idea, lecture_note, bookmark, document
    content_markdown TEXT,
    source_url VARCHAR(500),
    tags VARCHAR(50)[],
    fts_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content_markdown, ''))
    ) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Knowledge Vault Vector Embeddings (Chunked for RAG)
CREATE TABLE vault_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vault_item_id UUID REFERENCES vault_items(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    chunk_content TEXT NOT NULL,
    embedding vector(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- AI Coach Reviews & Insights
CREATE TABLE ai_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    review_type VARCHAR(20) NOT NULL,     -- daily_summary, weekly_review, monthly_review
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    summary_markdown TEXT NOT NULL,
    insights JSONB NOT NULL,             -- procrastination_patterns, productivity_patterns, trends
    action_items JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- AI Conversations
CREATE TABLE ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ai_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
    sender VARCHAR(20) NOT NULL,          -- 'user' or 'assistant'
    content TEXT NOT NULL,
    context_used JSONB,                   -- References to journal entries, vault items, metrics used
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) DEFAULT 'reminder', -- habit_reminder, goal_checkin, insight
    is_read BOOLEAN DEFAULT FALSE,
    scheduled_for TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indices for Fast Queries
CREATE INDEX idx_daily_metrics_user_date ON daily_metrics(user_id, date);
CREATE INDEX idx_journal_entries_user_date ON journal_entries(user_id, date);
CREATE INDEX idx_habit_logs_user_date ON habit_logs(user_id, date);
CREATE INDEX idx_vault_items_fts ON vault_items USING GIN(fts_vector);
CREATE INDEX idx_vault_embeddings_vector ON vault_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

---

## 5. Milestone Implementation Roadmap

To deliver a high-quality product incrementally, the development plan is partitioned into 5 key phases:

### Phase 1: Core Architecture & Authentication Foundation
* Set up FastAPI Clean Architecture backend (core config, JWT authentication, Argon2/bcrypt security).
* Set up database models with SQLAlchemy 2.0 & Alembic migrations.
* Set up React + Vite + TypeScript + Tailwind CSS design system shell (Apple dark-mode aesthetics, custom UI components).
* User Auth flow: Register, Login, Refresh Token, Profile management.

### Phase 2: Core Personal Operating System (Dashboard, Journal, Metrics & Habits)
* **Dashboard**: Modern Apple-inspired overview screen (greeting, date, streak counts, daily metric cards, active goals summary).
* **Daily Journal**: Markdown editor with mood/energy scores, wins, challenges, gratitude, tagging, and past entry browsing.
* **Daily Metrics**: Dynamic configurable metrics system (coding minutes, study time, lecture attendance, sleep, gym, water, trading).
* **Habit Tracker**: Custom habit creation, daily log check-ins, heatmaps, streak calculation engine.

### Phase 3: Goals Engine, Projects Hub & Knowledge Vault
* **Goal Hierarchy Engine**: Multi-tier goal tracking (Long-term, Quarterly, Monthly, Weekly, Daily) with progress calculations.
* **Projects Hub**: Project tracker with technology tags, repository links, milestones, progress tracking, and notes.
* **Knowledge Vault**: Rich entry storage (articles, ideas, lecture notes, bookmarks) with chunking engine and **pgvector RAG indexing**.

### Phase 4: AI Intelligence Layer & RAG Search Engine
* **Modular AI Provider Abstraction**: Implement Strategy pattern for OpenAI, Anthropic Claude, Google Gemini, and Local Ollama.
* **AI Personal Coach**: Automated daily summaries, weekly reviews, monthly reviews, and pattern detection (procrastination, peak productivity hours, emotional trends).
* **AI Natural Language Search Engine**: Hybrid RAG search across journals, vault notes, habits, and metrics (e.g. *"Show every journal entry where I mentioned procrastination"*).

### Phase 5: Command Palette, UX Polish, Analytics & Docker
* **Command Palette (`Cmd+K`)**: Instant search and fast navigation system.
* **Interactive Analytics Engine**: Recharts visualizations for mood vs. sleep, coding minutes, lecture consistency, habit completion trends.
* **UX Polish**: Framer Motion transitions, responsive layouts, keyboard shortcuts, calm lighting effects.
* **Containerization**: Complete Docker & Docker Compose setup for production deployment.

---
