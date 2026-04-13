"use client";

import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

// Hardcoded hex colors — CSS variables (oklch) don't resolve in SVG attributes
const C_TICK = "#64748b";
const C_TOOLTIP_BG = "#16182a";
const C_TOOLTIP_BORDER = "rgba(255,255,255,0.08)";
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

export default function TopicBreakdownChart({ logs }: TopicBreakdownChartProps) {
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
      .map(([topic, vals]) => ({ topic, value: metric === "minutes" ? vals.minutes : vals.questions }))
      .sort((a, b) => b.value - a.value);
  }, [logs, selectedSubject, metric]);

  const color = SUBJECT_COLORS[selectedSubject] ?? "#6366f1";

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
        <ResponsiveContainer width="100%" height={Math.max(200, data.length * 36)}>
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
            <XAxis type="number" tick={{ fontSize: 11, fill: C_TICK }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="topic" width={140} tick={{ fontSize: 11, fill: C_TICK }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={false}
              formatter={(value) => [
                metric === "minutes" ? `${value} dk` : `${value} soru`,
                metric === "minutes" ? "Süre" : "Soru",
              ]}
              contentStyle={{ backgroundColor: C_TOOLTIP_BG, border: `1px solid ${C_TOOLTIP_BORDER}`, borderRadius: "8px", color: "#e2e8f0" }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={24}>
              {data.map((_, i) => (
                <Cell key={i} fill={color} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
