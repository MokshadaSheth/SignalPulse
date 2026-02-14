"""Anonymous window activity tracking module.

Monitors active window changes (anonymous, no app names extracted).
Tracks active/idle time and generates ML-ready data aggregates.
Runs in background thread - never blocks FastAPI.
"""

import hashlib
import time
import threading
import platform
from datetime import datetime, timezone
from typing import Optional, Callable, Dict
from collections import defaultdict

from models import WindowSwitch, TimeWindowData, LiveMetrics

# Idle timeout: if no window for 30 seconds, assume idle
IDLE_TIMEOUT_SEC = 30
# Aggregate data every 60 seconds (for development/testing - change to 3600 for production)
AGGREGATION_INTERVAL_SEC = 60


def get_active_window_title() -> Optional[str]:
    """Get the currently active window title (cross-platform)."""
    system = platform.system()
    try:
        if system == "Windows":
            import ctypes
            hwnd = ctypes.windll.user32.GetForegroundWindow()
            length = ctypes.windll.user32.GetWindowTextLengthW(hwnd)
            buf = ctypes.create_unicode_buffer(length + 1)
            ctypes.windll.user32.GetWindowTextW(hwnd, buf, length + 1)
            return buf.value if buf.value else None
        elif system == "Darwin":  # macOS
            from subprocess import run
            script = 'tell application "System Events" to get name of first application process whose frontmost is true'
            result = run(["osascript", "-e", script], capture_output=True, text=True)
            return result.stdout.strip() if result.returncode == 0 else None
        elif system == "Linux":
            from subprocess import run
            result = run(["xdotool", "getactivewindow", "getwindowname"], capture_output=True, text=True)
            return result.stdout.strip() if result.returncode == 0 else None
    except Exception:
        return None
    return None


def hash_window_title(title: Optional[str]) -> str:
    """Hash window title to anonymize it (no app names exposed)."""
    if not title:
        return "unknown"
    # Use first 50 chars to create consistent hash
    return hashlib.md5(title[:50].encode()).hexdigest()[:8]


class WindowTracker:
    """Background activity tracking engine - ML/analytics focused."""

    def __init__(self, employee_id: str, role: str = "developer", on_ml_data_complete: Optional[Callable] = None):
        self.employee_id = employee_id
        self.role = role
        self.on_ml_data_complete = on_ml_data_complete
        self._running = False
        self._thread: Optional[threading.Thread] = None

        # Current session state
        self.active_window_hash: Optional[str] = None
        self.session_start: Optional[int] = None
        self.last_activity: Optional[int] = None
        self.window_switches: list = []
        self.unique_windows: set = set()
        self.continuous_active_start: Optional[int] = None

        # Aggregation state for ML data
        self.switches_this_hour = 0
        self.active_seconds_this_hour = 0
        self.idle_seconds_this_hour = 0
        self.current_hour_start: Optional[int] = None
        self.longest_continuous_active = 0
        self.hour_window_switches: list = []

    @property
    def live_metrics(self) -> LiveMetrics:
        """Current activity metrics for UI (anonymous)."""
        now = int(time.time() * 1000)
        current_session_duration = (now - self.session_start) if self.session_start else 0

        # Calculate total active time: completed sessions + current session
        completed_active_time = sum(s["activeDuration"] for s in self.window_switches)
        total_active_time = completed_active_time + current_session_duration

        # Calculate fragmentation score: switches per active minute
        total_active_sec = total_active_time // 1000
        fragmentation = 0.0
        if total_active_sec > 0:
            fragmentation = min(100, (len(self.window_switches) / (total_active_sec / 60)) * 10)

        # Estimate focus score from activity patterns
        focus_score = max(0, 100 - fragmentation)

        return LiveMetrics(
            employeeId=self.employee_id,
            windowSwitchCount=len(self.window_switches),
            sessionStartTime=self.session_start,
            currentSessionDuration=current_session_duration,
            activeTimeToday=total_active_time,
            idleTimeToday=0,  # Calculated separately from active time
            focusScore=int(focus_score),
            uniqueWindowsCount=len(self.unique_windows),
            fragmentationScore=fragmentation,
            recentSwitches=self.window_switches[-10:],  # Last 10 switches
        )

    def start(self):
        """Start background tracking."""
        if self._running:
            return
        self._running = True
        self.current_hour_start = int(time.time())
        
        # Initialize with first window immediately
        now = int(time.time())
        window_title = get_active_window_title()
        self.active_window_hash = hash_window_title(window_title)
        self.session_start = now * 1000
        self.last_activity = now
        self.unique_windows.add(self.active_window_hash)
        
        self._thread = threading.Thread(target=self._track_loop, daemon=True)
        self._thread.start()

    def stop(self):
        """Stop background tracking."""
        self._running = False
        if self._thread:
            self._thread.join(timeout=3)

    def _get_hour_index(self, timestamp: Optional[int] = None) -> str:
        """Get hour index as HH:MM format from timestamp."""
        if timestamp is None:
            timestamp = int(time.time())
        dt = datetime.fromtimestamp(timestamp, tz=timezone.utc)
        return dt.strftime("%H:00")

    def _generate_ml_data_point(self) -> Optional[TimeWindowData]:
        """Generate ML-ready data for the completed hour."""
        if not self.current_hour_start:
            return None

        now = int(time.time())
        date = datetime.fromtimestamp(self.current_hour_start, tz=timezone.utc).strftime("%Y-%m-%d")
        hour_index = self._get_hour_index(self.current_hour_start)

        # Include current session active time in calculation
        current_session_active = 0
        if self.session_start:
            current_session_active = (now * 1000 - self.session_start) // 1000

        # Calculate metrics (including current ongoing session)
        total_active = self.active_seconds_this_hour + current_session_active
        total_idle = self.idle_seconds_this_hour
        total_time = total_active + total_idle
        
        fragmentation_score = 0.0
        if total_active > 0:
            fragmentation_score = min(100, (self.switches_this_hour / (total_active / 60)) * 10)

        focus_score = max(0, 100 - fragmentation_score)

        ml_point = TimeWindowData(
            employeeId=self.employee_id,
            date=date,
            timeWindowStart=hour_index,
            role=self.role,
            activeSeconds=total_active,
            idleSeconds=total_idle,
            windowSwitchCount=self.switches_this_hour,
            uniqueWindowCount=len(set(s["windowHash"] for s in self.hour_window_switches)),
            longestContinuousActiveSeconds=self.longest_continuous_active,
            taskPresent=False,  # Can be set by external system
            taskCompleted=False,  # Can be set by external system
            fragmentationScore=fragmentation_score,
            focusScore=focus_score,
            timestamp=int(time.time() * 1000),
        )

        return ml_point

    def _reset_hour_tracking(self):
        """Reset hourly aggregation counters."""
        self.switches_this_hour = 0
        self.active_seconds_this_hour = 0
        self.idle_seconds_this_hour = 0
        self.hour_window_switches = []
        self.longest_continuous_active = 0
        self.current_hour_start = int(time.time())

    def _track_loop(self):
        """Main tracking loop — runs every 1 second."""
        last_aggregation = int(time.time())

        while self._running:
            try:
                now = int(time.time())
                window_title = get_active_window_title()
                window_hash = hash_window_title(window_title)

                # Check if hour has changed - aggregate and save ML data
                if now - last_aggregation >= AGGREGATION_INTERVAL_SEC:
                    ml_point = self._generate_ml_data_point()
                    if ml_point and self.on_ml_data_complete:
                        self.on_ml_data_complete(ml_point)
                    self._reset_hour_tracking()
                    last_aggregation = now

                # Detect window switch
                if window_title and window_hash != self.active_window_hash:
                    # Complete previous session
                    if self.active_window_hash and self.session_start:
                        duration_ms = (now * 1000) - self.session_start
                        self.window_switches.append({
                            "switchTime": self.session_start,
                            "windowHash": self.active_window_hash,
                            "activeDuration": duration_ms,
                        })
                        self.hour_window_switches.append({
                            "windowHash": self.active_window_hash,
                            "duration": duration_ms,
                        })
                        self.switches_this_hour += 1
                        self.active_seconds_this_hour += duration_ms // 1000
                        self.longest_continuous_active = max(self.longest_continuous_active, duration_ms // 1000)

                    # Start new session
                    self.active_window_hash = window_hash
                    self.session_start = now * 1000
                    self.last_activity = now
                    self.unique_windows.add(window_hash)

                # Detect idle (no activity for IDLE_TIMEOUT_SEC)
                elif self.last_activity and (now - self.last_activity) >= IDLE_TIMEOUT_SEC:
                    self.idle_seconds_this_hour += IDLE_TIMEOUT_SEC
                    self.active_window_hash = None
                    self.session_start = None
                    self.last_activity = None

                else:
                    # Active - update last activity time
                    if window_title:
                        self.last_activity = now

            except Exception:
                pass  # Never crash the tracker

            time.sleep(1)
