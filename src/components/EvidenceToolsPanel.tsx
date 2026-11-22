import { useRef, useState } from "react";
import { Download, FileDown, ImagePlus, Loader2, Trash2 } from "lucide-react";
import type { InnovationStrings } from "../data/innovationTranslations";
import type { EvidenceAttachment } from "../types";
import {
  compressImageForPortal,
  downloadOfficialLetterPdf,
  triggerDataUrlDownload,
} from "../utils/mediaTools";

interface EvidenceToolsPanelProps {
  it: InnovationStrings;
  attachments: EvidenceAttachment[];
  onAttachmentsChange: (next: EvidenceAttachment[]) => void;
  subject: string;
  draftText: string;
  portalName?: string;
  referenceNumber?: string;
}

export function EvidenceToolsPanel({
  it,
  attachments,
  onAttachmentsChange,
  subject,
  draftText,
  portalName,
  referenceNumber,
}: EvidenceToolsPanelProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setCompressing(true);
    setErrorMsg(null);
    try {
      const added: EvidenceAttachment[] = [];
      const limit = Math.min(files.length, Math.max(0, 6 - attachments.length));
      for (let i = 0; i < limit; i += 1) {
        const file = files[i];
        if (!file.type.startsWith("image/")) continue;
        const compressed = await compressImageForPortal(file);
        added.push(compressed);
      }
      if (added.length > 0) {
        onAttachmentsChange([...attachments, ...added]);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Could not compress image.");
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
      filename: "makkalvoice-letter-with-evidence.pdf",
    });
  };

  return (
    <div className="mt-6 pb-6 border-b border-slate-200 space-y-4">
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
