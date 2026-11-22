import { jsPDF } from "jspdf";
import type { EvidenceAttachment } from "../types";

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
 * Renders Unicode/Indic text to high-DPI canvas page images when non-Latin scripts
 * are present so Tamil/Hindi/Telugu/etc. render crisp in jsPDF without garbled glyphs.
 */
function renderUnicodeTextToPdf(
  doc: jsPDF,
  title: string,
  subject: string,
  bodyText: string,
  metaLine: string,
): void {
  const pageWidthPx = 1240; // ~150 DPI A4 width
  const pageHeightPx = 1754; // ~150 DPI A4 height
  const marginX = 95;
  const marginTop = 95;
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

  const allLines: Array<{ text: string; font: string; color: string; gapAfter?: number }> = [];
  allLines.push({ text: title, font: `700 32px ${fontFamily}`, color: "#0f172a", gapAfter: 8 });
  allLines.push({ text: metaLine, font: `500 20px ${fontFamily}`, color: "#475569", gapAfter: 24 });
  if (subject.trim()) {
    for (const line of wrapParagraph(`Subject: ${subject.trim()}`, `700 24px ${fontFamily}`)) {
      allLines.push({ text: line, font: `700 24px ${fontFamily}`, color: "#0f172a" });
    }
    allLines.push({ text: "", font: `400 22px ${fontFamily}`, color: "#0f172a", gapAfter: 12 });
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
    // Subtle top rule
    ctx.fillStyle = "#1d4ed8";
    ctx.fillRect(marginX, 58, maxTextWidth, 4);
    y = marginTop;
  };

  const flushPage = () => {
    const imgData = canvas.toDataURL("image/jpeg", 0.92);
    doc.addImage(imgData, "JPEG", 0, 0, 210, 297);
    pageIndex += 1;
  };

  startPage();
  for (const entry of allLines) {
    if (y > pageHeightPx - 110) {
      flushPage();
      startPage();
    }
    if (entry.text) {
      ctx.font = entry.font;
      ctx.fillStyle = entry.color;
      ctx.fillText(entry.text, marginX, y);
    }
    y += lineHeight + (entry.gapAfter ?? 0);
  }
  flushPage();
}

export function downloadOfficialLetterPdf(options: {
  subject: string;
  draftText: string;
  portalName?: string;
  referenceNumber?: string;
  attachments?: EvidenceAttachment[];
  filename?: string;
}): void {
  const {
    subject,
    draftText,
    portalName,
    referenceNumber,
    attachments = [],
    filename = "makkalvoice-official-letter.pdf",
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
  const metaParts = [`Prepared via MakkalVoice`, dateStr];
  if (portalName) metaParts.push(portalName);
  if (referenceNumber) metaParts.push(`Ref: ${referenceNumber}`);
  const metaLine = metaParts.join("  |  ");

  const combinedText = `${subject}\n${draftText}`;
  if (hasNonLatinCharacters(combinedText)) {
    renderUnicodeTextToPdf(doc, "OFFICIAL CITIZEN PETITION", subject, draftText, metaLine);
  } else {
    const marginX = 18;
    const maxWidth = 174;
    let y = 20;

    // Top accent bar
    doc.setDrawColor(29, 78, 216);
    doc.setLineWidth(0.9);
    doc.line(marginX, 13, marginX + maxWidth, 13);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text("OFFICIAL PUBLIC GRIEVANCE / PETITION", marginX, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    const metaLines = doc.splitTextToSize(metaLine, maxWidth) as string[];
    doc.text(metaLines, marginX, y);
    y += metaLines.length * 4.5 + 4;

    if (subject.trim()) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      const subjectLines = doc.splitTextToSize(`Subject: ${subject.trim()}`, maxWidth) as string[];
      doc.text(subjectLines, marginX, y);
      y += subjectLines.length * 5.5 + 4;
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(30, 41, 59);
    const paragraphs = draftText.split("\n");
    for (const para of paragraphs) {
      if (!para.trim()) {
        y += 4;
        continue;
      }
      const wrapped = doc.splitTextToSize(para, maxWidth) as string[];
      for (const line of wrapped) {
        if (y > 276) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, marginX, y);
        y += 5.4;
      }
    }
  }

  // Append compressed proof photos as Annexure pages
  attachments.forEach((att, index) => {
    doc.addPage();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(`Annexure ${index + 1}: Supporting Photo Evidence`, 18, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`${att.name} (${att.compressedSizeKb} KB)`, 18, 26);

    const maxW = 174;
    const maxH = 235;
    const ratio = Math.min(maxW / att.width, maxH / att.height);
    const drawW = Math.max(20, att.width * ratio);
    const drawH = Math.max(20, att.height * ratio);
    const xPos = 18 + (maxW - drawW) / 2;
    doc.addImage(att.dataUrl, "JPEG", xPos, 34, drawW, drawH);
  });

  doc.save(filename);
}
