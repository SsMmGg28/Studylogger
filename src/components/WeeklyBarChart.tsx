"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { format, startOfWeek, addDays } from "date-fns";
import React, { useMemo } from "react";
import type { StudyLog } from "@/lib/db";

interface WeeklyBarChartProps {
  logs: StudyLog[];
}

// Hardcoded hex colors — CSS variables don't resolve as SVG fill attributes in Recharts
const COLOR_TODAY   = "#c084fc"; // vivid purple (today accent)
const COLOR_STUDIED = "#818cf8"; // indigo-400 (days with study)
const COLOR_EMPTY   = "#1e2235"; // near-black (no activity)
const COLOR_GRID    = "#2a2d45";
const COLOR_TICK    = "#64748b";

const DAY_LABELS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

function fmtMins(m: number) {
  if (m === 0) return "0dk";
  const h = Math.floor(m / 60);
  const min = m % 60;
  return h > 0 ? `${h}s ${min}dk` : `${min}dk`;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ payload: { totalMins: number; totalQs: number } }>; label?: string }) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload as { totalMins: number; totalQs: number };
  return (
    <div
      style={{
        backgroundColor: "#16182a",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "10px",
        padding: "8px 12px",
        fontSize: "12px",
        color: "#e2e8f0",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      }}
    >
      <p style={{ color: "#94a3b8", fontWeight: 600, marginBottom: 2 }}>{label}</p>
      <p>
        {fmtMins(item.totalMins)}
        {item.totalQs > 0 && (
          <span style={{ color: "#94a3b8" }}> · {item.totalQs} soru</span>
        )}
      </p>
    </div>
  );
}

export default React.memo(function WeeklyBarChart({ logs }: WeeklyBarChartProps) {
  const data = useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    return DAY_LABELS.map((label, i) => {
      const day = addDays(weekStart, i);
      const dateStr = format(day, "yyyy-MM-dd");
      const dayLogs = logs.filter((l) => l.date === dateStr);
      const totalMins = dayLogs.reduce((s, l) => s + l.durationMinutes, 0);
      const totalQs   = dayLogs.reduce((s, l) => s + l.questionCount, 0);
      const isToday   = dateStr === format(new Date(), "yyyy-MM-dd");
      return { label, totalMins, totalQs, isToday };
    });
  }, [logs]);

  return (
    <ResponsiveContainer width="100%" height={170}>
      <BarChart
        data={data}
        margin={{ top: 4, right: 4, bottom: 0, left: -28 }}
        barSize={24}
        barCategoryGap="28%"
      >
        <CartesianGrid vertical={false} stroke={COLOR_GRID} strokeOpacity={0.6} />
        <XAxis
          dataKey="label"
          tick={{ fill: COLOR_TICK, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: COLOR_TICK, fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => (v === 0 ? "" : `${Math.floor(v / 60)}s`)}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "rgba(255,255,255,0.04)", radius: 4 }}
        />
        <Bar dataKey="totalMins" radius={[5, 5, 2, 2]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.isToday ? COLOR_TODAY : entry.totalMins > 0 ? COLOR_STUDIED : COLOR_EMPTY}
              fillOpacity={entry.totalMins === 0 && !entry.isToday ? 0.5 : 1}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
});
