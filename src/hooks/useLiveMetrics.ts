import { useState, useEffect, useCallback } from "react";
import { fetchEmployeeLive, type LiveMetrics } from "@/lib/api";

const POLL_INTERVAL = 3000; // 3 seconds

export function useLiveMetrics(employeeId: string = "EMP001") {
  const [metrics, setMetrics] = useState<LiveMetrics | null>(null);
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
    poll();
    const interval = setInterval(poll, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [poll]);

  return { metrics, backendConnected };
}
