"""Signal Pulse — FastAPI Backend

Exposes REST APIs for employee live metrics, stats, and manager team aggregation.
Runs the tab tracker in background threads.
"""

import os
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict

from models import EmployeeData, LiveMetrics, TeamStats, Session, Stats, TimeWindowData
from persistence import load_employee, save_employee, list_all_employees
from tracker import WindowTracker
from peak_hours_api import router as peak_hours_router

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
        "http://localhost:8080",
        "https://id-preview--068ecd4d-a219-4dd2-a1b1-6d51a5fea4aa.lovable.app",
        "https://calm-focus-pulse1.lovable.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(peak_hours_router)

# Active window trackers (one per employee)
trackers: Dict[str, WindowTracker] = {}


def get_or_create_tracker(employee_id: str) -> WindowTracker:
    """Get existing tracker or start a new one for the employee."""
    if employee_id not in trackers:
        emp = load_employee(employee_id)
        role = emp.role  # Get stored role

        def on_ml_data(ml_point: TimeWindowData):
            """Handler when ML data is generated hourly."""
            emp = load_employee(employee_id)
            emp.mlDataPoints.append(ml_point)
            save_employee(emp)

        tracker = WindowTracker(
            employee_id=employee_id,
            role=role,
            on_ml_data_complete=on_ml_data
        )
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
    """Real-time metrics: window switches, active/idle time (anonymous)."""
    tracker = get_or_create_tracker(employee_id)
    metrics = tracker.live_metrics
    return metrics


# ── Employee: Full Stats ────────────────────────────────────

@app.get("/api/employee/{employee_id}/stats")
def get_employee_stats(employee_id: str):
    """Full stats and session history from persisted JSON."""
    emp = load_employee(employee_id)
    return emp.model_dump()


# ── Employee: Add Session Manually ──────────────────────────

@app.get("/api/employee/{employee_id}/ml-data")
def get_employee_ml_data(employee_id: str, limit: int = 168):
    """Retrieve ML-ready aggregated data for model training.
    
    Returns TimeWindowData points (up to 'limit' most recent).
    Each point represents hourly aggregated metrics:
    - activeSeconds, idleSeconds, windowSwitchCount
    - fragmentationScore, focusScore, uniqueWindowCount
    - longestContinuousActiveSeconds
    - taskPresent, taskCompleted flags
    """
    emp = load_employee(employee_id)
    ml_data = emp.mlDataPoints[-limit:] if emp.mlDataPoints else []
    return {"employeeId": employee_id, "dataPoints": ml_data}


@app.post("/api/employee/{employee_id}/set-role")
def set_employee_role(employee_id: str, role: str):
    """Set or update employee role for ML context."""
    emp = load_employee(employee_id)
    emp.role = role
    save_employee(emp)
    # Recreate tracker with new role
    if employee_id in trackers:
        trackers[employee_id].stop()
        del trackers[employee_id]
    get_or_create_tracker(employee_id)
    return {"status": "ok", "employeeId": employee_id, "role": role}


# ── Manager: Aggregated Team Stats ──────────────────────────

@app.get("/api/manager/team-stats", response_model=TeamStats)
def get_team_stats():
    """Privacy-safe aggregated team statistics (anonymous window data only)."""
    employees = list_all_employees()

    if not employees:
        return TeamStats()

    # Aggregate from most recent ML data points
    total_switches = 0
    total_fragmentation = 0
    focus_scores = []
    
    for emp in employees:
        if emp.mlDataPoints:
            # Use most recent data point
            latest = emp.mlDataPoints[-1]
            total_switches += latest.windowSwitchCount
            total_fragmentation += latest.fragmentationScore
            focus_scores.append(latest.focusScore)
    
    avg_focus = sum(focus_scores) / len(focus_scores) if focus_scores else 0
    avg_fragmentation = total_fragmentation / len(employees) if employees else 0

    suggestions = []
    if avg_fragmentation > 40:
        suggestions.append("High window switching detected — encourage focus blocks")
    if avg_focus < 60:
        suggestions.append("Overall focus declining — implement restoration breaks")

    return TeamStats(
        totalEmployees=len(employees),
        avgFocusScore=round(avg_focus, 1),
        totalSwitches=total_switches,
        avgFragmentation=round(avg_fragmentation, 1),
        taskCompletionRate=round(min(95, 50 + avg_focus), 1),
        categoryBreakdown={},
        suggestions=suggestions,
    )


# ── Test/Debug: Manual Aggregation Trigger ──────────────────

@app.post("/api/employee/{employee_id}/trigger-aggregation")
def trigger_aggregation(employee_id: str):
    """Manually trigger ML data aggregation (for testing/debugging)."""
    tracker = get_or_create_tracker(employee_id)
    ml_point = tracker._generate_ml_data_point()
    
    if ml_point:
        emp = load_employee(employee_id)
        emp.mlDataPoints.append(ml_point)
        save_employee(emp)
        
        print(f"✅ ML data aggregated and saved for {employee_id}")
        print(f"   Switches: {ml_point.windowSwitchCount}, Active: {ml_point.activeSeconds}s, Focus: {ml_point.focusScore}%")
        
        return {
            "status": "ok",
            "message": "ML data aggregated and saved",
            "dataPoint": ml_point.model_dump(by_alias=True),
            "filePath": f"backend/data/{employee_id}.json"
        }
    else:
        return {"status": "error", "message": "Failed to generate ML data"}


# ── Start Tracker on Boot ───────────────────────────────────

@app.on_event("startup")
def startup():
    """Auto-start tracker for default employee on boot."""
    default_id = os.environ.get("EMPLOYEE_ID", "EMP001")
    get_or_create_tracker(default_id)
    print(f"✅ Signal Pulse API running — anonymous window tracking for {default_id}")
    print(f"📊 ML data will be aggregated every 60 seconds and saved to backend/data/{default_id}.json")
    print(f"🧪 For manual testing: POST /api/employee/{default_id}/trigger-aggregation")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
