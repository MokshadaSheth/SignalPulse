/**
 * Signal Pulse API client.
 * Polls FastAPI backend with automatic fallback to local JSON data.
 */

const API_BASE = "http://localhost:8000/api";

export interface LiveMetrics {
  employeeId: string;
  activeDomain: string | null;
  activeCategory: string | null;
  tabSwitchCount: number;
  sessionStartTime: number | null;
  currentSessionDuration: number;
  totalTimeToday: number;
  focusScore: number;
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
