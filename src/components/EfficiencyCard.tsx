"use client";

import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format, startOfWeek, subWeeks } from "date-fns";
import { tr } from "date-fns/locale";
import { TrendingUp } from "lucide-react";
import type { StudyLog } from "@/lib/db";

// Hardcoded hex colors — CSS variables (oklch) don't resolve in SVG attributes
const C_LINE   = "#818cf8"; // indigo-400
const C_TICK   = "#64748b"; // slate-500
const C_TOOLTIP_BG = "#16182a";
const C_TOOLTIP_BORDER = "rgba(255,255,255,0.08)";

interface EfficiencyCardProps {
  logs: StudyLog[];
}

export default function EfficiencyCard({ logs }: EfficiencyCardProps) {
  const weeklyData = useMemo(() => {
    const now = new Date();
    const weeks: { label: string; start: string; end: string }[] = [];
    for (let i = 11; i >= 0; i--) {
      const ws = startOfWeek(subWeeks(now, i), { weekStartsOn: 1 });
      const we = new Date(ws);
      we.setDate(we.getDate() + 6);
      weeks.push({
        label: format(ws, "d MMM", { locale: tr }),
        start: format(ws, "yyyy-MM-dd"),
        end: format(we, "yyyy-MM-dd"),
      });
    }

    return weeks.map((w) => {
      const weekLogs = logs.filter((l) => l.date >= w.start && l.date <= w.end);
      const totalMins = weekLogs.reduce((s, l) => s + l.durationMinutes, 0);
      const totalQs = weekLogs.reduce((s, l) => s + l.questionCount, 0);
      const efficiency = totalMins > 0 ? Number((totalQs / totalMins).toFixed(2)) : null;
      return { week: w.label, efficiency, questions: totalQs, minutes: totalMins };
    });
  }, [logs]);

  const latestWithData = [...weeklyData].reverse().find((w) => w.efficiency !== null);
  const prevWithData = latestWithData
    ? [...weeklyData].slice(0, weeklyData.indexOf(latestWithData)).reverse().find((w) => w.efficiency !== null)
    : undefined;
  const latest = latestWithData ?? weeklyData[weeklyData.length - 1];
  const trend = latestWithData && prevWithData && prevWithData.efficiency! > 0
    ? ((latestWithData.efficiency! - prevWithData.efficiency!) / prevWithData.efficiency! * 100).toFixed(0)
    : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/10">
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium">Verimlilik (soru/dk)</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{latest?.efficiency ?? 0}</span>
            <span className="text-xs text-muted-foreground">bu hafta</span>
            {trend !== null && Number(trend) !== 0 && (
              <span className={`text-xs font-medium ${Number(trend) > 0 ? "text-green-500" : "text-red-400"}`}>
                {Number(trend) > 0 ? "↑" : "↓"} %{Math.abs(Number(trend))}
              </span>
            )}
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={weeklyData} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
          <XAxis dataKey="week" tick={{ fontSize: 10, fill: C_TICK }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: C_TICK }} width={35} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(value) => [`${value} soru/dk`, "Verimlilik"]}
            contentStyle={{ backgroundColor: C_TOOLTIP_BG, border: `1px solid ${C_TOOLTIP_BORDER}`, borderRadius: "8px", color: "#e2e8f0" }}
          />
          <Line
            type="monotone"
            dataKey="efficiency"
            stroke={C_LINE}
            strokeWidth={2}
            dot={{ r: 3, fill: C_LINE, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: C_LINE, strokeWidth: 0 }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
