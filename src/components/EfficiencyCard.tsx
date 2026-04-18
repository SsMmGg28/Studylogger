"use client";

import React, { useMemo } from "react";
import { format, startOfWeek, subWeeks } from "date-fns";
import { tr } from "date-fns/locale";
import { TrendingUp } from "lucide-react";
import type { StudyLog } from "@/lib/db";

interface EfficiencyCardProps {
  logs: StudyLog[];
}

export default React.memo(function EfficiencyCard({ logs }: EfficiencyCardProps) {
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

  // Find max efficiency for scaling
  const maxEff = Math.max(...weeklyData.map((w) => w.efficiency ?? 0), 0.01);
  const chartHeight = 160;

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

      {/* Pure CSS Line Chart */}
      <div className="relative" style={{ height: chartHeight + 32 }}>
        {/* Y-axis grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
          <div
            key={pct}
            className="absolute left-8 right-0 border-t border-white/5"
            style={{ top: chartHeight * (1 - pct) }}
          >
            <span className="absolute -left-8 -top-2.5 text-[10px] text-muted-foreground tabular-nums w-7 text-right">
              {(maxEff * pct).toFixed(1)}
            </span>
          </div>
        ))}

        {/* Data points and connecting lines */}
        <svg
          className="absolute left-8 top-0"
          style={{ width: "calc(100% - 2rem)", height: chartHeight }}
          viewBox={`0 0 ${(weeklyData.length - 1) * 100} ${chartHeight}`}
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Gradient area fill */}
          <defs>
            <linearGradient id="effGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Area */}
          {(() => {
            const points = weeklyData.map((w, i) => ({
              x: i * 100,
              y: w.efficiency !== null ? chartHeight - (w.efficiency / maxEff) * chartHeight : null,
            }));
            const validPoints = points.filter((p) => p.y !== null) as { x: number; y: number }[];
            if (validPoints.length < 2) return null;
            const pathD = validPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
            const areaD = `${pathD} L ${validPoints[validPoints.length - 1].x} ${chartHeight} L ${validPoints[0].x} ${chartHeight} Z`;
            return (
              <>
                <path d={areaD} fill="url(#effGradient)" />
                <path d={pathD} stroke="#818cf8" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </>
            );
          })()}
          {/* Dots */}
          {weeklyData.map((w, i) =>
            w.efficiency !== null ? (
              <circle
                key={i}
                cx={i * 100}
                cy={chartHeight - (w.efficiency / maxEff) * chartHeight}
                r="4"
                fill="#818cf8"
                stroke="#16182a"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            ) : null
          )}
        </svg>

        {/* X-axis labels */}
        <div className="absolute left-8 right-0 flex justify-between" style={{ top: chartHeight + 6 }}>
          {weeklyData.map((w, i) => (
            <span key={i} className="text-[10px] text-muted-foreground text-center" style={{ width: 0, overflow: "visible" }}>
              {i % 2 === 0 ? w.week : ""}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});
