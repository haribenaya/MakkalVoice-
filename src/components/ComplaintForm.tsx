import { useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  Mic,
  MicOff,
  RotateCcw,
  ShieldCheck,
  Volume2,
  VolumeX,
} from "lucide-react";
import { COMPLAINT_CATEGORIES, LANGUAGES, SAMPLE_SCENARIOS } from "../data/languages";
import { INDIA_STATE_DISTRICTS, INDIAN_STATES_AND_UTS } from "../data/indiaLocations";
import type { UiStrings } from "../data/translations";
import type { ComplaintCategory, ComplaintFormState } from "../types";

interface ComplaintFormProps {
  t: UiStrings;
  form: ComplaintFormState;
  onChange: <K extends keyof ComplaintFormState>(field: K, value: ComplaintFormState[K]) => void;
  onApplySample: (sampleIndex: number) => void;
  onReset: () => void;
  onSubmit: () => void;
  onAutoDetectFromVoice: () => void;
  extractingVoice: boolean;
  autoFillNotice: string | null;
  busy: boolean;
  isListening: boolean;
  interimTranscript: string;
  speechSupported: boolean;
  onToggleVoice: () => void;
  speechOutputSupported: boolean;
  isReadingGuide: boolean;
  onToggleReadGuide: () => void;
  errorMessage: string | null;
}

export function ComplaintForm({
  t,
  form,
  onChange,
  onApplySample,
  onReset,
  onSubmit,
  onAutoDetectFromVoice,
  extractingVoice,
  autoFillNotice,
  busy,
  isListening,
  interimTranscript,
  speechSupported,
  onToggleVoice,
  speechOutputSupported,
  isReadingGuide,
  onToggleReadGuide,
  errorMessage,
}: ComplaintFormProps) {
  const [showOptionalPersonal, setShowOptionalPersonal] = useState(
    Boolean(form.name.trim() || form.contact.trim()),
  );

  const districtsForState = form.state ? INDIA_STATE_DISTRICTS[form.state] ?? [] : [];
  const activeLanguageObj = LANGUAGES.find((l) => l.name === form.language);

  const handleStateChange = (newState: string) => {
    onChange("state", newState);
    onChange("district", "");
    onChange("customDistrict", "");
  };

  return (
    <section
      id="complaint-form"
      aria-labelledby="describe-heading"
      className="bg-white border border-slate-200 rounded-xl p-5 sm:p-8"
    >
      {/* Voice-First Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-blue-700">{t.step1Kicker}</p>
          <h2
            id="describe-heading"
            className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-950 [text-wrap:balance]"
          >
            {t.step1Heading}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            {t.step1Subheading}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {speechOutputSupported && (
            <button
              type="button"
              onClick={onToggleReadGuide}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[44px]"
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
            disabled={busy || extractingVoice}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 min-h-[44px] disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            {t.clearForm}
          </button>
        </div>
      </div>

      <form
        className="mt-6 space-y-8"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        {/* PRIMARY FOCAL ANCHOR: Big, Accessible Voice Capture Stage */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <button
              type="button"
              onClick={onToggleVoice}
              disabled={busy || !speechSupported}
              aria-pressed={isListening}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-4 text-base font-semibold rounded-xl transition-colors whitespace-nowrap min-h-[58px] ${
                isListening
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-blue-700 text-white hover:bg-blue-800 disabled:bg-slate-300 disabled:text-slate-600"
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span>{t.stopListening}</span>
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span>
                    {t.tapToSpeak} ({activeLanguageObj?.nativeLabel ?? form.language})
                  </span>
                </>
              )}
            </button>

            {form.complaint.trim().length >= 8 && (
              <button
                type="button"
                onClick={onAutoDetectFromVoice}
                disabled={busy || extractingVoice}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-medium text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap min-h-[44px] disabled:opacity-50"
              >
                <MapPin className="w-4 h-4 text-blue-700 shrink-0" aria-hidden="true" />
                {extractingVoice ? t.autoFilling : t.autoFillVoice}
              </button>
            )}
          </div>

          {!speechSupported && (
            <p className="mt-3 text-xs text-amber-800">{t.voiceUnsupported}</p>
          )}

          {isListening && (
            <div
              role="status"
              aria-live="polite"
              className="mt-4 px-4 py-3 text-sm bg-red-50 text-red-900 border border-red-200 rounded-lg"
            >
              <p className="font-medium">{t.listeningNow}</p>
              {interimTranscript && (
                <p className="mt-1 text-red-700 italic">“{interimTranscript}”</p>
              )}
            </div>
          )}

          {autoFillNotice && (
            <div
              role="status"
              className="mt-3 px-4 py-2.5 text-xs font-medium text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-lg"
            >
              {autoFillNotice}
            </div>
          )}

          {/* Large readable transcript / manual edit box */}
          <div className="mt-4">
            <label
              htmlFor="complaint-textarea"
              className="block text-sm font-medium text-slate-800"
            >
              {t.complaintLabel}{" "}
              <span className="text-red-600" aria-hidden="true">*</span>
            </label>
            <textarea
              id="complaint-textarea"
              rows={4}
              value={form.complaint}
              onChange={(e) => onChange("complaint", e.target.value)}
              disabled={busy}
              placeholder={t.complaintPlaceholder}
              className="mt-2 w-full p-4 text-base leading-relaxed text-slate-950 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors resize-y"
            />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <span>{t.reviewVoiceHint}</span>
              <span className="font-mono tabular-nums">{form.complaint.length} / 2500</span>
            </div>
          </div>

          {/* Quick examples */}
          <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600">
            <span className="font-medium text-slate-500">{t.tryExample}</span>
            {SAMPLE_SCENARIOS.map((sample, idx) => (
              <button
                key={sample.label}
                type="button"
                disabled={busy}
                onClick={() => onApplySample(idx)}
                className="text-blue-700 hover:text-blue-900 underline underline-offset-4 decoration-blue-300 hover:decoration-blue-700 transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Location & Problem Type (for exact official portal routing) */}
        <div className="space-y-5">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              {t.locationSectionTitle}
            </h3>
            <p className="mt-1 text-xs text-slate-500">{t.locationSectionHint}</p>
          </div>

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
                className="mt-1.5 w-full h-12 px-3.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
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
                className="mt-1.5 w-full h-12 px-3.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              >
                <option value="">{t.selectState}</option>
                {INDIAN_STATES_AND_UTS.map((stateName) => (
                  <option key={stateName} value={stateName}>
                    {stateName}
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
                    className="mt-1.5 w-full h-12 px-3.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  >
                    <option value="">{t.selectDistrict}</option>
                    {districtsForState.map((d) => (
                      <option key={d} value={d}>
                        {d}
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
                      className="mt-2 w-full h-11 px-3.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
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
                  className="mt-1.5 w-full h-12 px-3.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className="mt-1.5 w-full h-12 px-3.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
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
                className="mt-1.5 w-full h-12 px-3.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Collapsible Optional Personal Signature Details */}
        <div className="pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setShowOptionalPersonal((v) => !v)}
            aria-expanded={showOptionalPersonal}
            className="w-full flex items-center justify-between gap-3 py-2 text-left text-sm font-medium text-slate-800 hover:text-slate-950 transition-colors min-h-[44px]"
          >
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
              {t.optionalDetailsToggle}
            </span>
            {showOptionalPersonal ? (
              <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
            )}
          </button>

          {showOptionalPersonal && (
            <div className="mt-3 space-y-4">
              <p className="text-xs text-slate-500">{t.optionalPrivacyNote}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name-input"
                    className="block text-sm font-medium text-slate-700"
                  >
                    {t.nameLabel}
                  </label>
                  <input
                    id="name-input"
                    type="text"
                    value={form.name}
                    onChange={(e) => onChange("name", e.target.value)}
                    disabled={busy}
                    placeholder={t.namePlaceholder}
                    className="mt-1.5 w-full h-12 px-3.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-input"
                    className="block text-sm font-medium text-slate-700"
                  >
                    {t.contactLabel}
                  </label>
                  <input
                    id="contact-input"
                    type="text"
                    value={form.contact}
                    onChange={(e) => onChange("contact", e.target.value)}
                    disabled={busy}
                    placeholder={t.contactPlaceholder}
                    className="mt-1.5 w-full h-12 px-3.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="px-4 py-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg"
          >
            {errorMessage}
          </div>
        )}

        {/* Submit Row */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-slate-500">{t.nextStepHint}</p>
          <button
            type="submit"
            disabled={busy || extractingVoice}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors whitespace-nowrap shrink-0 min-h-[52px] disabled:opacity-60"
          >
            {busy ? t.analyzingDetails : t.prepareComplaint}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </form>
    </section>
  );
}
