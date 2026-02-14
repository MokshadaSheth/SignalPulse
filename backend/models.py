"""Pydantic models matching the strict JSON storage format."""

from pydantic import BaseModel, Field
from typing import List, Optional
import time
import random


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
    stats: Stats = Field(default_factory=Stats)

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
    employeeId: str
    activeDomain: Optional[str] = None
    activeCategory: Optional[str] = None
    tabSwitchCount: int = 0
    sessionStartTime: Optional[int] = None
    currentSessionDuration: int = 0
    totalTimeToday: int = 0
    focusScore: int = 0


class TeamStats(BaseModel):
    totalEmployees: int = 0
    avgFocusScore: float = 0
    totalSwitches: int = 0
    avgFragmentation: float = 0
    taskCompletionRate: float = 0
    categoryBreakdown: dict = Field(default_factory=dict)
    suggestions: List[str] = Field(default_factory=list)
