"use client";

import { useState, useMemo, useEffect } from "react";
import {
  CheckCircle2,
  Circle,
  Network,
  ChevronRight,
  Trophy,
  Flame,
  X,
  Clock,
  Hash,
  BookOpen,
  Plus,
  CalendarDays,
} from "lucide-react";
import { format, parseISO, startOfWeek } from "date-fns";
import { cn } from "@/lib/utils";
import { SUBJECTS, type Subject } from "@/lib/subjects";
import { useTopicProgress } from "@/hooks/useTopicProgress";
import { useStudyLogs } from "@/hooks/useStudyLogs";
import { useAuth } from "@/hooks/useAuth";
import { addScheduleItem, getAllScheduleItems, getUserExamLogs, type ScheduleItem, type ExamLog } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// ─── Types ─────────────────────────────────────────────────────────────────────

type ExamType = "tyt" | "ayt";

// ─── Helper: hex → hue in oklch (approximate) ─────────────────────────────────
// Used to make glassmorphic glows match subject colors without importing a full
// color library. We convert the subject's tailwind hex to a hue range.
function hexToHue(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  if (d === 0) return 0;
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return Math.round(h * 360);
}

// ─── Topic stat type ───────────────────────────────────────────────────────────

interface TopicStat {
  totalMinutes: number;
  totalQuestions: number;
  sessions: number;
}

interface TopicTaskInfo {
  total: number;
  pending: number;
  done: number;
}

// ─── Subject Card (grid tile — click to open panel) ────────────────────────────

interface SubjectCardProps {
  subject: Subject;
  completedCount: number;
  examCount: number;
  onClick: () => void;
}

function SubjectCard({ subject, completedCount, examCount, onClick }: SubjectCardProps) {
  const { color, topics, label } = subject;
  const progress = topics.length > 0 ? completedCount / topics.length : 0;
  const hue = hexToHue(color);
  const allDone = completedCount === topics.length;

  return (
    <button
      onClick={onClick}
      className={cn(
        "glass-card rounded-2xl overflow-hidden text-left w-full",
        "transition-all duration-300 hover:border-white/16 hover:scale-[1.015] active:scale-[0.99]",
        allDone && "ring-1 ring-emerald-500/25"
      )}
    >
      {/* Color accent bar */}
      <div
        className="h-[3px] w-full transition-all duration-500"
        style={{
          background: `linear-gradient(90deg, ${color}cc ${Math.round(progress * 100)}%, ${color}22 ${Math.round(progress * 100)}%)`,
        }}
      />

      <div className="flex items-center gap-3 px-4 py-3.5">
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ background: color, boxShadow: `0 0 8px ${color}80` }}
        />
        <span className="flex-1 text-sm font-semibold">{label}</span>
        {examCount > 0 && (
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400">
            {examCount} branş
          </span>
        )}
        <span
          className={cn(
            "text-xs font-mono font-semibold px-2 py-0.5 rounded-full border",
            allDone
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-white/10 bg-white/6 text-muted-foreground"
          )}
        >
          {completedCount}/{topics.length}
        </span>
        <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
      </div>

      {/* Progress bar */}
      <div className="mx-4 mb-3 h-1.5 rounded-full bg-white/6 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${Math.round(progress * 100)}%`,
            background: allDone ? "oklch(0.65 0.15 155)" : `oklch(0.65 0.18 ${hue})`,
          }}
        />
      </div>
    </button>
  );
}

// ─── Subject Panel (slide-in from right) ───────────────────────────────────────

interface SubjectPanelProps {
  subject: Subject | null;
  onClose: () => void;
  topicStats: Record<string, TopicStat>;
  onToggle: (topic: string) => void;
  onQuickAdd: (topic: string) => void;
  isCompleted: (topic: string) => boolean;
  getTaskInfo: (topic: string) => TopicTaskInfo;
  completedCount: number;
}

function SubjectPanel({
  subject,
  onClose,
  topicStats,
  onToggle,
  onQuickAdd,
  isCompleted,
  getTaskInfo,
  completedCount,
}: SubjectPanelProps) {
  // displaySubject persists while closing animation plays
  const [displaySubject, setDisplaySubject] = useState<Subject | null>(subject);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (subject) {
      setDisplaySubject(subject);
      // Double-frame to allow mount before triggering CSS transition
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => setVisible(true))
      );
      return () => cancelAnimationFrame(id);
    } else {
      setVisible(false);
      const t = setTimeout(() => setDisplaySubject(null), 440);
      return () => clearTimeout(t);
    }
  }, [subject]);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!displaySubject) return null;

  const { color, topics, label } = displaySubject;
  const progress = topics.length > 0 ? completedCount / topics.length : 0;
  const hue = hexToHue(color);
  const allDone = completedCount === topics.length;

  const totalSubjectMinutes = topics.reduce(
    (s, t) => s + (topicStats[t]?.totalMinutes ?? 0),
    0
  );
  const totalSubjectQuestions = topics.reduce(
    (s, t) => s + (topicStats[t]?.totalQuestions ?? 0),
    0
  );

  return (
    <>
      {/* Dim backdrop */}
      <div
        className="fixed inset-0 z-40 transition-all duration-[400ms]"
        style={{
          backgroundColor: visible ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0)",
          backdropFilter: visible ? "blur(4px)" : "blur(0px)",
        }}
        onClick={onClose}
      />

      {/* Slide-in panel */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col w-full sm:w-[520px] lg:w-[580px]"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.17 0.022 265) 0%, oklch(0.14 0.015 265) 100%)",
          borderLeft: "1px solid oklch(1 0 0 / 0.08)",
          boxShadow: "-32px 0 80px rgba(0,0,0,0.5)",
          transform: visible ? "translateX(0)" : "translateX(100%)",
          transition: "transform 430ms cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      >
        {/* Subject color top bar */}
        <div
          className="h-1 w-full shrink-0 transition-all duration-700"
          style={{
            background: `linear-gradient(90deg, ${color}dd ${Math.round(progress * 100)}%, ${color}22 ${Math.round(progress * 100)}%)`,
          }}
        />

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/8 shrink-0">
          <span
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ background: color, boxShadow: `0 0 12px ${color}99` }}
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold tracking-tight">{label}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {completedCount}/{topics.length} konu tamamlandı
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/8 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Summary chips */}
        <div className="flex flex-wrap gap-2 px-6 py-4 shrink-0 border-b border-white/6">
          <div className="flex items-center gap-1.5 rounded-lg bg-white/6 border border-white/8 px-3 py-2">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold tabular-nums">%{Math.round(progress * 100)}</span>
            <span className="text-xs text-muted-foreground">tamamlandı</span>
          </div>
          {totalSubjectMinutes > 0 && (
            <div className="flex items-center gap-1.5 rounded-lg bg-white/6 border border-white/8 px-3 py-2">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-semibold tabular-nums text-cyan-400">
                {totalSubjectMinutes >= 60
                  ? `${Math.floor(totalSubjectMinutes / 60)}s ${totalSubjectMinutes % 60}d`
                  : `${totalSubjectMinutes}d`}
              </span>
              <span className="text-xs text-muted-foreground">toplam</span>
            </div>
          )}
          {totalSubjectQuestions > 0 && (
            <div className="flex items-center gap-1.5 rounded-lg bg-white/6 border border-white/8 px-3 py-2">
              <Hash className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-xs font-semibold tabular-nums text-violet-400">
                {totalSubjectQuestions}
              </span>
              <span className="text-xs text-muted-foreground">soru</span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="px-6 py-3 shrink-0 border-b border-white/6">
          <div className="h-2 rounded-full bg-white/8 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${Math.round(progress * 100)}%`,
                background: allDone ? "oklch(0.65 0.15 155)" : `oklch(0.65 0.18 ${hue})`,
              }}
            />
          </div>
        </div>

        {/* Topic list */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1.5">
          {topics.map((topic, i) => {
            const stat = topicStats[topic];
            const done = isCompleted(topic);
            const taskInfo = getTaskInfo(topic);
            return (
              <div
                key={topic}
                className={cn(
                  "group w-full flex items-center gap-2 rounded-xl px-3 py-2 text-left",
                  "transition-all duration-200 hover:bg-white/6 active:scale-[0.99]",
                  "animate-fade-in-up border",
                  done
                    ? "border-emerald-500/15 bg-emerald-500/5"
                    : "border-transparent hover:border-white/8"
                )}
                style={{ animationDelay: `${i * 0.025}s`, animationFillMode: "both" }}
              >
                <button
                  type="button"
                  onClick={() => onToggle(topic)}
                  className="flex-1 min-w-0 flex items-center gap-3 rounded-lg px-1 py-1.5"
                >
                  {/* Completion icon */}
                  <span
                    className={cn(
                      "shrink-0 transition-all duration-300",
                      done
                        ? "text-emerald-400"
                        : "text-muted-foreground/40 group-hover:text-muted-foreground/70"
                    )}
                  >
                    {done ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                  </span>

                  {/* Topic name */}
                  <span
                    className={cn(
                      "flex-1 text-sm transition-all duration-300",
                      done
                        ? "line-through text-muted-foreground/50"
                        : "text-foreground/85 group-hover:text-foreground"
                    )}
                  >
                    {topic}
                  </span>

                  {/* Stats */}
                  {(stat?.totalMinutes || stat?.totalQuestions) ? (
                    <div className="flex items-center gap-1.5 shrink-0">
                      {(stat?.totalMinutes ?? 0) > 0 && (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-cyan-400/80 bg-cyan-950/60 border border-cyan-500/20 rounded-md px-1.5 py-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          {stat.totalMinutes >= 60
                            ? `${Math.floor(stat.totalMinutes / 60)}s${stat.totalMinutes % 60 > 0 ? ` ${stat.totalMinutes % 60}d` : ""}`
                            : `${stat.totalMinutes}d`}
                        </span>
                      )}
                      {(stat?.totalQuestions ?? 0) > 0 && (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-violet-400/80 bg-violet-950/60 border border-violet-500/20 rounded-md px-1.5 py-0.5">
                          <Hash className="w-2.5 h-2.5" />
                          {stat.totalQuestions}
                        </span>
                      )}
                    </div>
                  ) : null}
                </button>

                <div className="shrink-0 flex items-center gap-1.5">
                  {taskInfo.total > 0 && (
                    <span className="text-[10px] font-medium rounded-md border border-amber-500/30 bg-amber-500/10 text-amber-300 px-1.5 py-0.5">
                      Görev var ({taskInfo.pending}/{taskInfo.total})
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => onQuickAdd(topic)}
                    className="h-7 w-7 rounded-md border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center justify-center"
                    title="Bu konu için görev ekle"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* All done footer */}
        {allDone && (
          <div className="px-6 py-4 border-t border-white/6 shrink-0 flex items-center gap-2 justify-center text-emerald-400">
            <Flame className="w-4 h-4" />
            <span className="text-sm font-semibold">Tüm konular tamamlandı!</span>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Summary Banner ────────────────────────────────────────────────────────────

function SummaryBanner({ total, completed }: { total: number; completed: number }) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="glass-card rounded-2xl px-6 py-5 flex items-center gap-5 animate-fade-in-up">
      <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/12 border border-primary/20">
        <Trophy className="w-6 h-6 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1.5">
          <span className="text-2xl font-bold tabular-nums">{completed}</span>
          <span className="text-muted-foreground text-sm">/ {total} konu tamamlandı</span>
          <span className="ml-auto text-sm font-semibold text-primary">%{percent}</span>
        </div>
        <div className="h-2 rounded-full bg-white/8 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out bg-primary"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      {percent === 100 && (
        <div className="shrink-0 flex items-center gap-1.5 text-amber-400">
          <Flame className="w-5 h-5" />
          <span className="text-xs font-bold">Tamamlandı!</span>
        </div>
      )}
    </div>
  );
}

interface QuickAddTaskDialogProps {
  open: boolean;
  onClose: () => void;
  subject: Subject | null;
  topic: string | null;
  taskInfo: TopicTaskInfo;
  onSubmit: (payload: {
    date: string;
    targetQuestions?: number;
    targetMinutes?: number;
  }) => Promise<void>;
}

function QuickAddTaskDialog({
  open,
  onClose,
  subject,
  topic,
  taskInfo,
  onSubmit,
}: QuickAddTaskDialogProps) {
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [targetQuestions, setTargetQuestions] = useState("");
  const [targetMinutes, setTargetMinutes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setDate(format(new Date(), "yyyy-MM-dd"));
    setTargetQuestions("");
    setTargetMinutes("");
  }, [open]);

  async function handleSubmit() {
    if (!subject || !topic) return;
    setSaving(true);
    try {
      await onSubmit({
        date,
        ...(targetQuestions ? { targetQuestions: Number(targetQuestions) } : {}),
        ...(targetMinutes ? { targetMinutes: Number(targetMinutes) } : {}),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md w-[calc(100vw-2rem)] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            Konudan Hızlı Görev Ekle
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-xl border border-border/50 bg-muted/20 px-3 py-2.5 text-sm">
            <p className="font-medium">{subject?.label}</p>
            <p className="text-muted-foreground">{topic}</p>
          </div>

          {taskInfo.total > 0 && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
              Bu konuda {taskInfo.total} görev var ({taskInfo.pending} bekleyen, {taskInfo.done} tamamlandı).
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Tarih</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Hedef Soru (opsiyonel)</Label>
              <Input
                type="number"
                min={0}
                placeholder="örn. 40"
                value={targetQuestions}
                onChange={(e) => setTargetQuestions(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Hedef Süre (dk)</Label>
              <Input
                type="number"
                min={0}
                placeholder="örn. 60"
                value={targetMinutes}
                onChange={(e) => setTargetMinutes(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <Button variant="outline" className="flex-1" onClick={onClose} disabled={saving}>
              İptal
            </Button>
            <Button className="flex-1" onClick={handleSubmit} disabled={saving || !date}>
              {saving ? "Ekleniyor..." : "Görev Ekle"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function TopicTree() {
  const [activeTab, setActiveTab] = useState<ExamType>("tyt");
  const [openSubjectId, setOpenSubjectId] = useState<string | null>(null);
  const [quickAddTopic, setQuickAddTopic] = useState<string | null>(null);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [examLogs, setExamLogs] = useState<ExamLog[]>([]);

  const { user } = useAuth();
  const { loading, toggleTopic, isCompleted, getSubjectCompletedCount, getTotalStats } =
    useTopicProgress();
  const { logs } = useStudyLogs(user?.uid ?? null);

  useEffect(() => {
    if (!user?.uid) { setExamLogs([]); return; }
    let cancelled = false;
    getUserExamLogs(user.uid).then((data) => { if (!cancelled) setExamLogs(data); }).catch(() => {});
    return () => { cancelled = true; };
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) {
      setScheduleItems([]);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const all = await getAllScheduleItems(user.uid);
        if (!cancelled) setScheduleItems(all);
      } catch {
        if (!cancelled) toast.error("Görevler yüklenemedi.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  const filteredSubjects = useMemo(
    () => SUBJECTS.filter((s) => s.type === activeTab),
    [activeTab]
  );

  // Count branş denemesi per subject
  const bransExamCountBySubject = useMemo<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    for (const log of examLogs) {
      if (log.examCategory === "brans" && log.subject) {
        map[log.subject] = (map[log.subject] ?? 0) + 1;
      }
    }
    return map;
  }, [examLogs]);

  const { total, completed } = useMemo(
    () => getTotalStats(filteredSubjects),
    [filteredSubjects, getTotalStats]
  );

  const openSubject = useMemo(
    () => SUBJECTS.find((s) => s.id === openSubjectId) ?? null,
    [openSubjectId]
  );

  // Per-topic stats for the open subject, aggregated from study logs
  const topicStats = useMemo<Record<string, TopicStat>>(() => {
    if (!openSubject || !logs.length) return {};
    const result: Record<string, TopicStat> = {};
    for (const log of logs) {
      if (log.subject !== openSubject.id) continue;
      const key = log.topic;
      if (!result[key]) result[key] = { totalMinutes: 0, totalQuestions: 0, sessions: 0 };
      result[key].totalMinutes += log.durationMinutes ?? 0;
      result[key].totalQuestions += log.questionCount ?? 0;
      result[key].sessions += 1;
    }
    return result;
  }, [openSubject, logs]);

  const topicTaskInfoMap = useMemo<Record<string, TopicTaskInfo>>(() => {
    if (!openSubject) return {};

    const result: Record<string, TopicTaskInfo> = {};
    for (const item of scheduleItems) {
      if (item.subject !== openSubject.id || !item.topic) continue;
      if (!result[item.topic]) result[item.topic] = { total: 0, pending: 0, done: 0 };
      result[item.topic].total += 1;
      if (item.status === "done") result[item.topic].done += 1;
      else result[item.topic].pending += 1;
    }

    return result;
  }, [openSubject, scheduleItems]);

  const quickAddTaskInfo = useMemo<TopicTaskInfo>(
    () => (quickAddTopic ? topicTaskInfoMap[quickAddTopic] ?? { total: 0, pending: 0, done: 0 } : { total: 0, pending: 0, done: 0 }),
    [quickAddTopic, topicTaskInfoMap]
  );

  async function handleQuickAdd(payload: {
    date: string;
    targetQuestions?: number;
    targetMinutes?: number;
  }) {
    if (!user?.uid || !openSubject || !quickAddTopic) return;

    try {
      const weekStart = format(
        startOfWeek(parseISO(payload.date), { weekStartsOn: 1 }),
        "yyyy-MM-dd"
      );

      const id = await addScheduleItem(user.uid, {
        subject: openSubject.id,
        topic: quickAddTopic,
        date: payload.date,
        weekStart,
        status: "pending",
        ...(payload.targetQuestions ? { targetQuestions: payload.targetQuestions } : {}),
        ...(payload.targetMinutes ? { targetMinutes: payload.targetMinutes } : {}),
      });

      setScheduleItems((prev) => [
        {
          id,
          uid: user.uid,
          subject: openSubject.id,
          topic: quickAddTopic,
          date: payload.date,
          weekStart,
          status: "pending",
          ...(payload.targetQuestions ? { targetQuestions: payload.targetQuestions } : {}),
          ...(payload.targetMinutes ? { targetMinutes: payload.targetMinutes } : {}),
        },
        ...prev,
      ]);

      toast.success("Konu için görev eklendi.");
    } catch {
      toast.error("Görev eklenemedi.");
      throw new Error("quick-add-failed");
    }
  }

  // Lock body scroll when panel is open
  useEffect(() => {
    document.body.style.overflow = openSubjectId ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [openSubjectId]);

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      <main className="relative z-10 max-w-5xl mx-auto px-4 pt-10 pb-24 space-y-6">
        {/* ─── Page header ─────────────────────────────────────── */}
        <div className="text-center space-y-2 animate-fade-in-up">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Network className="w-5 h-5" />
            <span className="text-sm font-medium tracking-wide uppercase">Müfredat Takibi</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Kazanım Ağacı</h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Çalıştığın konuları işaretle, ne kadar yol kat ettiğini gör.
          </p>
        </div>

        {/* ─── TYT / AYT tab switcher ──────────────────────────── */}
        <div
          className="flex w-fit mx-auto rounded-xl border border-white/10 bg-white/4 p-1 gap-1 animate-fade-in-up"
          style={{ animationDelay: "0.08s", animationFillMode: "both" }}
        >
          {(["tyt", "ayt"] as ExamType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "relative px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                activeTab === tab
                  ? "bg-primary/20 text-primary shadow-[0_1px_12px_oklch(0.68_0.18_270_/_0.15)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/6"
              )}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* ─── Summary banner ──────────────────────────────────── */}
        {!loading && (
          <div style={{ animationDelay: "0.12s", animationFillMode: "both" }}>
            <SummaryBanner total={total} completed={completed} />
          </div>
        )}

        {/* ─── Subject grid ────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl h-20 animate-pulse"
                style={{ animationDelay: `${i * 0.05}s` }}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
            {filteredSubjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                completedCount={getSubjectCompletedCount(subject.id)}
                examCount={bransExamCountBySubject[subject.id] ?? 0}
                onClick={() => setOpenSubjectId(subject.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* ─── Slide-in subject detail panel ───────────────────── */}
      <SubjectPanel
        subject={openSubject}
        onClose={() => setOpenSubjectId(null)}
        topicStats={topicStats}
        onToggle={(topic) => openSubject && toggleTopic(openSubject.id, topic)}
        onQuickAdd={(topic) => setQuickAddTopic(topic)}
        isCompleted={(topic) => (openSubject ? isCompleted(openSubject.id, topic) : false)}
        getTaskInfo={(topic) => topicTaskInfoMap[topic] ?? { total: 0, pending: 0, done: 0 }}
        completedCount={openSubject ? getSubjectCompletedCount(openSubject.id) : 0}
      />

      <QuickAddTaskDialog
        open={!!quickAddTopic && !!openSubject}
        onClose={() => setQuickAddTopic(null)}
        subject={openSubject}
        topic={quickAddTopic}
        taskInfo={quickAddTaskInfo}
        onSubmit={handleQuickAdd}
      />
    </div>
  );
}
