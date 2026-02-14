/**
 * Signal Pulse API client - Anonymous Window Switching Tracker
 * Tracks window activity (no app names), generates ML-ready data
 */

const API_BASE = "http://localhost:8000/api";

export interface LiveMetrics {
  employeeId: string;
  windowSwitchCount: number;
  sessionStartTime: number | null;
  currentSessionDuration: number;
  activeTimeToday: number;
  idleTimeToday: number;
  focusScore: number;
  uniqueWindowsCount: number;
  fragmentationScore: number;
  recentSwitches: Array<{
    switchTime: number;
    windowHash: string;
    activeDuration: number;
  }>;
}

export interface MLDataPoint {
  employeeId: string;
  date: string;
  timeWindowStart: string;
  role: string;
  activeSeconds: number;
  idleSeconds: number;
  windowSwitchCount: number;
  uniqueWindowCount: number;
  longestContinuousActiveSeconds: number;
  taskPresent: boolean;
  taskCompleted: boolean;
  fragmentationScore: number;
  focusScore: number;
  timestamp: number;
}

export interface TeamStats {
  totalEmployees: number;
  avgFocusScore: number;
  totalSwitches: number;
  avgFragmentation: number;
  taskCompletionRate: number;
  categoryBreakdown: Record<string, number>;
  suggestions: string[];
}

async function apiFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null; // Backend not running — will use fallback
  }
}

export async function fetchEmployeeLive(employeeId: string): Promise<LiveMetrics | null> {
  return apiFetch<LiveMetrics>(`/employee/${employeeId}/live`);
}

export async function fetchEmployeeMLData(employeeId: string, limit: number = 168) {
  return apiFetch<{ employeeId: string; dataPoints: MLDataPoint[] }>(
    `/employee/${employeeId}/ml-data?limit=${limit}`
  );
}

export async function setEmployeeRole(employeeId: string, role: string) {
  return apiFetch<{ status: string; employeeId: string; role: string }>(
    `/employee/${employeeId}/set-role?role=${role}`
  );
}

export async function fetchEmployeeStats(employeeId: string) {
  return apiFetch<{ employeeId: string; stats: any }>(`/employee/${employeeId}/stats`);
}

export async function fetchTeamStats(): Promise<TeamStats | null> {
  return apiFetch<TeamStats>(`/manager/team-stats`);
}

export async function checkBackendHealth(): Promise<boolean> {
  const result = await apiFetch<{ status: string }>("/health");
  return result?.status === "ok";
}
