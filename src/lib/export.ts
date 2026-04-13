import type { StudyLog } from "./db";
import { SUBJECT_MAP } from "./subjects";

export function logsToCSV(logs: StudyLog[]): void {
  const header = "Tarih,Ders,Konu,Süre (dk),Soru Sayısı,Etiketler,Notlar";
  const rows = logs.map((l) => {
    const subject = SUBJECT_MAP[l.subject]?.label ?? l.subject;
    const tags = l.tags?.join("; ") ?? "";
    const notes = (l.notes ?? "").replace(/"/g, '""');
    return `${l.date},"${subject}","${l.topic}",${l.durationMinutes},${l.questionCount},"${tags}","${notes}"`;
  });

  const csv = [header, ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, `studylogger-export-${new Date().toISOString().slice(0, 10)}.csv`);
}

export async function logsToPDF(logs: StudyLog[]): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF({ orientation: "landscape" });

  // Load Geist font for Turkish character support
  try {
    const fontResponse = await fetch("/fonts/Geist-Regular.ttf");
    if (!fontResponse.ok) throw new Error(`Font fetch failed: ${fontResponse.status}`);
    const fontBuffer = await fontResponse.arrayBuffer();
    const fontBase64 = arrayBufferToBase64(fontBuffer);
    doc.addFileToVFS("Geist-Regular.ttf", fontBase64);
    doc.addFont("Geist-Regular.ttf", "Geist", "normal");
    doc.setFont("Geist");
  } catch (err) {
    console.warn("Geist font could not be loaded; Turkish characters may not render correctly in PDF.", err);
  }

  doc.setFontSize(16);
  doc.text("StudyLogger — Çalışma Raporu", 14, 18);
  doc.setFontSize(9);
  doc.text(`Oluşturulma: ${new Date().toLocaleString("tr-TR")}  •  ${logs.length} kayıt`, 14, 25);

  const tableData = logs.map((l) => [
    l.date,
    SUBJECT_MAP[l.subject]?.label ?? l.subject,
    l.topic,
    String(l.durationMinutes),
    String(l.questionCount),
    l.tags?.join(", ") ?? "",
    (l.notes ?? "").slice(0, 60),
  ]);

  autoTable(doc, {
    startY: 30,
    head: [["Tarih", "Ders", "Konu", "Süre (dk)", "Soru", "Etiketler", "Notlar"]],
    body: tableData,
    styles: { fontSize: 8, cellPadding: 2, font: "Geist" },
    headStyles: { fillColor: [99, 102, 241] },
  });

  doc.save(`studylogger-export-${new Date().toISOString().slice(0, 10)}.pdf`);
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunks: string[] = [];
  const chunkSize = 8192;
  for (let i = 0; i < bytes.byteLength; i += chunkSize) {
    chunks.push(String.fromCharCode(...bytes.subarray(i, i + chunkSize)));
  }
  return btoa(chunks.join(""));
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
