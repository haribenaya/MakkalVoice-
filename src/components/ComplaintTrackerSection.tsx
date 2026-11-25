import { useRef, useState } from "react";
import {
  AlertCircle,
  BookmarkCheck,
  Calendar,
  CalendarPlus,
  CheckCircle2,
  Download,
  ExternalLink,
  FileSearch,
  FileUp,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";
import { getDashboardExtrasStrings } from "../data/dashboardExtrasTranslations";
import type { InnovationStrings } from "../data/innovationTranslations";
import { getLocalizedDistrictName, getLocalizedStateName } from "../data/localizedLocations";
import type { SavedComplaintRecord, SavedComplaintStatus } from "../types";
import {
  buildGoogleCalendarReminderUrl,
  downloadFollowUpCalendarIcs,
} from "../utils/mediaTools";

interface ComplaintTrackerSectionProps {
  it: InnovationStrings;
  language: string;
  visitPortalLabel: string;
  records: SavedComplaintRecord[];
  escalatingId: string | null;
  rtiDraftingId: string | null;
  onUpdateRecord: (id: string, patch: Partial<SavedComplaintRecord>) => void;
  onDeleteRecord: (id: string) => void;
  onGenerateEscalation: (record: SavedComplaintRecord) => void;
  onGenerateRtiInquiry: (record: SavedComplaintRecord) => void;
  onLoadRecordIntoReview: (record: SavedComplaintRecord) => void;
  onImportRecords: (imported: SavedComplaintRecord[]) => void;
}

function isPastOrToday(isoDate: string): boolean {
  if (!isoDate) return false;
  const today = new Date().toISOString().slice(0, 10);
  return isoDate <= today;
}

export function ComplaintTrackerSection({
  it,
  language,
  visitPortalLabel,
  records,
  escalatingId,
  rtiDraftingId,
  onUpdateRecord,
  onDeleteRecord,
  onGenerateEscalation,
  onGenerateRtiInquiry,
  onLoadRecordIntoReview,
  onImportRecords,
}: ComplaintTrackerSectionProps) {
  const dx = getDashboardExtrasStrings(language);
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const [backupNotice, setBackupNotice] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const handleExportBackup = () => {
    const payload = {
      app: "MakkalVoice",
      version: 1,
      exportedAt: new Date().toISOString(),
      records,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `makkalvoice-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setBackupNotice({ kind: "ok", text: dx.backupExportedToast });
    setTimeout(() => setBackupNotice(null), 3500);
  };

  const handleImportFile = async (file: File | null) => {
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as unknown;
      const list = Array.isArray(parsed)
        ? parsed
        : parsed && typeof parsed === "object" && Array.isArray((parsed as { records?: unknown }).records)
          ? (parsed as { records: unknown[] }).records
          : null;
      if (!list) throw new Error("Invalid format");
      const valid = list.filter(
        (item): item is SavedComplaintRecord =>
          Boolean(
            item &&
              typeof item === "object" &&
              typeof (item as SavedComplaintRecord).id === "string" &&
              typeof (item as SavedComplaintRecord).subject === "string",
          ),
      );
      if (valid.length === 0) throw new Error("Empty or invalid");
      onImportRecords(valid);
      setBackupNotice({ kind: "ok", text: dx.backupImportedToast });
      setTimeout(() => setBackupNotice(null), 3500);
    } catch {
      setBackupNotice({ kind: "err", text: dx.backupInvalidError });
    } finally {
      if (importInputRef.current) importInputRef.current.value = "";
    }
  };

  return (
    <section
      id="complaint-tracker"
      className="no-print bg-white border border-slate-200/90 rounded-2xl shadow-[0_1px_3px_rgba(15,23,42,0.05)] p-5 sm:p-8"
    >
      <div>
        {/* Squared Header Row: Title + Backup Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-slate-200/80">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-950 flex items-center gap-2.5">
              <BookmarkCheck className="w-5 h-5 text-blue-700 shrink-0" aria-hidden="true" />
              {it.trackerTitle}
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 max-w-2xl leading-relaxed">
              {it.trackerSub}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <input
              ref={importInputRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => void handleImportFile(e.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              onClick={handleExportBackup}
              disabled={records.length === 0}
              className="h-9 inline-flex items-center justify-center gap-1.5 px-3 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors whitespace-nowrap disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              {dx.exportBackupBtn}
            </button>
            <button
              type="button"
              onClick={() => importInputRef.current?.click()}
              className="h-9 inline-flex items-center justify-center gap-1.5 px-3 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors whitespace-nowrap"
            >
              <Upload className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              {dx.importBackupBtn}
            </button>
          </div>
        </div>

        {backupNotice && (
          <div
            role={backupNotice.kind === "err" ? "alert" : "status"}
            className={`mt-4 px-4 py-3 text-xs sm:text-sm rounded-xl border flex items-center gap-2 ${
              backupNotice.kind === "ok"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {backupNotice.kind === "ok" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0" aria-hidden="true" />
            )}
            <span>{backupNotice.text}</span>
          </div>
        )}

        {records.length === 0 ? (
          <div className="mt-6 bg-slate-50/50 border border-slate-200/90 rounded-xl p-6 text-sm text-slate-600 leading-relaxed">
            {it.trackerEmpty}
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {records.map((rec) => {
              const dueForFollowup =
                rec.status !== "resolved" && isPastOrToday(rec.reminderDate);
              const isEscalating = escalatingId === rec.id;
              const isDraftingRti = rtiDraftingId === rec.id;
              const isAnyBusy = Boolean(escalatingId || rtiDraftingId);

              return (
                <article
                  key={rec.id}
                  className="bg-white border border-slate-200/90 rounded-2xl shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-5 space-y-4"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 pb-3.5 border-b border-slate-100">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-mono tabular-nums">{rec.createdAt}</span>
                        <span aria-hidden="true">·</span>
                        <span>{rec.portalName}</span>
                        {dueForFollowup && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-1 font-medium text-amber-800">
                              <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                              {it.overdueReminderBadge}
                            </span>
                          </>
                        )}
                      </div>
                      <h3 className="mt-1 font-display text-base font-semibold text-slate-950">
                        {rec.subject}
                      </h3>
                      {(rec.district || rec.state) && (
                        <p className="mt-0.5 text-xs text-slate-500">
                          {[
                            rec.town,
                            rec.district ? getLocalizedDistrictName(rec.district, language) : "",
                            rec.state ? getLocalizedStateName(rec.state, language) : "",
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onLoadRecordIntoReview(rec)}
                        className="h-9 px-3 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
                      >
                        {it.loadIntoEditorBtn}
                      </button>

                      {rec.portalUrl.startsWith("https://") && (
                        <a
                          href={rec.portalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-9 inline-flex items-center gap-1 px-3 text-xs font-medium text-blue-700 hover:text-blue-900 border border-blue-200/80 bg-blue-50/60 rounded-lg transition-colors whitespace-nowrap"
                        >
                          {visitPortalLabel}
                          <ExternalLink className="w-3 h-3" aria-hidden="true" />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => onDeleteRecord(rec.id)}
                        className="h-9 inline-flex items-center justify-center px-2.5 text-xs text-slate-500 hover:text-red-700 border border-slate-200 rounded-lg transition-colors"
                        aria-label={it.deleteRecordBtn}
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  {/* Squared Row 1: Tracking ID (6), Status (3), Follow-up Date (3) */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    <div className="md:col-span-6">
                      <label
                        htmlFor={`track-id-${rec.id}`}
                        className="block text-xs font-medium text-slate-700"
                      >
                        {it.trackingIdLabel}
                      </label>
                      <input
                        id={`track-id-${rec.id}`}
                        type="text"
                        value={rec.trackingId}
                        onChange={(e) =>
                          onUpdateRecord(rec.id, {
                            trackingId: e.target.value,
                            status:
                              e.target.value.trim() && rec.status === "drafted"
                                ? "submitted"
                                : rec.status,
                          })
                        }
                        placeholder={it.trackingIdPlaceholder}
                        className="mt-1 w-full h-10 px-3 text-xs sm:text-sm font-mono text-slate-900 bg-slate-50/50 border border-slate-300/90 rounded-lg focus:outline-none focus:bg-white focus:border-blue-600"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label
                        htmlFor={`track-status-${rec.id}`}
                        className="block text-xs font-medium text-slate-700"
                      >
                        {it.statusLabel}
                      </label>
                      <select
                        id={`track-status-${rec.id}`}
                        value={rec.status}
                        onChange={(e) =>
                          onUpdateRecord(rec.id, {
                            status: e.target.value as SavedComplaintStatus,
                          })
                        }
                        className="mt-1 w-full h-10 px-2.5 text-xs sm:text-sm text-slate-900 bg-white border border-slate-300/90 rounded-lg focus:outline-none focus:border-blue-600"
                      >
                        <option value="drafted">{it.statusDrafted}</option>
                        <option value="submitted">{it.statusSubmitted}</option>
                        <option value="followup_due">{it.statusFollowupDue}</option>
                        <option value="resolved">{it.statusResolved}</option>
                      </select>
                    </div>

                    <div className="md:col-span-3">
                      <label
                        htmlFor={`track-date-${rec.id}`}
                        className="block text-xs font-medium text-slate-700"
                      >
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" aria-hidden="true" />
                          {it.reminderDateLabel}
                        </span>
                      </label>
                      <input
                        id={`track-date-${rec.id}`}
                        type="date"
                        value={rec.reminderDate}
                        onChange={(e) =>
                          onUpdateRecord(rec.id, { reminderDate: e.target.value })
                        }
                        className="mt-1 w-full h-10 px-2.5 text-xs font-mono text-slate-900 bg-white border border-slate-300/90 rounded-lg focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  {/* Squared Row 2: 4 Equal-Width Action Buttons (2x2 mobile, 4x1 desktop) */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => downloadFollowUpCalendarIcs(rec)}
                      className="h-10 inline-flex items-center justify-center gap-1.5 px-3 text-xs font-medium text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
                    >
                      <CalendarPlus className="w-3.5 h-3.5 text-blue-700 shrink-0" aria-hidden="true" />
                      <span className="truncate">{dx.addCalendarBtn}</span>
                    </button>

                    <a
                      href={buildGoogleCalendarReminderUrl(rec)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 inline-flex items-center justify-center gap-1.5 px-3 text-xs font-medium text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
                    >
                      <Calendar className="w-3.5 h-3.5 text-blue-700 shrink-0" aria-hidden="true" />
                      <span className="truncate">{dx.googleCalendarBtn}</span>
                    </a>

                    <button
                      type="button"
                      disabled={isAnyBusy}
                      onClick={() => onGenerateRtiInquiry(rec)}
                      className="h-10 inline-flex items-center justify-center gap-1.5 px-3 text-xs font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
                    >
                      {isDraftingRti ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" aria-hidden="true" />
                      ) : (
                        <FileSearch className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      )}
                      <span className="truncate">
                        {isDraftingRti ? dx.draftingRti : dx.draftRtiBtn}
                      </span>
                    </button>

                    <button
                      type="button"
                      disabled={isAnyBusy}
                      onClick={() => onGenerateEscalation(rec)}
                      className="h-10 inline-flex items-center justify-center gap-1.5 px-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
                    >
                      {isEscalating ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" aria-hidden="true" />
                      ) : (
                        <FileUp className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      )}
                      <span className="truncate">
                        {isEscalating ? it.generatingEscalation : it.generateEscalationBtn}
                      </span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
