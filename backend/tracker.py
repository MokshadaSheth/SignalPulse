"""Real-time browser tab tracking module.

Monitors the active window title to detect browser tab switches.
Extracts domain from browser title bars for Chrome, Edge, Brave, Firefox.
Runs in a background thread so it never blocks the FastAPI server.
"""

import re
import time
import threading
import platform
from datetime import datetime, timezone
from typing import Optional, Callable

from categorizer import categorize_domain
from models import Session, LiveMetrics

# Browser identifiers in window titles
BROWSER_PATTERNS = [
    "Google Chrome",
    "Microsoft Edge",
    "Brave",
    "Mozilla Firefox",
    "Opera",
    "Vivaldi",
    "Safari",
]


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
            from subprocess import run, PIPE
            script = 'tell application "System Events" to get name of first application process whose frontmost is true'
            result = run(["osascript", "-e", script], capture_output=True, text=True)
            return result.stdout.strip() if result.returncode == 0 else None
        elif system == "Linux":
            from subprocess import run, PIPE
            result = run(["xdotool", "getactivewindow", "getwindowname"], capture_output=True, text=True)
            return result.stdout.strip() if result.returncode == 0 else None
    except Exception:
        return None
    return None


def extract_domain_from_title(title: str) -> Optional[str]:
    """Extract domain from browser window title.
    
    Browser titles typically look like:
    - "Page Title - Domain.com - Google Chrome"
    - "Domain.com - Page Title — Mozilla Firefox"
    """
    if not title:
        return None

    # Check if it's a browser window
    is_browser = any(browser in title for browser in BROWSER_PATTERNS)
    if not is_browser:
        return None

    # Try to find domain patterns in the title
    # Common pattern: domain appears as "domain.tld" somewhere in title
    domain_regex = r'([a-zA-Z0-9]([a-zA-Z0-9\-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}'
    matches = re.findall(domain_regex, title)

    if matches:
        # Rebuild full domain matches
        full_matches = re.finditer(domain_regex, title)
        domains = [m.group(0) for m in full_matches]
        # Filter out browser names and common non-domains
        filtered = [
            d for d in domains
            if d.lower() not in ("google.chrome", "mozilla.firefox", "microsoft.edge")
        ]
        if filtered:
            return filtered[0].lower()

    return None


class TabTracker:
    """Background tab tracking engine."""

    def __init__(self, employee_id: str, on_session_complete: Optional[Callable] = None):
        self.employee_id = employee_id
        self.on_session_complete = on_session_complete
        self._running = False
        self._thread: Optional[threading.Thread] = None

        # Live state
        self.active_domain: Optional[str] = None
        self.active_category: Optional[str] = None
        self.session_start: Optional[int] = None
        self.switch_count = 0
        self.total_time_today = 0

    @property
    def live_metrics(self) -> LiveMetrics:
        now = int(time.time() * 1000)
        current_duration = (now - self.session_start) if self.session_start else 0
        return LiveMetrics(
            employeeId=self.employee_id,
            activeDomain=self.active_domain,
            activeCategory=self.active_category,
            tabSwitchCount=self.switch_count,
            sessionStartTime=self.session_start,
            currentSessionDuration=current_duration,
            totalTimeToday=self.total_time_today,
            focusScore=0,
        )

    def start(self):
        if self._running:
            return
        self._running = True
        self._thread = threading.Thread(target=self._track_loop, daemon=True)
        self._thread.start()

    def stop(self):
        self._running = False
        if self._thread:
            self._thread.join(timeout=3)

    def _track_loop(self):
        """Main tracking loop — runs every 1 second."""
        while self._running:
            try:
                title = get_active_window_title()
                domain = extract_domain_from_title(title) if title else None

                if domain and domain != self.active_domain:
                    now = int(time.time() * 1000)
                    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

                    # Complete previous session
                    if self.active_domain and self.session_start:
                        session = Session.create(
                            domain=self.active_domain,
                            category=self.active_category or "work",
                            start_time=self.session_start,
                            end_time=now,
                            date=today,
                        )
                        self.total_time_today += session.duration
                        if self.on_session_complete:
                            self.on_session_complete(session)

                    # Start new session
                    self.active_domain = domain
                    self.active_category = categorize_domain(domain)
                    self.session_start = now
                    self.switch_count += 1

            except Exception:
                pass  # Never crash the tracker

            time.sleep(1)
