"""Pydantic models matching the strict JSON storage format."""

from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import time
import random


class WindowSwitch(BaseModel):
    """Anonymous window switch event (no app/domain names)."""
    switchTime: int  # epoch ms
    windowHash: str  # hashed window identifier (no app name)
    activeDuration: int  # ms active in this window before switch


class TimeWindowData(BaseModel):
    """ML-ready aggregated data for a time window (hourly/daily)."""
    model_config = ConfigDict(populate_by_name=True)
    
    employeeId: str = Field(alias="employee_id")
    date: str  # YYYY-MM-DD
    timeWindowStart: str = Field(alias="time_window_start")  # HH:MM format
    role: str  # employee role (developer, manager, etc.)
    activeSeconds: int = Field(alias="active_seconds")  # seconds spent active
    idleSeconds: int = Field(alias="idle_seconds")  # seconds spent idle
    windowSwitchCount: int = Field(alias="window_switch_count")  # number of window switches
    uniqueWindowCount: int = Field(alias="unique_window_count")  # number of unique windows
    longestContinuousActiveSeconds: int = Field(alias="longest_continuous_active_seconds")  # max continuous active time
    taskPresent: bool = Field(alias="task_present")  # whether a task was available
    taskCompleted: bool = Field(alias="task_completed")  # whether task was completed
    fragmentationScore: float = Field(alias="fragmentation_score")  # 0-100 based on switches/active time
    focusScore: float = Field(alias="focus_score")  # 0-100 overall focus score
    timestamp: int  # when this record was created


class Session(BaseModel):
    category: str
    date: str
    domain: str
    duration: int  # milliseconds
    startTime: int  # epoch ms
    endTime: int  # epoch ms
    timestamp: int  # epoch ms
    id: str

    @classmethod
    def create(cls, domain: str, category: str, start_time: int, end_time: int, date: str):
        duration = end_time - start_time
        session_id = f"{end_time}-{random.random()}"
        return cls(
            category=category,
            date=date,
            domain=domain,
            duration=duration,
            startTime=start_time,
            endTime=end_time,
            timestamp=end_time,
            id=session_id,
        )


class Stats(BaseModel):
    totalTime: int = 0
    workTime: int = 0
    distractionTime: int = 0
    communicationTime: int = 0
    deepWorkTime: int = 0
    switches: int = 0
    focusScore: int = 0
    deepWorkSessions: int = 0
    pattern: str = "balanced"
    focusModeActive: bool = False
    focusModeEnd: int = 0
    streakDays: int = 0
    dailyGoal: int = 4
    todaySessions: List[Session] = Field(default_factory=list)


class EmployeeData(BaseModel):
    employeeId: str
    role: str = "developer"  # store role for ML data
    stats: Stats = Field(default_factory=Stats)
    mlDataPoints: List[TimeWindowData] = Field(default_factory=list)  # ML training data
    windowSwitches: List[WindowSwitch] = Field(default_factory=list)  # Anonymous switches

    def add_session(self, session: Session):
        self.stats.todaySessions.append(session)
        self.stats.totalTime += session.duration
        self.stats.switches += 1

        if session.category == "work":
            self.stats.workTime += session.duration
        elif session.category == "distraction":
            self.stats.distractionTime += session.duration
        elif session.category == "communication":
            self.stats.communicationTime += session.duration

        # Recalculate focus score
        if self.stats.totalTime > 0:
            self.stats.focusScore = round(
                (self.stats.workTime + self.stats.deepWorkTime)
                / self.stats.totalTime
                * 100
            )

        # Detect deep work (work session > 25 min)
        if session.category == "work" and session.duration > 25 * 60 * 1000:
            self.stats.deepWorkTime += session.duration
            self.stats.deepWorkSessions += 1


class LiveMetrics(BaseModel):
    """Real-time metrics for UI display (anonymous, no app names)."""
    employeeId: str
    windowSwitchCount: int = 0
    sessionStartTime: Optional[int] = None
    currentSessionDuration: int = 0
    activeTimeToday: int = 0
    idleTimeToday: int = 0
    focusScore: int = 0
    uniqueWindowsCount: int = 0
    fragmentationScore: float = 0.0
    recentSwitches: List[dict] = Field(default_factory=list)  # Recent switch events


class TeamStats(BaseModel):
    totalEmployees: int = 0
    avgFocusScore: float = 0
    totalSwitches: int = 0
    avgFragmentation: float = 0
    taskCompletionRate: float = 0
    categoryBreakdown: dict = Field(default_factory=dict)
    suggestions: List[str] = Field(default_factory=list)

