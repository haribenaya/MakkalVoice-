import { useRef } from "react";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ChevronDown,
  FileText,
  Hash,
  Loader2,
  Lock,
  MapPin,
  Mic,
  MicOff,
  Phone,
  RotateCcw,
  User,
  Volume2,
  VolumeX,
} from "lucide-react";
import { COMPLAINT_CATEGORIES, LANGUAGES, SAMPLE_SCENARIOS } from "../data/languages";
import { INDIA_STATE_DISTRICTS, INDIAN_STATES_AND_UTS } from "../data/indiaLocations";
import type { InnovationStrings } from "../data/innovationTranslations";
import { getLocalizedDistrictName, getLocalizedStateName } from "../data/localizedLocations";
import { getLocalizedError } from "../data/localizedErrors";
import { getLocalizedSampleLabel } from "../data/localizedPortals";
import type { SubmissionUiStrings } from "../data/submissionTranslations";
import type { UiStrings } from "../data/translations";
import type {
  ComplaintCategory,
  ComplaintFormState,
  GpsLocationResult,
  SubmissionMode,
} from "../types";
import { LocationPinpointPicker } from "./LocationPinpointPicker";

export interface ComplaintFieldErrors {
  complaint?: boolean;
  name?: boolean;
  contact?: boolean;
}

interface ComplaintFormProps {
  t: UiStrings;
  st: SubmissionUiStrings;
  it: InnovationStrings;
  form: ComplaintFormState;
  onChange: <K extends keyof ComplaintFormState>(field: K, value: ComplaintFormState[K]) => void;
  onApplySample: (sampleIndex: number) => void;
  onReset: () => void;
  onSubmit: () => void;
  onAutoDetectFromVoice: () => void;
  extractingVoice: boolean;
  autoFillNotice: string | null;
  onScanEvidenceFile: (file: File) => void;
  scanningEvidence: boolean;
  scanPreviewUrl: string | null;
  scanNotice: string | null;
  onGpsLocationResolved: (result: GpsLocationResult) => void;
  autosaved: boolean;
  busy: boolean;
  isListening: boolean;
  isTranscribing: boolean;
  voiceAudioLevel: number;
  voiceElapsedSeconds: number;
  voiceLiveTranscript?: string;
  speechSupported: boolean;
  onToggleVoice: () => void;
  speechOutputSupported: boolean;
  isReadingGuide: boolean;
  onToggleReadGuide: () => void;
  errorMessage: string | null;
  fieldErrors?: ComplaintFieldErrors;
}

export function ComplaintForm({
  t,
  st,
  it,
  form,
  onChange,
  onApplySample,
  onReset,
  onSubmit,
  onAutoDetectFromVoice,
  extractingVoice,
  autoFillNotice,
  onScanEvidenceFile,
  scanningEvidence,
  scanPreviewUrl,
  scanNotice,
  onGpsLocationResolved,
  autosaved,
  busy,
  isListening,
  isTranscribing,
  voiceAudioLevel,
  voiceElapsedSeconds,
  voiceLiveTranscript = "",
  speechSupported,
  onToggleVoice,
  speechOutputSupported,
  isReadingGuide,
  onToggleReadGuide,
  errorMessage,
  fieldErrors,
}: ComplaintFormProps) {
  const scanFileInputRef = useRef<HTMLInputElement | null>(null);
  const districtsForState = form.state ? INDIA_STATE_DISTRICTS[form.state] ?? [] : [];
  const activeLanguageObj = LANGUAGES.find((l) => l.name === form.language);

  const elapsedLabel = `${Math.floor(voiceElapsedSeconds / 60)}:${voiceElapsedSeconds % 60 < 10 ? "0" : ""}${voiceElapsedSeconds % 60}`;

  const handleStateChange = (newState: string) => {
    onChange("state", newState);
    onChange("district", "");
    onChange("customDistrict", "");
  };

  const modes: Array<{ id: SubmissionMode; label: string }> = [
    { id: "complaint", label: it.modeComplaint },
    { id: "rti", label: it.modeRti },
    { id: "escalation", label: it.modeEscalation },
  ];

  const isSpecialMode = form.mode !== "complaint";

  return (
    <section
      id="complaint-form"
      aria-labelledby="describe-heading"
      className="bg-white border border-slate-200/90 rounded-2xl shadow-[0_1px_3px_rgba(15,23,42,0.05)] p-5 sm:p-8"
    >
      {/* Calm Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <p className="text-xs font-semibold text-blue-700">{t.step1Kicker}</p>
            {autosaved && (
              <>
                <span aria-hidden="true" className="text-xs text-slate-300">·</span>
                <span className="inline-flex items-center gap-1 text-xs text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  {it.autosavedBadge}
                </span>
              </>
            )}
          </div>
          <h2
            id="describe-heading"
            className="mt-1.5 font-display text-2xl sm:text-[1.75rem] font-bold tracking-tight text-slate-950 [text-wrap:balance]"
          >
            {t.step1Heading}
          </h2>
          <p className="mt-1.5 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            {t.step1Subheading}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {speechOutputSupported && (
            <button
              type="button"
              onClick={onToggleReadGuide}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-800 bg-blue-50/70 hover:bg-blue-100 border border-blue-200/80 rounded-xl transition-colors whitespace-nowrap min-h-[40px]"
            >
              {isReadingGuide ? (
                <>
                  <VolumeX className="w-4 h-4" aria-hidden="true" />
                  {t.stopReading}
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" aria-hidden="true" />
                  {t.readInstructions}
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            disabled={busy || extractingVoice || scanningEvidence || isTranscribing}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-950 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors whitespace-nowrap min-h-[40px] disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            {t.clearForm}
          </button>
        </div>
      </div>

      <form
        noValidate
        className="mt-7 space-y-8"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        {/* PART 1: Speak, Scan Photo/Bill, or Type Your Problem */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-700 text-white font-mono text-xs font-semibold tabular-nums shrink-0">
              1
            </span>
            <h3 className="font-display text-base sm:text-lg font-semibold text-slate-950">
              {st.step1Part1Title}
            </h3>
          </div>

          {/* 2 Simple, Friendly Input Actions: Speak OR Scan Photo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onToggleVoice}
              disabled={busy || isTranscribing || !speechSupported}
              aria-pressed={isListening}
              className={`w-full inline-flex items-center justify-center gap-2.5 px-5 py-3.5 text-sm sm:text-base font-semibold rounded-xl shadow-xs transition-all min-h-[54px] active:scale-[0.99] ${
                isListening
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-blue-700 text-white hover:bg-blue-800 disabled:bg-slate-300 disabled:text-slate-600"
              }`}
            >
              {isTranscribing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin shrink-0" aria-hidden="true" />
                  <span className="truncate">{getLocalizedError("CONVERTING_VOICE", form.language)}</span>
                </>
              ) : isListening ? (
                <>
                  <MicOff className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span>
                    {t.stopListening} ({elapsedLabel})
                  </span>
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span className="truncate">
                    {t.tapToSpeak} ({activeLanguageObj?.nativeLabel ?? form.language})
                  </span>
                </>
              )}
            </button>

            <div>
              <input
                ref={scanFileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onScanEvidenceFile(file);
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                disabled={busy || scanningEvidence || isListening}
                onClick={() => scanFileInputRef.current?.click()}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm sm:text-base font-medium text-slate-900 bg-slate-50 border border-slate-300/90 hover:bg-slate-100 rounded-xl transition-colors min-h-[54px] disabled:opacity-50"
              >
                {scanningEvidence ? (
                  <Loader2 className="w-5 h-5 animate-spin text-blue-700 shrink-0" aria-hidden="true" />
                ) : (
                  <Camera className="w-5 h-5 text-blue-700 shrink-0" aria-hidden="true" />
                )}
                <span className="truncate">
                  {scanningEvidence ? it.scanningPhoto : it.scanPhotoBtn}
                </span>
              </button>
            </div>
          </div>

          {!speechSupported && (
            <p className="text-xs text-amber-800">{t.voiceUnsupported}</p>
          )}

          {/* Live Recording Voice Level Bar */}
          {isListening && (
            <div
              role="status"
              aria-live="polite"
              className="px-4 py-3.5 text-sm bg-red-50 text-red-900 border border-red-200 rounded-xl space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold">{t.listeningNow}</span>
                <span className="font-mono text-xs font-semibold tabular-nums text-red-700">
                  {elapsedLabel}
                </span>
              </div>
              <div className="w-full h-2.5 bg-red-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-600 transition-all duration-75"
                  style={{ width: `${Math.max(8, voiceAudioLevel)}%` }}
                />
              </div>
              {voiceLiveTranscript && (
                <p className="text-xs text-slate-800 bg-white/90 border border-red-200/70 rounded-lg px-3 py-2 leading-relaxed">
                  <span className="font-semibold text-red-700 me-1.5">
                    {getLocalizedError("LIVE_PREVIEW_LABEL", form.language)}:
                  </span>
                  {voiceLiveTranscript}
                </p>
              )}
            </div>
          )}

          {scanNotice && (
            <div
              role="status"
              className="px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3"
            >
              {scanPreviewUrl && (
                <img
                  src={scanPreviewUrl}
                  alt="Scanned evidence preview"
                  className="w-12 h-12 rounded-lg object-cover border border-emerald-200 shrink-0"
                />
              )}
              <p className="text-xs font-medium text-emerald-900 leading-relaxed">
                {scanNotice}
              </p>
            </div>
          )}

          {autoFillNotice && (
            <div
              role="status"
              className="px-4 py-2.5 text-xs font-medium text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-xl"
            >
              {autoFillNotice}
            </div>
          )}

          {/* Problem Description Textarea */}
          <div>
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="complaint-textarea"
                className="block text-sm font-medium text-slate-900"
              >
                {t.complaintLabel}{" "}
                <span className="text-red-600" aria-hidden="true">*</span>
              </label>
              <span className="text-[11px] font-semibold text-red-700">
                {it.mandatoryTag}
              </span>
            </div>
            <textarea
              id="complaint-textarea"
              rows={4}
              required
              aria-invalid={Boolean(fieldErrors?.complaint)}
              value={form.complaint}
              onChange={(e) => onChange("complaint", e.target.value)}
              disabled={busy}
              placeholder={t.complaintPlaceholder}
              className={`mt-2 w-full p-4 text-base leading-relaxed text-slate-950 bg-slate-50/40 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-colors resize-y ${
                fieldErrors?.complaint
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
                  : "border-slate-300/90 focus:border-blue-600 focus:ring-blue-600/15"
              }`}
            />
            {fieldErrors?.complaint && (
              <p className="mt-1.5 text-xs font-medium text-red-700">
                {t.errEmptyComplaint}
              </p>
            )}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <span>{t.reviewVoiceHint}</span>
              <div className="flex items-center gap-3">
                {form.complaint.trim().length >= 8 && (
                  <button
                    type="button"
                    onClick={onAutoDetectFromVoice}
                    disabled={busy || extractingVoice}
                    className="inline-flex items-center gap-1 font-medium text-blue-700 hover:text-blue-900 underline underline-offset-4 disabled:opacity-50"
                  >
                    <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    {extractingVoice ? t.autoFilling : t.autoFillVoice}
                  </button>
                )}
                <span className="font-mono tabular-nums">{form.complaint.length} / 2500</span>
              </div>
            </div>
          </div>

          {/* Quick Starter Examples */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600">
            <span className="font-medium text-slate-500">{t.tryExample}</span>
            {SAMPLE_SCENARIOS.map((sample, idx) => (
              <button
                key={sample.label}
                type="button"
                disabled={busy}
                onClick={() => onApplySample(idx)}
                className="text-blue-700 hover:text-blue-900 underline underline-offset-4 decoration-blue-300 hover:decoration-blue-700 transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {getLocalizedSampleLabel(idx, form.language, sample.label)}
              </button>
            ))}
          </div>
        </div>

        {/* PART 2: Where Is the Problem? */}
        <div className="pt-7 border-t border-slate-200/80 space-y-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 text-white font-mono text-xs font-semibold tabular-nums shrink-0">
                2
              </span>
              <h3 className="font-display text-base sm:text-lg font-semibold text-slate-950">
                {t.locationSectionTitle}
              </h3>
            </div>
            <p className="mt-1.5 ms-10 text-xs sm:text-sm text-slate-500">
              {t.locationSectionHint}
            </p>
          </div>

          <LocationPinpointPicker
            it={it}
            lat={form.gpsLat}
            lng={form.gpsLng}
            disabled={busy}
            onLocationResolved={onGpsLocationResolved}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="category-select"
                className="block text-sm font-medium text-slate-800"
              >
                {t.categoryLabel}
              </label>
              <select
                id="category-select"
                value={form.category}
                onChange={(e) => onChange("category", e.target.value as ComplaintCategory)}
                disabled={busy}
                className="mt-1.5 w-full h-12 px-3.5 text-base sm:text-sm text-slate-900 bg-white border border-slate-300/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600"
              >
                {COMPLAINT_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {t.categories[cat.value] ?? cat.value}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="state-select"
                className="block text-sm font-medium text-slate-800"
              >
                {t.stateLabel}
              </label>
              <select
                id="state-select"
                value={form.state}
                onChange={(e) => handleStateChange(e.target.value)}
                disabled={busy}
                className="mt-1.5 w-full h-12 px-3.5 text-base sm:text-sm text-slate-900 bg-white border border-slate-300/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600"
              >
                <option value="">{t.selectState}</option>
                {INDIAN_STATES_AND_UTS.map((stateName) => (
                  <option key={stateName} value={stateName}>
                    {getLocalizedStateName(stateName, form.language)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="district-select"
                className="block text-sm font-medium text-slate-800"
              >
                {t.districtLabel}
              </label>
              {districtsForState.length > 0 ? (
                <>
                  <select
                    id="district-select"
                    value={form.district}
                    onChange={(e) => onChange("district", e.target.value)}
                    disabled={busy}
                    className="mt-1.5 w-full h-12 px-3.5 text-base sm:text-sm text-slate-900 bg-white border border-slate-300/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600"
                  >
                    <option value="">{t.selectDistrict}</option>
                    {districtsForState.map((d) => (
                      <option key={d} value={d}>
                        {getLocalizedDistrictName(d, form.language)}
                      </option>
                    ))}
                    <option value="__other__">{t.otherDistrictOption}</option>
                  </select>
                  {form.district === "__other__" && (
                    <input
                      type="text"
                      value={form.customDistrict}
                      onChange={(e) => onChange("customDistrict", e.target.value)}
                      disabled={busy}
                      placeholder={t.enterDistrictPlaceholder}
                      className="mt-2 w-full h-11 px-3.5 text-base sm:text-sm text-slate-900 bg-white border border-slate-300/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600"
                    />
                  )}
                </>
              ) : (
                <input
                  id="district-select"
                  type="text"
                  value={form.district === "__other__" ? form.customDistrict : form.district}
                  onChange={(e) => onChange("district", e.target.value)}
                  disabled={busy}
                  placeholder={form.state ? t.enterDistrictPlaceholder : t.selectStateFirst}
                  className="mt-1.5 w-full h-12 px-3.5 text-base sm:text-sm text-slate-900 bg-white border border-slate-300/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="town-input"
                className="block text-sm font-medium text-slate-800"
              >
                {t.townLabel}
              </label>
              <input
                id="town-input"
                type="text"
                value={form.town}
                onChange={(e) => onChange("town", e.target.value)}
                disabled={busy}
                placeholder={t.townPlaceholder}
                className="mt-1.5 w-full h-12 px-3.5 text-base sm:text-sm text-slate-900 bg-white border border-slate-300/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600"
              />
            </div>

            <div>
              <label
                htmlFor="street-input"
                className="block text-sm font-medium text-slate-800"
              >
                {t.streetLabel}
              </label>
              <input
                id="street-input"
                type="text"
                value={form.street}
                onChange={(e) => onChange("street", e.target.value)}
                disabled={busy}
                placeholder={t.streetPlaceholder}
                className="mt-1.5 w-full h-12 px-3.5 text-base sm:text-sm text-slate-900 bg-white border border-slate-300/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600"
              />
            </div>

            <div>
              <label
                htmlFor="pincode-input"
                className="block text-sm font-medium text-slate-800"
              >
                {st.pincodeLabel}
              </label>
              <div className="relative mt-1.5">
                <Hash
                  className="w-4 h-4 text-slate-400 pointer-events-none absolute top-1/2 -translate-y-1/2 start-3.5"
                  aria-hidden="true"
                />
                <input
                  id="pincode-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={form.pincode}
                  onChange={(e) => onChange("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                  disabled={busy}
                  placeholder={st.pincodePlaceholder}
                  className="w-full h-12 ps-10 pe-3.5 text-base sm:text-sm font-mono tabular-nums text-slate-900 bg-white border border-slate-300/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* PART 3: Your Details (Required — stays private on your phone) */}
        <div className="pt-7 border-t border-slate-200/80 space-y-4">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 text-white font-mono text-xs font-semibold tabular-nums shrink-0">
                  3
                </span>
                <h3 className="font-display text-base sm:text-lg font-semibold text-slate-950">
                  {st.citizenDetailsTitle}{" "}
                  <span className="text-red-600" aria-hidden="true">*</span>
                </h3>
              </div>
              <span className="text-xs font-semibold text-red-700">
                * {it.mandatoryTag}
              </span>
            </div>
            <p className="mt-1.5 ms-10 text-xs text-slate-500 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
              <span>{st.citizenDetailsNote}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="name-input"
                  className="block text-sm font-medium text-slate-800"
                >
                  {st.requiredNameLabel}{" "}
                  <span className="text-red-600" aria-hidden="true">*</span>
                </label>
                <span className="text-[11px] font-semibold text-red-700">
                  {it.mandatoryTag}
                </span>
              </div>
              <div className="relative mt-1.5">
                <User
                  className="w-4 h-4 text-slate-400 pointer-events-none absolute top-1/2 -translate-y-1/2 start-3.5"
                  aria-hidden="true"
                />
                <input
                  id="name-input"
                  type="text"
                  required
                  aria-required="true"
                  autoComplete="name"
                  aria-invalid={Boolean(fieldErrors?.name)}
                  value={form.name}
                  onChange={(e) => onChange("name", e.target.value)}
                  disabled={busy}
                  placeholder={st.requiredNamePlaceholder}
                  className={`w-full h-12 ps-10 pe-3.5 text-base sm:text-sm text-slate-900 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                    fieldErrors?.name
                      ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-500/15"
                      : "border-slate-300/90 focus:border-blue-600 focus:ring-blue-600/15"
                  }`}
                />
              </div>
              {fieldErrors?.name && (
                <p className="mt-1.5 text-xs font-medium text-red-700">
                  {st.errMissingName}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="contact-input"
                  className="block text-sm font-medium text-slate-800"
                >
                  {st.requiredPhoneLabel}{" "}
                  <span className="text-red-600" aria-hidden="true">*</span>
                </label>
                <span className="text-[11px] font-semibold text-red-700">
                  {it.mandatoryTag}
                </span>
              </div>
              <div className="relative mt-1.5">
                <Phone
                  className="w-4 h-4 text-slate-400 pointer-events-none absolute top-1/2 -translate-y-1/2 start-3.5"
                  aria-hidden="true"
                />
                <input
                  id="contact-input"
                  type="tel"
                  inputMode="tel"
                  required
                  aria-required="true"
                  autoComplete="tel"
                  aria-invalid={Boolean(fieldErrors?.contact)}
                  value={form.contact}
                  onChange={(e) => onChange("contact", e.target.value)}
                  disabled={busy}
                  placeholder={st.requiredPhonePlaceholder}
                  className={`w-full h-12 ps-10 pe-3.5 text-base sm:text-sm font-mono tabular-nums text-slate-900 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                    fieldErrors?.contact
                      ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-500/15"
                      : "border-slate-300/90 focus:border-blue-600 focus:ring-blue-600/15"
                  }`}
                />
              </div>
              {fieldErrors?.contact && (
                <p className="mt-1.5 text-xs font-medium text-red-700">
                  {st.errInvalidPhone}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="reference-input"
                className="block text-sm font-medium text-slate-800"
              >
                {st.referenceNumberLabel}
              </label>
              <div className="relative mt-1.5">
                <FileText
                  className="w-4 h-4 text-slate-400 pointer-events-none absolute top-1/2 -translate-y-1/2 start-3.5"
                  aria-hidden="true"
                />
                <input
                  id="reference-input"
                  type="text"
                  value={form.referenceNumber}
                  onChange={(e) => onChange("referenceNumber", e.target.value)}
                  disabled={busy}
                  placeholder={st.referenceNumberPlaceholder}
                  className="w-full h-12 ps-10 pe-3.5 text-base sm:text-sm font-mono text-slate-900 bg-white border border-slate-300/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quiet Optional Advanced Mode (Hidden by default so beginners are never confused by RTI / Escalation) */}
        <details
          open={isSpecialMode}
          className="pt-5 border-t border-slate-200/80 group"
        >
          <summary className="list-none cursor-pointer flex items-center justify-between gap-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-950 select-none">
            <span>
              {it.filingModeLabel}:{" "}
              <strong className="font-semibold text-slate-900">
                {modes.find((m) => m.id === form.mode)?.label ?? it.modeComplaint}
              </strong>
            </span>
            <ChevronDown
              className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180 shrink-0"
              aria-hidden="true"
            />
          </summary>

          <div className="mt-3.5 space-y-3">
            <div
              role="group"
              aria-label={it.filingModeLabel}
              className="grid grid-cols-1 sm:grid-cols-3 gap-2"
            >
              {modes.map((m) => {
                const selected = form.mode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    disabled={busy}
                    onClick={() => onChange("mode", m.id)}
                    className={`px-3.5 py-2.5 text-xs sm:text-sm font-medium rounded-xl border text-start transition-colors min-h-[44px] ${
                      selected
                        ? "bg-slate-900 text-white border-slate-900 font-semibold"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-950"
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>

            {form.mode === "rti" && (
              <p className="text-xs text-blue-900 bg-blue-50/70 border border-blue-200/80 rounded-xl px-4 py-3 leading-relaxed">
                {it.modeRtiHint}
              </p>
            )}

            {form.mode === "escalation" && (
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2.5">
                <p className="text-xs text-amber-950 leading-relaxed">{it.modeEscalationHint}</p>
                <div>
                  <label
                    htmlFor="previous-ticket-input"
                    className="block text-xs font-semibold text-slate-800"
                  >
                    {it.previousTicketIdLabel}
                  </label>
                  <input
                    id="previous-ticket-input"
                    type="text"
                    value={form.previousTicketId}
                    onChange={(e) => onChange("previousTicketId", e.target.value)}
                    disabled={busy}
                    placeholder={it.previousTicketIdPlaceholder}
                    className="mt-1 w-full h-11 px-3.5 text-sm font-mono text-slate-900 bg-white border border-slate-300/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600"
                  />
                </div>
              </div>
            )}
          </div>
        </details>

        {errorMessage && (
          <div
            role="alert"
            className="px-4 py-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded-xl"
          >
            {errorMessage}
          </div>
        )}

        {/* Primary Submit Row */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-slate-500">{t.nextStepHint}</p>
          <button
            type="submit"
            disabled={busy || extractingVoice || scanningEvidence || isTranscribing}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-all active:scale-[0.99] whitespace-nowrap shrink-0 min-h-[52px] disabled:opacity-60"
          >
            {busy ? t.analyzingDetails : t.prepareComplaint}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </form>
    </section>
  );
}
