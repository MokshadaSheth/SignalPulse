import { useState, useEffect } from "react";

export interface PeakHoursRow {
  employee_id: string;
  hour: number;
  avg_focus_score: number;
}

export interface PeakHoursData {
  teamPeakHours: number[];
  teamHourlyScores: Record<number, number>;
  employees: Record<string, { hours: number[]; hourlyScores: Record<number, number> }>;
  employeeIds: string[];
}

function parseCSV(text: string): PeakHoursRow[] {
  const lines = text.trim().split("\n");
  const rows: PeakHoursRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(",");
    if (parts.length >= 3) {
      rows.push({
        employee_id: parts[0].trim(),
        hour: parseInt(parts[1].trim(), 10),
        avg_focus_score: parseFloat(parts[2].trim()),
      });
    }
  }
  return rows;
}

function aggregate(rows: PeakHoursRow[]): PeakHoursData {
  const byEmployee: Record<string, Record<number, number>> = {};
  const teamTotals: Record<number, { sum: number; count: number }> = {};

  for (const r of rows) {
    // Per employee
    if (!byEmployee[r.employee_id]) byEmployee[r.employee_id] = {};
    byEmployee[r.employee_id][r.hour] = r.avg_focus_score;

    // Team aggregation
    if (!teamTotals[r.hour]) teamTotals[r.hour] = { sum: 0, count: 0 };
    teamTotals[r.hour].sum += r.avg_focus_score;
    teamTotals[r.hour].count += 1;
  }

  const teamHourlyScores: Record<number, number> = {};
  for (const [h, t] of Object.entries(teamTotals)) {
    teamHourlyScores[Number(h)] = t.sum / t.count;
  }

  // Find top 2 team peak hours
  const sorted = Object.entries(teamHourlyScores).sort(([, a], [, b]) => b - a);
  const teamPeakHours = sorted.slice(0, 2).map(([h]) => Number(h));

  const employees: PeakHoursData["employees"] = {};
  for (const [empId, hourMap] of Object.entries(byEmployee)) {
    const empSorted = Object.entries(hourMap).sort(([, a], [, b]) => b - a);
    employees[empId] = {
      hours: empSorted.slice(0, 2).map(([h]) => Number(h)),
      hourlyScores: hourMap,
    };
  }

  return {
    teamPeakHours,
    teamHourlyScores,
    employees,
    employeeIds: Object.keys(byEmployee),
  };
}

export function usePeakHours() {
  const [data, setData] = useState<PeakHoursData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/peak_hours.csv")
      .then((res) => res.text())
      .then((text) => {
        const rows = parseCSV(text);
        setData(aggregate(rows));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
