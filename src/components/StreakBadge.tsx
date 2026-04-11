"use client";

import { useMemo } from "react";
import { format, subDays } from "date-fns";
import { Flame } from "lucide-react";
import type { StudyLog } from "@/lib/db";

interface StreakBadgeProps {
  logs: StudyLog[];
}

export default function StreakBadge({ logs }: StreakBadgeProps) {
  const { current, longest } = useMemo(() => {
    const daysWithStudy = new Set(logs.map((l) => l.date));

    let current = 0;
    const today = format(new Date(), "yyyy-MM-dd");
    const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");

    // Start from today; if today has no study, start from yesterday
    let checkDate = daysWithStudy.has(today) ? new Date() : subDays(new Date(), 1);
    const startDateStr = format(checkDate, "yyyy-MM-dd");

    if (!daysWithStudy.has(startDateStr)) {
      // No study today or yesterday → streak is 0
      return { current: 0, longest: calcLongest(daysWithStudy) };
    }

    while (daysWithStudy.has(format(checkDate, "yyyy-MM-dd"))) {
      current++;
      checkDate = subDays(checkDate, 1);
    }

    return { current, longest: calcLongest(daysWithStudy) };
  }, [logs]);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        <Flame
          className="w-5 h-5"
          style={{ color: current > 0 ? "#f97316" : "hsl(var(--muted-foreground))" }}
        />
        <div>
          <p className="text-xl font-bold leading-none">{current}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">günlük seri</p>
        </div>
      </div>
      {longest > 0 && (
        <div className="border-l border-border pl-3">
          <p className="text-sm font-semibold leading-none">{longest}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">en iyi</p>
        </div>
      )}
    </div>
  );
}

function calcLongest(daysWithStudy: Set<string>): number {
  if (daysWithStudy.size === 0) return 0;
  const sorted = Array.from(daysWithStudy).sort();
  let longest = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (curr.getTime() - prev.getTime()) / 86400000;
    if (diff === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }
  return longest;
}
