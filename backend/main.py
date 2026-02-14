"""Signal Pulse — FastAPI Backend

Exposes REST APIs for employee live metrics, stats, and manager team aggregation.
Runs the tab tracker in background threads.
"""

import os
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict

from models import EmployeeData, LiveMetrics, TeamStats, Session, Stats
from persistence import load_employee, save_employee, list_all_employees
from tracker import TabTracker
from categorizer import categorize_domain

app = FastAPI(
    title="Signal Pulse API",
    description="Ethical, privacy-first workplace intelligence backend",
    version="1.0.0",
)

# CORS — allow React dev server and Lovable preview
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://id-preview--068ecd4d-a219-4dd2-a1b1-6d51a5fea4aa.lovable.app",
        "https://calm-focus-pulse1.lovable.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Active trackers (one per employee)
trackers: Dict[str, TabTracker] = {}


def get_or_create_tracker(employee_id: str) -> TabTracker:
    """Get existing tracker or start a new one for the employee."""
    if employee_id not in trackers:

        def on_session(session: Session):
            emp = load_employee(employee_id)
            emp.add_session(session)
            save_employee(emp)

        tracker = TabTracker(employee_id=employee_id, on_session_complete=on_session)
        tracker.start()
        trackers[employee_id] = tracker
    return trackers[employee_id]


# ── Health ──────────────────────────────────────────────────

@app.get("/api/health")
def health():
    return {"status": "ok", "activeTrackers": len(trackers)}


# ── Employee: Live Metrics ──────────────────────────────────

@app.get("/api/employee/{employee_id}/live", response_model=LiveMetrics)
def get_employee_live(employee_id: str):
    """Real-time metrics: active domain, switch count, current session."""
    tracker = get_or_create_tracker(employee_id)
    metrics = tracker.live_metrics

    # Supplement with persisted focus score
    emp = load_employee(employee_id)
    metrics.focusScore = emp.stats.focusScore
    metrics.totalTimeToday = emp.stats.totalTime

    return metrics


# ── Employee: Full Stats ────────────────────────────────────

@app.get("/api/employee/{employee_id}/stats")
def get_employee_stats(employee_id: str):
    """Full stats and session history from persisted JSON."""
    emp = load_employee(employee_id)
    return emp.model_dump()


# ── Employee: Add Session Manually ──────────────────────────

@app.post("/api/employee/{employee_id}/session")
def add_session(employee_id: str, session: Session):
    """Manually add a session (used for testing or external integrations)."""
    emp = load_employee(employee_id)
    emp.add_session(session)
    save_employee(emp)
    return {"status": "ok", "totalSessions": len(emp.stats.todaySessions)}


# ── Manager: Aggregated Team Stats ──────────────────────────

@app.get("/api/manager/team-stats", response_model=TeamStats)
def get_team_stats():
    """Privacy-safe aggregated team statistics.

    NEVER exposes:
    - Individual employee IDs
    - Domain names
    - Per-employee timelines
    """
    employees = list_all_employees()

    if not employees:
        return TeamStats()

    total_focus = sum(e.stats.focusScore for e in employees)
    total_switches = sum(e.stats.switches for e in employees)

    # Category breakdown (aggregated across all employees)
    category_totals: dict[str, int] = {}
    for emp in employees:
        for session in emp.stats.todaySessions:
            cat = session.category
            category_totals[cat] = category_totals.get(cat, 0) + session.duration

    # Fragmentation = avg switches per employee
    avg_fragmentation = total_switches / len(employees) if employees else 0

    # Suggestions based on aggregated data
    suggestions = []
    if avg_fragmentation > 15:
        suggestions.append("High context-switching detected — consider no-meeting hours")
    total_distraction = sum(e.stats.distractionTime for e in employees)
    total_work = sum(e.stats.workTime for e in employees)
    if total_distraction > total_work:
        suggestions.append("Team distraction time exceeds work time — introduce focus blocks")
    if all(e.stats.deepWorkSessions == 0 for e in employees):
        suggestions.append("No deep work sessions — encourage protected deep work blocks")

    return TeamStats(
        totalEmployees=len(employees),
        avgFocusScore=round(total_focus / len(employees), 1),
        totalSwitches=total_switches,
        avgFragmentation=round(avg_fragmentation, 1),
        taskCompletionRate=round(min(95, 50 + total_focus / max(len(employees), 1)), 1),
        categoryBreakdown=category_totals,
        suggestions=suggestions,
    )


# ── Start Tracker on Boot ───────────────────────────────────

@app.on_event("startup")
def startup():
    """Auto-start tracker for default employee on boot."""
    default_id = os.environ.get("EMPLOYEE_ID", "EMP001")
    get_or_create_tracker(default_id)
    print(f"✅ Signal Pulse API running — tracking {default_id}")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
