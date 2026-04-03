/**
 * ALFRED — Daily Performance Log Database Layer
 *
 * PLACEHOLDER: Currently uses localStorage for persistence.
 * When the backend DB is ready, replace the read/write functions below
 * with API calls to your backend (e.g. Supabase, Prisma, MongoDB).
 *
 * Schema (per day entry):
 * {
 *   date: string;           // ISO date string "YYYY-MM-DD"
 *   tasks: {
 *     id: string;
 *     text: string;
 *     completed: boolean;
 *     category: "general" | "workout" | "diet" | "ai-code" | "creations";
 *   }[];
 *   workout: {
 *     notes: string;
 *     completed: boolean;
 *     details: string;
 *   };
 *   diet: {
 *     notes: string;
 *     completed: boolean;
 *     details: string;
 *   };
 *   aiCode: {
 *     notes: string;
 *     completed: boolean;
 *     details: string;
 *   };
 *   creations: {
 *     notes: string;
 *     completed: boolean;
 *     details: string;
 *   };
 *   reflection: string;
 *   mood: number; // 1-5
 *   updatedAt: string;
 * }
 */

export type TaskCategory = "general" | "workout" | "diet" | "ai-code" | "creations";

export interface DailyTask {
  id: string;
  text: string;
  completed: boolean;
  category: TaskCategory;
}

export interface AreaLog {
  notes: string;
  completed: boolean;
  details: string;
}

export interface DayLog {
  date: string;
  tasks: DailyTask[];
  workout: AreaLog;
  diet: AreaLog;
  aiCode: AreaLog;
  creations: AreaLog;
  reflection: string;
  mood: number;
  updatedAt: string;
}

const STORAGE_KEY = "alfred_performance_logs";

function getAllLogs(): Record<string, DayLog> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAllLogs(logs: Record<string, DayLog>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

export function getDayLog(date: string): DayLog {
  const all = getAllLogs();
  if (all[date]) return all[date];
  // Return default empty structure for a new day
  return {
    date,
    tasks: [],
    workout: { notes: "", completed: false, details: "" },
    diet: { notes: "", completed: false, details: "" },
    aiCode: { notes: "", completed: false, details: "" },
    creations: { notes: "", completed: false, details: "" },
    reflection: "",
    mood: 3,
    updatedAt: new Date().toISOString(),
  };
}

export function saveDayLog(log: DayLog): void {
  // TODO: Replace with API call → POST /api/performance-log
  // await fetch('/api/performance-log', { method: 'POST', body: JSON.stringify(log) })
  const all = getAllLogs();
  all[log.date] = { ...log, updatedAt: new Date().toISOString() };
  saveAllLogs(all);
}

export function getMonthLogs(year: number, month: number): DayLog[] {
  // TODO: Replace with API call → GET /api/performance-log?year=&month=
  const all = getAllLogs();
  const prefix = `${year}-${String(month).padStart(2, "0")}`;
  return Object.values(all).filter((log) => log.date.startsWith(prefix));
}

export function hasLogForDate(date: string): boolean {
  const all = getAllLogs();
  return !!all[date] && all[date].tasks.length > 0;
}
