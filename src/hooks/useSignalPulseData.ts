import { useState, useEffect, useCallback } from "react";

export interface Session {
  category: string;
  date: string;
  domain: string;
  duration: number;
  endTime: number;
  id: string;
  startTime: number;
  timestamp: number;
}

export interface Stats {
  totalTime: number;
  workTime: number;
  distractionTime: number;
  communicationTime: number;
  deepWorkTime: number;
  switches: number;
  focusScore: number;
  deepWorkSessions: number;
  pattern: string;
  focusModeActive: boolean;
  focusModeEnd: number;
  streakDays: number;
  dailyGoal: number;
  todaySessions: Session[];
}

export interface Settings {
  blockedSites: string[];
  dailyGoal: number;
  focusDuration: number;
  focusModeActive: boolean;
  focusModeEnd: number;
  nudgesEnabled: boolean;
  soundEnabled: boolean;
}

export interface SignalPulseData {
  exportDate: string;
  sessions: Session[];
  stats: Stats;
  settings: Settings;
}

const LOCAL_STORAGE_KEY = "signal-pulse-data";

export function useSignalPulseData() {
  const [data, setData] = useState<SignalPulseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try localStorage first
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setData(JSON.parse(saved));
        setLoading(false);
        return;
      } catch {
        // fall through to fetch
      }
    }

    fetch("/data/signal-pulse-data.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(json));
      })
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  const updateData = useCallback((newData: SignalPulseData) => {
    setData(newData);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
  }, []);

  const updateFromJson = useCallback((jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString) as SignalPulseData;
      updateData(parsed);
      setError(null);
      return true;
    } catch (e) {
      setError("Invalid JSON format");
      return false;
    }
  }, [updateData]);

  const resetData = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setLoading(true);
    fetch("/data/signal-pulse-data.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(json));
      })
      .catch(() => setError("Failed to reset data"))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error, updateData, updateFromJson, resetData };
}
