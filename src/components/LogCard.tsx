"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { Clock, Hash, FileText, Edit2, Trash2, ChevronDown, ChevronUp, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SUBJECT_MAP, SUBJECT_COLORS } from "@/lib/subjects";
import type { StudyLog } from "@/lib/db";

interface LogCardProps {
  log: StudyLog;
  onEdit?: (log: StudyLog) => void;
  onDelete?: (id: string) => void;
}

export default function LogCard({ log, onEdit, onDelete }: LogCardProps) {
  const [expanded, setExpanded] = useState(false);
  const subject = SUBJECT_MAP[log.subject];
  const color = SUBJECT_COLORS[log.subject] ?? "#6366f1";

  const hours = Math.floor(log.durationMinutes / 60);
  const mins = log.durationMinutes % 60;
  const durationStr = hours > 0 ? `${hours}s ${mins}dk` : `${mins}dk`;

  let dateStr = log.date;
  try {
    dateStr = format(parseISO(log.date), "d MMMM yyyy", { locale: tr });
  } catch { /* ignore */ }

  return (
    <Card className="group transition-all duration-200 hover:border-primary/25 hover:bg-card/80">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Color dot */}
          <div
            className="mt-1 w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: color }}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="secondary"
                  className="text-xs"
                  style={{ backgroundColor: color + "20", color }}
                >
                  {subject?.label ?? log.subject}
                </Badge>
                <span className="text-sm font-medium truncate">{log.topic}</span>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{dateStr}</span>
            </div>

            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {durationStr}
              </span>
              {log.questionCount > 0 && (
                <span className="flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5" />
                  {log.questionCount} soru
                </span>
              )}
              {log.tags && log.tags.length > 0 && (
                <span className="flex items-center gap-1 flex-wrap">
                  <Tag className="w-3.5 h-3.5" />
                  {log.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
                      #{tag}
                    </Badge>
                  ))}
                </span>
              )}
              {log.notes && (
                <button
                  className="flex items-center gap-1 text-xs hover:text-foreground transition-colors"
                  onClick={() => setExpanded(!expanded)}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Not {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}
            </div>

            {expanded && log.notes && (
              <p className="mt-2 text-xs text-muted-foreground bg-muted/50 rounded-md p-2 whitespace-pre-wrap">
                {log.notes}
              </p>
            )}
          </div>

          {/* Actions */}
          {(onEdit || onDelete) && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              {onEdit && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => onEdit(log)}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
              )}
              {onDelete && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => onDelete(log.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
