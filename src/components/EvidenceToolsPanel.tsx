import { useRef, useState } from "react";
import { Download, FileDown, ImagePlus, Loader2, MapPin, Trash2 } from "lucide-react";
import { getDashboardExtrasStrings } from "../data/dashboardExtrasTranslations";
import type { InnovationStrings } from "../data/innovationTranslations";
import type { CoSignerEntry, EvidenceAttachment } from "../types";
import {
  compressImageForPortal,
  downloadOfficialLetterPdf,
  triggerDataUrlDownload,
} from "../utils/mediaTools";

interface EvidenceToolsPanelProps {
  it: InnovationStrings;
  language: string;
  attachments: EvidenceAttachment[];
  onAttachmentsChange: (next: EvidenceAttachment[]) => void;
  subject: string;
  draftText: string;
  portalName?: string;
  referenceNumber?: string;
  gpsLat?: number;
  gpsLng?: number;
  locationStamp?: string;
  coSigners?: CoSignerEntry[];
}

export function EvidenceToolsPanel({
  it,
  language,
  attachments,
  onAttachmentsChange,
  subject,
  draftText,
  portalName,
  referenceNumber,
  gpsLat,
  gpsLng,
  locationStamp,
  coSigners = [],
}: EvidenceToolsPanelProps) {
  const dx = getDashboardExtrasStrings(language);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [stampWatermark, setStampWatermark] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const buildWatermarkString = (): string => {
    const now = new Date();
    const datePart = now.toISOString().slice(0, 10);
    const timePart = now.toTimeString().slice(0, 5);
    const gpsPart =
      typeof gpsLat === "number" && typeof gpsLng === "number"
        ? `GPS ${gpsLat.toFixed(5)}, ${gpsLng.toFixed(5)}`
        : "";
    return [datePart, timePart, gpsPart, locationStamp?.trim() ?? ""]
      .filter(Boolean)
      .join(" · ");
  };

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setCompressing(true);
    setErrorMsg(null);
    try {
      const added: EvidenceAttachment[] = [];
      const limit = Math.min(files.length, Math.max(0, 6 - attachments.length));
      const watermark = stampWatermark ? buildWatermarkString() : undefined;
      for (let i = 0; i < limit; i += 1) {
        const file = files[i];
        if (!file.type.startsWith("image/")) continue;
        const compressed = await compressImageForPortal(file, 1600, 850, watermark);
        added.push(compressed);
      }
      if (added.length > 0) {
        onAttachmentsChange([...attachments, ...added]);
      }
    } catch {
      setErrorMsg(it.compressErrorGeneric);
    } finally {
      setCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = (id: string) => {
    onAttachmentsChange(attachments.filter((a) => a.id !== id));
  };

  const handleBundlePdf = () => {
    downloadOfficialLetterPdf({
      subject,
      draftText,
      portalName,
      referenceNumber,
      attachments,
      coSigners,
      filename: "makkalvoice-letter-with-evidence.pdf",
    });
  };

  return (
    <div className="mt-6 pt-5 border-t border-slate-200 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-slate-950 flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-blue-700">02</span>
            {it.evidenceToolsTitle}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {it.evidenceToolsSub}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => void handleFilesSelected(e.target.files)}
          />
          <button
            type="button"
            disabled={compressing || attachments.length >= 6}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors whitespace-nowrap min-h-[42px] disabled:opacity-50"
          >
            {compressing ? (
              <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
            ) : (
              <ImagePlus className="w-4 h-4 shrink-0" aria-hidden="true" />
            )}
            <span>{compressing ? it.compressingPhoto : it.addProofPhotoBtn}</span>
          </button>

          {attachments.length > 0 && (
            <button
              type="button"
              onClick={handleBundlePdf}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors whitespace-nowrap min-h-[42px]"
            >
              <FileDown className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{it.bundleEvidencePdfBtn}</span>
            </button>
          )}
        </div>
      </div>

      {/* Timestamp & GPS Evidence Watermark Option */}
      <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
        <input
          type="checkbox"
          checked={stampWatermark}
          onChange={(e) => setStampWatermark(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600 shrink-0 cursor-pointer"
        />
        <div className="min-w-0">
          <span className="text-xs font-semibold text-slate-800 inline-flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-700 shrink-0" aria-hidden="true" />
            {dx.watermarkToggleLabel}
          </span>
          <p className="mt-0.5 text-[11px] text-slate-500 leading-relaxed">{dx.watermarkHint}</p>
        </div>
      </label>

      {errorMsg && (
        <p role="alert" className="text-xs text-red-800 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {errorMsg}
        </p>
      )}

      {attachments.length === 0 ? (
        <p className="text-xs text-slate-500 bg-slate-50/70 border border-dashed border-slate-300 rounded-xl px-4 py-3.5">
          {it.noPhotosYet} <span className="text-slate-600">{it.portalLimitNote}</span>
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="border border-slate-200 rounded-xl overflow-hidden bg-white flex flex-col"
            >
              <img
                src={att.dataUrl}
                alt={att.name}
                className="w-full h-32 object-cover bg-slate-100"
              />
              <div className="p-3 flex-1 flex flex-col justify-between gap-2.5">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-900 truncate">{att.name}</p>
                  <p className="mt-0.5 text-[11px] font-mono tabular-nums text-emerald-700">
                    {att.originalSizeKb} KB → {att.compressedSizeKb} KB
                    {att.watermarked ? ` · ${dx.watermarkAppliedTag}` : ""}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => triggerDataUrlDownload(att.dataUrl, att.name)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:text-blue-900"
                  >
                    <Download className="w-3.5 h-3.5" aria-hidden="true" />
                    {it.downloadCompressedJpg}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(att.id)}
                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    {it.removePhotoBtn}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
