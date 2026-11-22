import { jsPDF } from "jspdf";
import type { EvidenceAttachment } from "../types";

export interface OfficialLetterPdfOptions {
  subject: string;
  draftText: string;
  portalName?: string;
  referenceNumber?: string;
  attachments?: EvidenceAttachment[];
  filename?: string;
}

export async function compressImageForPortal(
  file: File,
  maxDimension = 1600,
  targetMaxKb = 850,
): Promise<EvidenceAttachment> {
  const originalSizeKb = Math.max(1, Math.round(file.size / 1024));

  const imgUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Could not decode image file."));
      el.src = imgUrl;
    });

    let width = img.naturalWidth || img.width;
    let height = img.naturalHeight || img.height;

    if (width > maxDimension || height > maxDimension) {
      const ratio = Math.min(maxDimension / width, maxDimension / height);
      width = Math.max(1, Math.round(width * ratio));
      height = Math.max(1, Math.round(height * ratio));
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Image compression is unavailable in this browser.");
    }
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    let quality = 0.84;
    let dataUrl = canvas.toDataURL("image/jpeg", quality);
    let compressedSizeKb = Math.round((dataUrl.length * 0.75) / 1024);

    // Step down JPEG quality until safely under Indian government portal upload limits (< 900 KB)
    while (compressedSizeKb > targetMaxKb && quality > 0.35) {
      quality = Number((quality - 0.1).toFixed(2));
      dataUrl = canvas.toDataURL("image/jpeg", quality);
      compressedSizeKb = Math.round((dataUrl.length * 0.75) / 1024);
    }

    const baseName = file.name.replace(/\.[^.]+$/, "") || "evidence-photo";
    return {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: `${baseName}-portal-ready.jpg`,
      dataUrl,
      originalSizeKb,
      compressedSizeKb: Math.max(1, compressedSizeKb),
      width,
      height,
    };
  } finally {
    URL.revokeObjectURL(imgUrl);
  }
}

export function triggerDataUrlDownload(dataUrl: string, filename: string): void {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function hasNonLatinCharacters(text: string): boolean {
  return /[^\u0000-\u024F\u2000-\u206F]/.test(text);
}

/**
 * Renders Unicode/Indic text to high-DPI formal A4 petition paper pages when non-Latin scripts
 * are present so Tamil/Hindi/Telugu/etc. render crisp in jsPDF without garbled glyphs.
 */
function renderUnicodePaperToPdf(
  doc: jsPDF,
  title: string,
  subject: string,
  bodyText: string,
  dateStr: string,
  portalName?: string,
  referenceNumber?: string,
): void {
  const pageWidthPx = 1240; // ~150 DPI A4 width
  const pageHeightPx = 1754; // ~150 DPI A4 height
  const borderPad = 54;
  const marginX = 96;
  const marginTop = 104;
  const maxTextWidth = pageWidthPx - marginX * 2;
  const lineHeight = 36;

  const canvas = document.createElement("canvas");
  canvas.width = pageWidthPx;
  canvas.height = pageHeightPx;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const fontFamily =
    '"DM Sans", "Noto Sans", "Noto Sans Tamil", "Noto Sans Devanagari", system-ui, sans-serif';

  const wrapParagraph = (text: string, font: string): string[] => {
    ctx.font = font;
    if (!text.trim()) return [""];
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let current = "";
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (ctx.measureText(candidate).width <= maxTextWidth) {
        current = candidate;
      } else {
        if (current) lines.push(current);
        current = word;
      }
    }
    if (current) lines.push(current);
    return lines;
  };

  const allLines: Array<{
    text: string;
    font: string;
    color: string;
    align?: "left" | "center" | "right";
    gapAfter?: number;
    ruleAfter?: boolean;
  }> = [];

  allLines.push({
    text: title,
    font: `700 30px ${fontFamily}`,
    color: "#0f172a",
    align: "center",
    gapAfter: 10,
  });

  const subMeta = [portalName, referenceNumber ? `Ref: ${referenceNumber}` : ""]
    .filter(Boolean)
    .join("  |  ");
  if (subMeta) {
    allLines.push({
      text: subMeta,
      font: `500 20px ${fontFamily}`,
      color: "#475569",
      align: "center",
      gapAfter: 16,
      ruleAfter: true,
    });
  } else {
    allLines.push({ text: "", font: `400 10px ${fontFamily}`, color: "#0f172a", ruleAfter: true, gapAfter: 14 });
  }

  allLines.push({
    text: `Date: ${dateStr}`,
    font: `500 21px ${fontFamily}`,
    color: "#334155",
    align: "right",
    gapAfter: 14,
  });

  if (subject.trim()) {
    for (const line of wrapParagraph(`Subject: ${subject.trim()}`, `700 24px ${fontFamily}`)) {
      allLines.push({ text: line, font: `700 24px ${fontFamily}`, color: "#0f172a" });
    }
    allLines.push({ text: "", font: `400 16px ${fontFamily}`, color: "#0f172a", gapAfter: 8 });
  }

  for (const para of bodyText.split("\n")) {
    for (const line of wrapParagraph(para, `400 23px ${fontFamily}`)) {
      allLines.push({ text: line, font: `400 23px ${fontFamily}`, color: "#1e293b" });
    }
  }

  let pageIndex = 0;
  let y = marginTop;

  const startPage = () => {
    if (pageIndex > 0) doc.addPage();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, pageWidthPx, pageHeightPx);

    // Classic formal A4 paper border frame
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      borderPad,
      borderPad,
      pageWidthPx - borderPad * 2,
      pageHeightPx - borderPad * 2,
    );
    y = marginTop;
  };

  const flushPage = () => {
    ctx.font = `400 18px ${fontFamily}`;
    ctx.fillStyle = "#64748b";
    ctx.textAlign = "right";
    ctx.fillText(`Page ${pageIndex + 1}`, pageWidthPx - marginX, pageHeightPx - borderPad - 22);
    ctx.textAlign = "left";

    const imgData = canvas.toDataURL("image/jpeg", 0.93);
    doc.addImage(imgData, "JPEG", 0, 0, 210, 297);
    pageIndex += 1;
  };

  startPage();
  for (const entry of allLines) {
    if (y > pageHeightPx - 125) {
      flushPage();
      startPage();
    }
    if (entry.text) {
      ctx.font = entry.font;
      ctx.fillStyle = entry.color;
      ctx.textAlign = entry.align ?? "left";
      const x =
        entry.align === "center"
          ? pageWidthPx / 2
          : entry.align === "right"
            ? pageWidthPx - marginX
            : marginX;
      ctx.fillText(entry.text, x, y);
      ctx.textAlign = "left";
    }
    if (entry.ruleAfter) {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(marginX, y + 12, maxTextWidth, 2);
      ctx.fillStyle = "#94a3b8";
      ctx.fillRect(marginX, y + 17, maxTextWidth, 1);
    }
    y += lineHeight + (entry.gapAfter ?? 0);
  }
  flushPage();
}

/**
 * Builds an authentic formal A4 complaint petition PDF document ready to download or share.
 */
export function buildOfficialLetterPdfDoc(options: OfficialLetterPdfOptions): jsPDF {
  const {
    subject,
    draftText,
    portalName,
    referenceNumber,
    attachments = [],
  } = options;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const combinedText = `${subject}\n${draftText}`;
  if (hasNonLatinCharacters(combinedText)) {
    renderUnicodePaperToPdf(
      doc,
      "FORMAL PUBLIC GRIEVANCE / APPLICATION",
      subject,
      draftText,
      dateStr,
      portalName,
      referenceNumber,
    );
  } else {
    const pageW = 210;
    const pageH = 297;
    const framePad = 10;
    const marginX = 20;
    const maxWidth = pageW - marginX * 2;
    let y = 24;
    let pageNum = 1;

    const drawPaperChrome = () => {
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.35);
      doc.rect(framePad, framePad, pageW - framePad * 2, pageH - framePad * 2);

      doc.setFont("times", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`Page ${pageNum}`, pageW - marginX, pageH - framePad - 4, { align: "right" });
    };

    drawPaperChrome();

    // Formal Centered Petition Header
    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("FORMAL PUBLIC GRIEVANCE / APPLICATION", pageW / 2, y, { align: "center" });
    y += 5.5;

    const subHeader = [portalName, referenceNumber ? `Ref: ${referenceNumber}` : ""]
      .filter(Boolean)
      .join("  |  ");
    if (subHeader) {
      doc.setFont("times", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(71, 85, 105);
      const subLines = doc.splitTextToSize(subHeader, maxWidth) as string[];
      doc.text(subLines, pageW / 2, y, { align: "center" });
      y += subLines.length * 4.5 + 1.5;
    }

    // Classic double paper rule
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.6);
    doc.line(marginX, y, pageW - marginX, y);
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.25);
    doc.line(marginX, y + 1.2, pageW - marginX, y + 1.2);
    y += 8;

    // Right-aligned formal Date (only if draft doesn't already start with Date:)
    if (!/^date\s*:/im.test(draftText.trim().slice(0, 40))) {
      doc.setFont("times", "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(30, 41, 59);
      doc.text(`Date: ${dateStr}`, pageW - marginX, y, { align: "right" });
      y += 7;
    }

    // Bold Subject line (only if draft doesn't already contain Subject:)
    if (subject.trim() && !/^subject\s*:/im.test(draftText)) {
      doc.setFont("times", "bold");
      doc.setFontSize(11.5);
      doc.setTextColor(15, 23, 42);
      const subjectLines = doc.splitTextToSize(`Subject: ${subject.trim()}`, maxWidth) as string[];
      doc.text(subjectLines, marginX, y);
      y += subjectLines.length * 5.6 + 4;
    }

    // Formal Letter Body in classic serif petition typography
    doc.setFont("times", "normal");
    doc.setFontSize(11.5);
    doc.setTextColor(15, 23, 42);
    const paragraphs = draftText.split("\n");
    for (const para of paragraphs) {
      if (!para.trim()) {
        y += 4.2;
        continue;
      }
      const isHeadingLine = /^(subject|to|from|date|yours\s+faithfully|yours\s+sincerely|respected\s+sir)/i.test(
        para.trim(),
      );
      doc.setFont("times", isHeadingLine ? "bold" : "normal");
      const wrapped = doc.splitTextToSize(para, maxWidth) as string[];
      for (const line of wrapped) {
        if (y > 274) {
          doc.addPage();
          pageNum += 1;
          drawPaperChrome();
          y = 22;
        }
        doc.text(line, marginX, y);
        y += 5.8;
      }
    }
  }

  // Append compressed proof photos as formal Annexure pages
  attachments.forEach((att, index) => {
    doc.addPage();
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.35);
    doc.rect(10, 10, 190, 277);

    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(`Annexure ${index + 1}: Supporting Photo Evidence`, 20, 22);

    doc.setFont("times", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`${att.name} (${att.compressedSizeKb} KB)`, 20, 28);

    const maxW = 170;
    const maxH = 230;
    const ratio = Math.min(maxW / att.width, maxH / att.height);
    const drawW = Math.max(20, att.width * ratio);
    const drawH = Math.max(20, att.height * ratio);
    const xPos = 20 + (maxW - drawW) / 2;
    doc.addImage(att.dataUrl, "JPEG", xPos, 35, drawW, drawH);
  });

  return doc;
}

export function downloadOfficialLetterPdf(options: OfficialLetterPdfOptions): void {
  const filename = options.filename ?? "makkalvoice-official-letter.pdf";
  const doc = buildOfficialLetterPdfDoc(options);
  doc.save(filename);
}

/**
 * Generates the formal A4 Paper Complaint Letter as a PDF File and shares it directly
 * via the device's native Share sheet (WhatsApp, Gmail, Drive, etc.), falling back
 * to downloading the formal PDF file when file sharing isn't supported on desktop.
 */
export async function shareOfficialLetterPdf(
  options: OfficialLetterPdfOptions,
): Promise<"shared" | "downloaded" | "cancelled"> {
  const filename = options.filename ?? "official-complaint-letter.pdf";
  const doc = buildOfficialLetterPdfDoc(options);
  const pdfBlob = doc.output("blob");
  const pdfFile = new File([pdfBlob], filename, { type: "application/pdf" });

  const shareData: ShareData = {
    title: options.subject.trim() || "Official Complaint Letter",
    text: options.subject.trim() || "Official Complaint Letter (Formal A4 PDF)",
    files: [pdfFile],
  };

  if (
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function" &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [pdfFile] })
  ) {
    try {
      await navigator.share(shareData);
      return "shared";
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return "cancelled";
      }
      // Fallback to direct PDF download if share sheet failed
    }
  }

  doc.save(filename);
  return "downloaded";
}
