import type { ComplaintFormState, SavedComplaintRecord } from "../types";

const AUTOSAVE_KEY = "makkalvoice_draft_autosave_v1";
const TRACKER_KEY = "makkalvoice_saved_complaints_v1";

export function loadAutosavedForm(): Partial<ComplaintFormState> | null {
  try {
    const raw = window.localStorage.getItem(AUTOSAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ComplaintFormState>;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveAutosavedForm(form: ComplaintFormState): void {
  try {
    window.localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(form));
  } catch {
    // Ignore storage quota / private browsing errors
  }
}

export function clearAutosavedForm(): void {
  try {
    window.localStorage.removeItem(AUTOSAVE_KEY);
  } catch {
    // Ignore
  }
}

export function loadSavedComplaints(): SavedComplaintRecord[] {
  try {
    const raw = window.localStorage.getItem(TRACKER_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is SavedComplaintRecord =>
        Boolean(item && typeof item === "object" && typeof item.id === "string"),
    );
  } catch {
    return [];
  }
}

export function persistSavedComplaints(records: SavedComplaintRecord[]): void {
  try {
    window.localStorage.setItem(TRACKER_KEY, JSON.stringify(records.slice(0, 40)));
  } catch {
    // Ignore storage quota errors
  }
}

export function defaultReminderDateIso(daysFromNow = 15): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}
