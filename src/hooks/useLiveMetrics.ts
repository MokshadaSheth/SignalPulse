import { useState, useEffect, useCallback } from "react";
import { fetchEmployeeLive, type LiveMetrics } from "@/lib/api";

const POLL_INTERVAL = 1000; // 1 second for real-time updates

// Default initial state - shows 0 values immediately on page load
const DEFAULT_METRICS: LiveMetrics = {
  employeeId: "EMP001",
  windowSwitchCount: 0,
  sessionStartTime: null,
  currentSessionDuration: 0,
  activeTimeToday: 0,
  idleTimeToday: 0,
  focusScore: 0,
  uniqueWindowsCount: 0,
  fragmentationScore: 0,
  recentSwitches: [],
};

export function useLiveMetrics(employeeId: string = "EMP001") {
  const [metrics, setMetrics] = useState<LiveMetrics>(DEFAULT_METRICS);
  const [backendConnected, setBackendConnected] = useState(false);

  const poll = useCallback(async () => {
    const data = await fetchEmployeeLive(employeeId);
    if (data) {
      setMetrics(data);
      setBackendConnected(true);
    } else {
      setBackendConnected(false);
    }
  }, [employeeId]);

  useEffect(() => {
    // Poll immediately on mount
    poll();
    // Then poll every 1 second for real-time updates
    const interval = setInterval(poll, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [poll]);

  return { metrics, backendConnected };
}
