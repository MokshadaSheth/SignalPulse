# Signal Pulse — Python Backend

## Overview
FastAPI backend that tracks browser tab switching in real time, persists session data as JSON files, and exposes REST APIs for the React frontend.

## Architecture

```
backend/
├── main.py              # FastAPI app with all endpoints
├── tracker.py           # Browser tab tracking module (Windows/macOS/Linux)
├── categorizer.py       # Domain → category classification
├── persistence.py       # JSON file read/write with safe atomic writes
├── models.py            # Pydantic data models
├── requirements.txt     # Python dependencies
└── data/                # Auto-created: one JSON file per employee
    └── EMP001.json
```

## Setup

```bash
cd backend
pip install -r requirements.txt
python main.py
```

Server starts at `http://localhost:8000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employee/{id}/live` | Live metrics: active domain, switches, current session |
| GET | `/api/employee/{id}/stats` | Full stats + session history from JSON |
| GET | `/api/manager/team-stats` | Aggregated team stats (privacy-safe) |
| POST | `/api/employee/{id}/session` | Manually add a session |
| GET | `/api/health` | Health check |

## Data Flow

1. `tracker.py` monitors the active browser tab every 1 second
2. On tab change → creates a session record with domain, duration, category
3. `persistence.py` writes to `data/{employeeId}.json` atomically
4. FastAPI serves the latest data to the React frontend
5. Frontend polls `/api/employee/{id}/live` every 3 seconds
6. Manager endpoint aggregates all employee JSONs, strips individual details

## CORS

Configured for `http://localhost:5173` (Vite dev) and the Lovable preview URL.
