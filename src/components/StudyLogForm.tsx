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
import type { StudyLog } from "@/lib/db";
import { format } from "date-fns";

interface StudyLogFormProps {
  initial?: Partial<StudyLog>;
  onSubmit: (data: Omit<StudyLog, "id" | "uid" | "createdAt">) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

export default function StudyLogForm({ initial, onSubmit, onCancel, loading }: StudyLogFormProps) {
  const [subject, setSubject] = useState(initial?.subject ?? "");
  const [topic, setTopic] = useState(initial?.topic ?? "");
  const [duration, setDuration] = useState(String(initial?.durationMinutes ?? ""));
  const [questions, setQuestions] = useState(String(initial?.questionCount ?? ""));
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [date, setDate] = useState(initial?.date ?? format(new Date(), "yyyy-MM-dd"));
  const [customTopic, setCustomTopic] = useState(false);

  const selectedSubject = SUBJECTS.find((s) => s.id === subject);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit({
      subject,
      topic: topic.trim(),
      durationMinutes: Number(duration) || 0,
      questionCount: Number(questions) || 0,
      notes: notes.trim() || undefined,
      date,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Date */}
      <div className="space-y-2">
        <Label htmlFor="date">Tarih</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={format(new Date(), "yyyy-MM-dd")}
          required
          className="w-auto"
        />
      </div>

      {/* Subject */}
      <div className="space-y-2">
        <Label>Ders</Label>
        <Select value={subject} onValueChange={(v) => { setSubject(v); setTopic(""); setCustomTopic(false); }} required>
          <SelectTrigger>
            <SelectValue placeholder="Ders seçin…" />
          </SelectTrigger>
          <SelectContent>
            <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">AYT Sayısal</div>
            {SUBJECTS.filter((s) => s.type === "sayisal").map((s) => (
              <SelectItem key={s.id} value={s.id}>
                <span className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.label}
                </span>
              </SelectItem>
            ))}
            <div className="px-2 py-1 mt-1 text-xs font-semibold text-muted-foreground">TYT</div>
            {SUBJECTS.filter((s) => s.type === "tyt").map((s) => (
              <SelectItem key={s.id} value={s.id}>
                <span className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Topic */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Konu</Label>
          {selectedSubject && (
            <button
              type="button"
              className="text-xs text-primary hover:underline"
              onClick={() => { setCustomTopic(!customTopic); setTopic(""); }}
            >
              {customTopic ? "Listeden seç" : "Elle yaz"}
            </button>
          )}
        </div>
        {!customTopic && selectedSubject ? (
          <Select value={topic} onValueChange={setTopic} required>
            <SelectTrigger>
              <SelectValue placeholder="Konu seçin…" />
            </SelectTrigger>
            <SelectContent>
              {selectedSubject.topics.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            placeholder="Konuyu yazın…"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
          />
        )}
      </div>

      {/* Duration + Questions */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Süre (dakika)</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            max="1440"
            placeholder="60"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="questions">Soru Sayısı</Label>
          <Input
            id="questions"
            type="number"
            min="0"
            max="10000"
            placeholder="0"
            value={questions}
            onChange={(e) => setQuestions(e.target.value)}
          />
        </div>
      </div>

      {/* Notes (optional) */}
      <div className="space-y-2">
        <Label htmlFor="notes">
          Notlar <span className="text-muted-foreground text-xs">(opsiyonel)</span>
        </Label>
        <Textarea
          id="notes"
          placeholder="Bu çalışmaya dair notlarını buraya yaz…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="submit" disabled={loading || !subject || !topic || !duration} className="flex-1">
          {loading ? "Kaydediliyor…" : initial?.subject ? "Güncelle" : "Kaydet"}
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
