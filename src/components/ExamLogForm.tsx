"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUBJECTS } from "@/lib/subjects";
import type { ExamLog } from "@/lib/db";
import { format } from "date-fns";

// TYT subjects that appear in a full exam
const TYT_EXAM_SUBJECTS = [
  "turkce",
  "tyt_matematik",
  "tyt_geometri",
  "tyt_fizik",
  "tyt_kimya",
  "tyt_biyoloji",
  "tarih",
  "cografya",
  "felsefe",
  "din",
];

// AYT Sayısal subjects that appear in a full exam
const AYT_EXAM_SUBJECTS = [
  "ayt_matematik",
  "ayt_geometri",
  "ayt_fizik",
  "ayt_kimya",
  "ayt_biyoloji",
];

interface ExamLogFormProps {
  onSubmit: (data: Omit<ExamLog, "id" | "uid" | "createdAt">) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

export default function ExamLogForm({ onSubmit, onCancel, loading }: ExamLogFormProps) {
  const [examType, setExamType] = useState<"tyt" | "ayt" | "">("");
  const [examCategory, setExamCategory] = useState<"tam" | "brans" | "">("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [notes, setNotes] = useState("");

  // Tam deneme fields
  const [subjectNets, setSubjectNets] = useState<Record<string, string>>({});
  const [totalNet, setTotalNet] = useState("");

  // Branş denemesi fields
  const [bransSubject, setBransSubject] = useState("");
  const [bransNet, setBransNet] = useState("");
  const [bransDuration, setBransDuration] = useState("");

  function handleExamTypeChange(val: "tyt" | "ayt") {
    setExamType(val);
    setExamCategory("");
    setSubjectNets({});
    setTotalNet("");
    setBransSubject("");
    setBransNet("");
    setBransDuration("");
  }

  function getExamSubjects() {
    const ids = examType === "tyt" ? TYT_EXAM_SUBJECTS : AYT_EXAM_SUBJECTS;
    return ids.map((id) => SUBJECTS.find((s) => s.id === id)).filter(Boolean) as typeof SUBJECTS;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!examType || !examCategory) return;

    if (examCategory === "tam") {
      const nets: Record<string, number> = {};
      for (const [id, val] of Object.entries(subjectNets)) {
        nets[id] = parseFloat(val) || 0;
      }
      await onSubmit({
        examType,
        examCategory,
        date,
        subjectNets: nets,
        totalNet: parseFloat(totalNet) || 0,
        notes: notes.trim() || undefined,
      });
    } else {
      await onSubmit({
        examType,
        examCategory,
        date,
        subject: bransSubject,
        net: parseFloat(bransNet) || 0,
        durationMinutes: Number(bransDuration) || undefined,
        notes: notes.trim() || undefined,
      });
    }
  }

  const isSubmitDisabled =
    loading ||
    !examType ||
    !examCategory ||
    (examCategory === "brans" && (!bransSubject || !bransNet));

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Date */}
      <div className="space-y-2">
        <Label htmlFor="exam-date">Tarih</Label>
        <Input
          id="exam-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={format(new Date(), "yyyy-MM-dd")}
          required
          className="w-auto"
        />
      </div>

      {/* Exam Type: TYT / AYT */}
      <div className="space-y-2">
        <Label>Sınav Türü</Label>
        <div className="flex gap-3">
          {(["tyt", "ayt"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleExamTypeChange(t)}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
                examType === t
                  ? "bg-primary/15 border-primary text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Exam Category: Tam / Branş */}
      {examType && (
        <div className="space-y-2">
          <Label>Deneme Türü</Label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setExamCategory("tam")}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
                examCategory === "tam"
                  ? "bg-primary/15 border-primary text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              Tam Deneme
            </button>
            <button
              type="button"
              onClick={() => setExamCategory("brans")}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
                examCategory === "brans"
                  ? "bg-primary/15 border-primary text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              Branş Denemesi
            </button>
          </div>
        </div>
      )}

      {/* Tam Deneme: Per-subject nets */}
      {examCategory === "tam" && (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">Ders bazlı netleri girin (boş bırakılabilir)</p>
          <div className="grid grid-cols-2 gap-3">
            {getExamSubjects().map((s) => (
              <div key={s.id} className="space-y-1">
                <Label className="text-xs flex items-center gap-1.5">
                  <span
                    className="inline-block w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  {s.label}
                </Label>
                <Input
                  type="number"
                  step="0.25"
                  min="-999"
                  max="999"
                  placeholder="0"
                  value={subjectNets[s.id] ?? ""}
                  onChange={(e) =>
                    setSubjectNets((prev) => ({ ...prev, [s.id]: e.target.value }))
                  }
                  className="h-8 text-sm"
                />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalNet" className="font-semibold">Toplam Net</Label>
            <Input
              id="totalNet"
              type="number"
              step="0.25"
              min="-999"
              max="999"
              placeholder="0"
              value={totalNet}
              onChange={(e) => setTotalNet(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Branş Denemesi fields */}
      {examCategory === "brans" && examType && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Ders</Label>
            <Select value={bransSubject} onValueChange={setBransSubject} required>
              <SelectTrigger>
                <SelectValue placeholder="Ders seçin…" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.filter((s) => s.type === examType).map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    <span className="flex items-center gap-2">
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ backgroundColor: s.color }}
                      />
                      {s.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bransNet">Net</Label>
              <Input
                id="bransNet"
                type="number"
                step="0.25"
                min="-999"
                max="999"
                placeholder="0"
                value={bransNet}
                onChange={(e) => setBransNet(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bransDuration">Süre (dakika)</Label>
              <Input
                id="bransDuration"
                type="number"
                min="1"
                max="600"
                placeholder="90"
                value={bransDuration}
                onChange={(e) => setBransDuration(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Notes (optional) */}
      {(examCategory === "tam" || examCategory === "brans") && (
        <div className="space-y-2">
          <Label htmlFor="exam-notes">
            Notlar <span className="text-muted-foreground text-xs">(opsiyonel)</span>
          </Label>
          <Textarea
            id="exam-notes"
            placeholder="Denemeye dair notlarını buraya yaz…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitDisabled} className="flex-1">
          {loading ? "Kaydediliyor…" : "Kaydet"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            İptal
          </Button>
        )}
      </div>
    </form>
  );
}
