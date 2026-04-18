"use client";

import React, { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUBJECTS, SUBJECT_COLORS } from "@/lib/subjects";
import type { StudyLog } from "@/lib/db";

interface TopicBreakdownChartProps {
  logs: StudyLog[];
}

export default React.memo(function TopicBreakdownChart({ logs }: TopicBreakdownChartProps) {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [metric, setMetric] = useState<"minutes" | "questions">("minutes");

  const availableSubjects = useMemo(() => {
    const ids = new Set(logs.map((l) => l.subject));
    return SUBJECTS.filter((s) => ids.has(s.id));
  }, [logs]);

  const data = useMemo(() => {
    if (!selectedSubject) return [];
    const map: Record<string, { minutes: number; questions: number }> = {};
    for (const log of logs) {
      if (log.subject !== selectedSubject) continue;
      if (!map[log.topic]) map[log.topic] = { minutes: 0, questions: 0 };
      map[log.topic].minutes += log.durationMinutes;
      map[log.topic].questions += log.questionCount;
    }
    return Object.entries(map)
      .map(([topic, vals]) => ({
        topic,
        value: metric === "minutes" ? vals.minutes : vals.questions,
      }))
      .sort((a, b) => b.value - a.value);
  }, [logs, selectedSubject, metric]);

  const color = SUBJECT_COLORS[selectedSubject] ?? "#6366f1";
  const maxValue = data.length > 0 ? Math.max(...data.map((d) => d.value)) : 0;

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Ders seçin…" />
          </SelectTrigger>
          <SelectContent>
            {availableSubjects.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                <span className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={metric} onValueChange={(v) => setMetric(v as "minutes" | "questions")}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="minutes">Dakika</SelectItem>
            <SelectItem value="questions">Soru</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!selectedSubject ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          Konu dağılımını görmek için bir ders seçin.
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          Bu derste kayıt bulunamadı.
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((item, i) => {
            const pct = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
            return (
              <div key={item.topic} className="group" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-foreground/90 font-medium truncate max-w-[60%]">
                    {item.topic}
                  </span>
                  <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                    {metric === "minutes" ? `${item.value} dk` : `${item.value} soru`}
                  </span>
                </div>
                <div className="relative h-7 rounded-lg bg-white/5 overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-lg transition-all duration-700 ease-out group-hover:brightness-125"
                    style={{
                      width: `${Math.max(pct, 2)}%`,
                      background: `linear-gradient(90deg, ${color}cc, ${color}ff)`,
                      boxShadow: `0 0 12px ${color}40`,
                    }}
                  />
                  <div
                    className="absolute inset-y-0 left-0 rounded-lg opacity-30"
                    style={{
                      width: `${Math.max(pct, 2)}%`,
                      background: `linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});
