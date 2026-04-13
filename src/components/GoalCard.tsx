"use client";

import { Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SUBJECT_MAP, SUBJECT_COLORS } from "@/lib/subjects";
import type { StudyGoal } from "@/lib/db";

interface GoalCardProps {
  goal: StudyGoal;
  current: number;
  onDelete?: (id: string) => void;
}

export default function GoalCard({ goal, current, onDelete }: GoalCardProps) {
  const subject = SUBJECT_MAP[goal.subject];
  const color = SUBJECT_COLORS[goal.subject] ?? "#6366f1";
  const pct = Math.min(100, Math.round((current / goal.target) * 100));
  const metricLabel = goal.metric === "minutes" ? "dakika" : "soru";
  const periodLabel = goal.period === "weekly" ? "Haftalık" : "Aylık";

  return (
    <Card className="group hover:border-primary/20 transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span className="text-sm font-medium">{subject?.label ?? goal.subject}</span>
            <span className="text-xs text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
              {periodLabel}
            </span>
          </div>
          {onDelete && (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onDelete(goal.id)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-semibold">{current} <span className="text-muted-foreground font-normal">/ {goal.target} {metricLabel}</span></span>
            <span className={`text-xs font-medium ${pct >= 100 ? "text-green-500" : "text-muted-foreground"}`}>
              %{pct}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                backgroundColor: pct >= 100 ? "#22c55e" : color,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
