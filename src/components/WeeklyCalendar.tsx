"use client";

import { useMemo } from "react";
import { format, subDays } from "date-fns";
import type { StudyLog } from "@/lib/db";

interface WeeklyCalendarProps {
  logs: StudyLog[];
  weeks?: number;
}

// GitHub-style green heatmap — distinct colors at each level
const INTENSITY_COLORS = [
  { bg: "#1a1c2a", label: "0dk"    }, // 0 min — empty
  { bg: "#14532d", label: "<30dk"  }, // 1-29 min — dark green
  { bg: "#166534", label: "<1s"    }, // 30-59 min — medium green
  { bg: "#22c55e", label: "<2s"    }, // 60-119 min — bright green
  { bg: "#4ade80", label: "2s+"    }, // 120+ min — vivid light green
] as const;

function getIntensityColor(minutes: number): string {
  if (minutes === 0) return INTENSITY_COLORS[0].bg;
  if (minutes < 30)  return INTENSITY_COLORS[1].bg;
  if (minutes < 60)  return INTENSITY_COLORS[2].bg;
  if (minutes < 120) return INTENSITY_COLORS[3].bg;
  return INTENSITY_COLORS[4].bg;
}

function fmtTooltip(dateStr: string, minutes: number): string {
  if (minutes === 0) return `${dateStr}: çalışma yok`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const dur = h > 0 ? `${h}s ${m}dk` : `${m}dk`;
  return `${dateStr}: ${dur}`;
}

const DAY_LABELS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

export default function WeeklyCalendar({ logs, weeks = 15 }: WeeklyCalendarProps) {
  const today = new Date();

  const dayMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const log of logs) {
      map[log.date] = (map[log.date] ?? 0) + log.durationMinutes;
    }
    return map;
  }, [logs]);

  // Build flat array oldest→newest (weeks*7 days)
  const days = useMemo(() => {
    const arr: Array<{ date: string; minutes: number; isToday: boolean }> = [];
    for (let i = weeks * 7 - 1; i >= 0; i--) {
      const d = subDays(today, i);
      const dateStr = format(d, "yyyy-MM-dd");
      arr.push({
        date: dateStr,
        minutes: dayMap[dateStr] ?? 0,
        isToday: i === 0,
      });
    }
    return arr;
  }, [dayMap, weeks]);

  // Arrange into columns (each column = one week, Mon-Sun)
  const columns: typeof days[number][][] = [];
  for (let c = 0; c < weeks; c++) {
    columns.push(days.slice(c * 7, c * 7 + 7));
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1 min-w-max">
        {/* Day labels */}
        <div className="flex flex-col gap-1 mr-1">
          {DAY_LABELS.map((d) => (
            <div key={d} className="w-7 h-4 text-[10px] text-muted-foreground flex items-center">
              {d}
            </div>
          ))}
        </div>

        {/* Grid columns */}
        {columns.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-1">
            {col.map((cell) => (
              <div
                key={cell.date}
                title={fmtTooltip(cell.date, cell.minutes)}
                className="w-4 h-4 rounded-sm transition-transform hover:scale-125"
                style={{
                  backgroundColor: getIntensityColor(cell.minutes),
                  boxShadow: cell.isToday
                    ? "0 0 0 1.5px #c084fc"
                    : undefined,
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-muted-foreground flex-wrap">
        <span className="mr-0.5">Az</span>
        {INTENSITY_COLORS.map((lvl) => (
          <div
            key={lvl.bg}
            title={lvl.label}
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: lvl.bg, border: "1px solid rgba(255,255,255,0.06)" }}
          />
        ))}
        <span className="ml-0.5">Çok</span>
      </div>
    </div>
  );
}

