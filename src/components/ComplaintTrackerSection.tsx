import {
  AlertCircle,
  BookmarkCheck,
  Calendar,
  ExternalLink,
  FileUp,
  Loader2,
  Trash2,
} from "lucide-react";
import type { InnovationStrings } from "../data/innovationTranslations";
import type { SavedComplaintRecord, SavedComplaintStatus } from "../types";

interface ComplaintTrackerSectionProps {
  it: InnovationStrings;
  records: SavedComplaintRecord[];
  escalatingId: string | null;
  onUpdateRecord: (id: string, patch: Partial<SavedComplaintRecord>) => void;
  onDeleteRecord: (id: string) => void;
  onGenerateEscalation: (record: SavedComplaintRecord) => void;
  onLoadRecordIntoReview: (record: SavedComplaintRecord) => void;
}

function isPastOrToday(isoDate: string): boolean {
  if (!isoDate) return false;
  const today = new Date().toISOString().slice(0, 10);
  return isoDate <= today;
}

export function ComplaintTrackerSection({
  it,
  records,
  escalatingId,
  onUpdateRecord,
  onDeleteRecord,
  onGenerateEscalation,
  onLoadRecordIntoReview,
}: ComplaintTrackerSectionProps) {
  return (
    <section
      id="complaint-tracker"
      className="no-print border-t border-slate-200 bg-slate-50 py-12"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-950 flex items-center gap-2">
              <BookmarkCheck className="w-5 h-5 text-blue-700 shrink-0" aria-hidden="true" />
              {it.trackerTitle}
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 max-w-2xl leading-relaxed">
              {it.trackerSub}
            </p>
          </div>
          {records.length > 0 && (
            <span className="font-mono text-xs tabular-nums text-slate-500">
              {records.length}
            </span>
          )}
        </div>

        {records.length === 0 ? (
          <div className="mt-6 bg-white border border-slate-200/90 rounded-2xl p-6 text-sm text-slate-600 leading-relaxed">
            {it.trackerEmpty}
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {records.map((rec) => {
              const dueForFollowup =
                rec.status !== "resolved" && isPastOrToday(rec.reminderDate);
              const isEscalating = escalatingId === rec.id;

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
                          {[rec.town, rec.district, rec.state].filter(Boolean).join(", ")}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onLoadRecordIntoReview(rec)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
                      >
                        {it.loadIntoEditorBtn}
                      </button>

                      {rec.portalUrl.startsWith("https://") && (
                        <a
                          href={rec.portalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 hover:text-blue-900 border border-blue-200/80 bg-blue-50/60 rounded-lg transition-colors whitespace-nowrap"
                        >
                          Portal
                          <ExternalLink className="w-3 h-3" aria-hidden="true" />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => onDeleteRecord(rec.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-500 hover:text-red-700 rounded-lg transition-colors"
                        aria-label={it.deleteRecordBtn}
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  {/* Tracking ID, Status & Reminder Date Controls */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    <div className="md:col-span-5">
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

                    <div className="md:col-span-2">
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

                    <div className="md:col-span-2">
                      <button
                        type="button"
                        disabled={isEscalating}
                        onClick={() => onGenerateEscalation(rec)}
                        className="w-full h-10 inline-flex items-center justify-center gap-1.5 px-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
                      >
                        {isEscalating ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" aria-hidden="true" />
                        ) : (
                          <FileUp className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        )}
                        <span>
                          {isEscalating ? it.generatingEscalation : it.generateEscalationBtn}
                        </span>
                      </button>
                    </div>
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
