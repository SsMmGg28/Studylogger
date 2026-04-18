"use client";

import React, { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector,
} from "recharts";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";
import { SUBJECT_MAP, SUBJECT_COLORS } from "@/lib/subjects";

interface SubjectChartProps {
  data: Record<string, { minutes: number; questions: number }>;
  metric?: "minutes" | "questions";
}

function fmtMins(v: number) {
  const h = Math.floor(v / 60);
  const m = v % 60;
  return h > 0 ? `${h}s ${m}dk` : `${m}dk`;
}

function ActiveShape(props: PieSectorDataItem & { totalLabel: string }) {
  const {
    cx = 0, cy = 0,
    innerRadius = 0, outerRadius = 0,
    startAngle, endAngle,
    fill,
    totalLabel,
  } = props;
  return (
    <g>
      {/* center label */}
      <text x={cx} y={cy - 8} textAnchor="middle" fill="#e2e8f0" fontSize={13} fontWeight={600}>
        {totalLabel}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#64748b" fontSize={10}>
        toplam
      </text>
      <Sector
        cx={cx} cy={cy}
        innerRadius={Number(innerRadius) - 2}
        outerRadius={Number(outerRadius) + 5}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
}

function DefaultCenter({ cx, cy, label }: { cx: number; cy: number; label: string }) {
  return (
    <g>
      <text x={cx} y={cy - 8} textAnchor="middle" fill="#e2e8f0" fontSize={13} fontWeight={600}>
        {label}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#64748b" fontSize={10}>
        toplam
      </text>
    </g>
  );
}

export default React.memo(function SubjectChart({ data, metric = "minutes" }: SubjectChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const chartData = useMemo(() =>
    Object.entries(data)
      .map(([id, vals]) => ({
        name: SUBJECT_MAP[id]?.label ?? id,
        value: metric === "minutes" ? vals.minutes : vals.questions,
        color: SUBJECT_COLORS[id] ?? "#6366f1",
      }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value),
  [data, metric]);

  const total = chartData.reduce((s, d) => s + d.value, 0);
  const totalLabel = metric === "minutes" ? fmtMins(total) : `${total} soru`;

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
        Henüz kayıt yok
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Donut */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={88}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              {...({ activeIndex, activeShape: (props: PieSectorDataItem) => (
                <ActiveShape {...props} totalLabel={totalLabel} />
              ) } as any)}
              onMouseEnter={(_: unknown, index: number) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(undefined)}
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={600}
            >
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.color}
                  opacity={activeIndex === undefined || activeIndex === i ? 1 : 0.45}
                />
              ))}
            </Pie>
            {activeIndex === undefined && (
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
              />
            )}
            {/* Static center when no hover */}
            {activeIndex === undefined &&
              (() => {
                // We render a fake Sector to place center text
                return null;
              })()}
            <Tooltip
              formatter={(value) => [
                metric === "minutes" ? fmtMins(Number(value)) : `${value} soru`,
                "",
              ]}
              contentStyle={{
                backgroundColor: "#1a1c2a",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                color: "#e2e8f0",
                fontSize: "12px",
                padding: "8px 12px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              }}
              itemStyle={{ color: "#e2e8f0" }}
              labelStyle={{ color: "#94a3b8", fontWeight: 600 }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Static center label overlay */}
        {activeIndex === undefined && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">{totalLabel}</p>
              <p className="text-[10px] text-muted-foreground">toplam</p>
            </div>
          </div>
        )}
      </div>

      {/* Custom legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 px-1">
        {chartData.map((entry) => {
          const pct = total > 0 ? Math.round((entry.value / total) * 100) : 0;
          return (
            <div key={entry.name} className="flex items-center gap-2 min-w-0">
              <span
                className="shrink-0 w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-[11px] text-muted-foreground truncate flex-1">{entry.name}</span>
              <span className="text-[11px] font-medium tabular-nums shrink-0">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
});
