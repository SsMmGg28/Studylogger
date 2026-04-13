"use client";

import { useMemo, useState } from "react";
import { format, differenceInDays, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { Brain, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SUBJECT_MAP, SUBJECT_COLORS } from "@/lib/subjects";
import { getLastStudiedByTopic } from "@/lib/db";
import type { StudyLog } from "@/lib/db";

interface RevisionSuggestionsProps {
  logs: StudyLog[];
}

export default function RevisionSuggestions({ logs }: RevisionSuggestionsProps) {
  const [expanded, setExpanded] = useState(false);

  const suggestions = useMemo(() => {
    const lastStudied = getLastStudiedByTopic(logs);
    const today = new Date();
    const items: { subject: string; topic: string; daysAgo: number; date: string }[] = [];

    for (const [key, dateStr] of Object.entries(lastStudied)) {
      const daysAgo = differenceInDays(today, parseISO(dateStr));
      if (daysAgo >= 3) {
        const [subject, topic] = key.split(":");
        items.push({ subject, topic, daysAgo, date: dateStr });
      }
    }

    return items.sort((a, b) => b.daysAgo - a.daysAgo);
  }, [logs]);

  if (suggestions.length === 0) return null;

  const shown = expanded ? suggestions : suggestions.slice(0, 5);

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" />
          <CardTitle className="text-[13px] font-semibold text-muted-foreground tracking-wide uppercase">
            Tekrar Önerileri
          </CardTitle>
          <Badge variant="secondary" className="text-[10px]">
            {suggestions.length}
          </Badge>
        </div>
        {suggestions.length > 5 && (
          <Button variant="ghost" size="sm" className="text-xs" onClick={() => setExpanded(!expanded)}>
            {expanded ? (
              <>Daralt <ChevronUp className="w-3 h-3 ml-1" /></>
            ) : (
              <>Tümü <ChevronDown className="w-3 h-3 ml-1" /></>
            )}
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-1.5">
        {shown.map(({ subject, topic, daysAgo, date }) => {
          const color = SUBJECT_COLORS[subject] ?? "#6366f1";
          const urgency = daysAgo >= 14 ? "text-red-400" : daysAgo >= 7 ? "text-orange-400" : "text-yellow-400";
          return (
            <div
              key={`${subject}:${topic}`}
              className="flex items-center justify-between gap-2 py-1.5 px-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="text-xs font-medium truncate">
                  {SUBJECT_MAP[subject]?.label ?? subject}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {topic}
                </span>
              </div>
              <span className={`text-xs font-medium shrink-0 ${urgency}`}>
                {daysAgo} gün önce
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
