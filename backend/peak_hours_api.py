"""Peak Hours AI Insights — FastAPI router.

Loads peak_hours.csv at import time, aggregates per-employee
and team-level focus data, and exposes a single GET endpoint.
"""

import csv
import os
from collections import defaultdict
from fastapi import APIRouter

router = APIRouter()

CSV_PATH = os.path.join(os.path.dirname(__file__), "peak_hours.csv")

# ── Load & aggregate on startup ────────────────────────────

_team_hourly: dict[int, float] = {}
_employees: dict[str, dict] = {}
_team_peak: list[int] = []


def _load():
    global _team_hourly, _employees, _team_peak

    if not os.path.exists(CSV_PATH):
        return

    rows: list[dict] = []
    with open(CSV_PATH, newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)

    by_emp: dict[str, dict[int, float]] = defaultdict(dict)
    hour_sums: dict[int, list[float]] = defaultdict(list)

    for r in rows:
        emp = r["employee_id"]
        hour = int(r["hour"])
        score = float(r["avg_focus_score"])
        by_emp[emp][hour] = score
        hour_sums[hour].append(score)

    # Team average per hour
    _team_hourly = {h: round(sum(v) / len(v), 4) for h, v in hour_sums.items()}

    # Top 2 team peak hours
    sorted_hours = sorted(_team_hourly.items(), key=lambda x: x[1], reverse=True)
    _team_peak = [h for h, _ in sorted_hours[:2]]

    # Per employee peak hours
    for emp, hours_map in by_emp.items():
        emp_sorted = sorted(hours_map.items(), key=lambda x: x[1], reverse=True)
        _employees[emp] = {
            "peakHours": [h for h, _ in emp_sorted[:2]],
            "hourlyScores": {h: round(s, 4) for h, s in hours_map.items()},
        }


_load()


# ── Endpoint ────────────────────────────────────────────────

@router.get("/api/manager/ai-insights/peak-hours")
def get_peak_hours():
    return {
        "teamPeakHours": _team_peak,
        "teamHourlyScores": _team_hourly,
        "employees": _employees,
    }
