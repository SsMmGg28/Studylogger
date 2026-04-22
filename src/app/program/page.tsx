"use client";

import { useState, useMemo } from "react";
import {
  format,
  addWeeks,
  subWeeks,
  startOfWeek,
  addDays,
  isToday,
  parseISO,
} from "date-fns";
import { tr } from "date-fns/locale";
import {
  CalendarDays,
  Plus,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Trash2,
  Clock,
  Hash,
} from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useSchedule } from "@/hooks/useSchedule";
import { SUBJECTS, SUBJECT_COLORS } from "@/lib/subjects";
import { ScheduleItem } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const TR_DAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const TR_DAYS_FULL = [
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
  "Pazar",
];

function getWeekStart(date: Date): string {
  return format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd");
}

function getWeekDays(weekStartStr: string): string[] {
  const base = parseISO(weekStartStr);
  return Array.from({ length: 7 }, (_, i) =>
    format(addDays(base, i), "yyyy-MM-dd")
  );
}

// ── Add Task Dialog ────────────────────────────────────────────────────────────

interface AddDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: Omit<ScheduleItem, "id" | "uid" | "completedAt">) => Promise<void>;
  weekDays: string[];
  defaultDate?: string;
  weekStart: string;
}

function AddTaskDialog({
  open,
  onClose,
  onAdd,
  weekDays,
  defaultDate,
  weekStart,
}: AddDialogProps) {
  const [subjectType, setSubjectType] = useState<"tyt" | "ayt">("tyt");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState(defaultDate ?? weekDays[0]);
  const [targetQuestions, setTargetQuestions] = useState("");
  const [targetMinutes, setTargetMinutes] = useState("");
  const [isBranch, setIsBranch] = useState(false);
  const [saving, setSaving] = useState(false);

  const filteredSubjects = useMemo(
    () => SUBJECTS.filter((s) => s.type === subjectType),
    [subjectType]
  );

  const selectedSubject = useMemo(
    () => SUBJECTS.find((s) => s.id === subject),
    [subject]
  );

  const topics = useMemo(
    () => SUBJECTS.find((s) => s.id === subject)?.topics ?? [],
    [subject]
  );

  const canSubmit = subject && (isBranch || Boolean(topic));

  async function handleSubmit() {
    if (!canSubmit) return;
    setSaving(true);
    try {
      await onAdd({
        subject,
        ...(isBranch
          ? {
              branch: `${selectedSubject?.type.toUpperCase()} ${selectedSubject?.label}`,
            }
          : { topic }),
        date,
        weekStart,
        status: "pending",
        ...(targetQuestions ? { targetQuestions: Number(targetQuestions) } : {}),
        ...(targetMinutes ? { targetMinutes: Number(targetMinutes) } : {}),
      });
      toast.success("Görev eklendi.");
      setSubject("");
      setTopic("");
      setDate(defaultDate ?? weekDays[0]);
      setTargetQuestions("");
      setTargetMinutes("");
      setIsBranch(false);
      onClose();
    } catch {
      toast.error("Görev eklenemedi.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md w-[calc(100vw-2rem)] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Görev Ekle
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-1">
          {/* Day */}
          <div className="space-y-1.5">
            <Label>Gün</Label>
            <Select value={date} onValueChange={setDate}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {weekDays.map((d, i) => (
                  <SelectItem key={d} value={d}>
                    {TR_DAYS_FULL[i]} —{" "}
                    {format(parseISO(d), "d MMMM", { locale: tr })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <Label>Ders *</Label>

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={subjectType === "tyt" ? "default" : "outline"}
                className="h-8"
                onClick={() => {
                  setSubjectType("tyt");
                  if (subject && SUBJECTS.find((s) => s.id === subject)?.type !== "tyt") {
                    setSubject("");
                    setTopic("");
                  }
                }}
              >
                TYT
              </Button>
              <Button
                type="button"
                variant={subjectType === "ayt" ? "default" : "outline"}
                className="h-8"
                onClick={() => {
                  setSubjectType("ayt");
                  if (subject && SUBJECTS.find((s) => s.id === subject)?.type !== "ayt") {
                    setSubject("");
                    setTopic("");
                  }
                }}
              >
                AYT
              </Button>
            </div>

            <Select
              value={subject}
              onValueChange={(v) => {
                setSubject(v);
                setTopic("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Ders seç" />
              </SelectTrigger>
              <SelectContent>
                {filteredSubjects.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Branch toggle */}
          <button
            type="button"
            onClick={() => {
              setIsBranch((v) => {
                const next = !v;
                if (next) {
                  setTargetQuestions("");
                  setTargetMinutes("");
                }
                return next;
              });
              setTopic("");
            }}
            className={cn(
              "w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all duration-200",
              isBranch
                ? "border-primary/50 bg-primary/8 text-primary"
                : "border-border/50 bg-muted/20 text-muted-foreground hover:border-border"
            )}
          >
            <div
              className={cn(
                "w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors",
                isBranch
                  ? "border-primary bg-primary"
                  : "border-muted-foreground/40"
              )}
            >
              {isBranch && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <div className="text-left">
              <p className={cn("font-medium text-sm", isBranch ? "text-primary" : "text-foreground")}>
                Branş denemesi
              </p>
              <p className="text-xs text-muted-foreground">
                Seçilirse konu seçimi kapanır, ders otomatik branş olarak kaydedilir
              </p>
            </div>
          </button>

          {/* Topic or branch info */}
          {isBranch ? (
            <div className="rounded-xl border border-border/50 bg-muted/20 px-3 py-2.5 text-xs text-muted-foreground">
              Branş adı seçtiğin dersten otomatik alınır.
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label>Konu *</Label>
              <Select
                value={topic}
                onValueChange={setTopic}
                disabled={!subject}
              >
                <SelectTrigger>
                  <SelectValue placeholder={subject ? "Konu seç" : "Önce ders seç"} />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Numeric targets */}
          {!isBranch && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5" /> Hedef Soru
                </Label>
                <Input
                  type="number"
                  min={0}
                  placeholder="örn. 40"
                  value={targetQuestions}
                  onChange={(e) => setTargetQuestions(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Hedef Süre (dk)
                </Label>
                <Input
                  type="number"
                  min={0}
                  placeholder="örn. 60"
                  value={targetMinutes}
                  onChange={(e) => setTargetMinutes(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <Button variant="outline" className="flex-1" onClick={onClose} disabled={saving}>
              İptal
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={!canSubmit || saving}
            >
              {saving ? "Ekleniyor…" : "Ekle"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Complete Dialog ────────────────────────────────────────────────────────────

interface CompleteDialogProps {
  item: ScheduleItem | null;
  onClose: () => void;
  onComplete: (
    id: string,
    actual: { actualQuestions?: number; actualMinutes?: number }
  ) => Promise<void>;
}

function CompleteDialog({ item, onClose, onComplete }: CompleteDialogProps) {
  const [questions, setQuestions] = useState(
    item?.targetQuestions?.toString() ?? ""
  );
  const [minutes, setMinutes] = useState(
    item?.targetMinutes?.toString() ?? ""
  );
  const [saving, setSaving] = useState(false);

  // sync defaults when item changes
  useMemo(() => {
    setQuestions(item?.targetQuestions?.toString() ?? "");
    setMinutes(item?.targetMinutes?.toString() ?? "");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id]);

  const subjectLabel =
    SUBJECTS.find((s) => s.id === item?.subject)?.label ?? item?.subject ?? "";

  async function handleSubmit() {
    if (!item) return;
    setSaving(true);
    try {
      await onComplete(item.id, {
        ...(questions ? { actualQuestions: Number(questions) } : {}),
        ...(minutes ? { actualMinutes: Number(minutes) } : {}),
      });
      toast.success("Görev tamamlandı! 🎉");
      onClose();
    } catch {
      toast.error("Güncellenemedi.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={!!item} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md w-[calc(100vw-2rem)] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            Görevi Tamamla
          </DialogTitle>
        </DialogHeader>
        {item && (
          <div className="space-y-4 pt-1">
            <div className="rounded-xl bg-muted/40 px-4 py-3 space-y-0.5">
              <p className="text-sm font-semibold">{subjectLabel}</p>
              <p className="text-xs text-muted-foreground">
                {item.branch ? "Branş denemesi" : item.topic}
              </p>
              {item.branch && (
                <p className="text-xs text-muted-foreground">Branş: {item.branch}</p>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              Ne kadar çalıştın?{" "}
              <span className="text-foreground/70">(boş bırakabilirsin)</span>
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5" /> Çözülen Soru
                </Label>
                <Input
                  type="number"
                  min={0}
                  placeholder={item.targetQuestions ? String(item.targetQuestions) : "—"}
                  value={questions}
                  onChange={(e) => setQuestions(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Süre (dk)
                </Label>
                <Input
                  type="number"
                  min={0}
                  placeholder={item.targetMinutes ? String(item.targetMinutes) : "—"}
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1" onClick={onClose} disabled={saving}>
                İptal
              </Button>
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? "Kaydediliyor…" : "Tamamla"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Task Card ──────────────────────────────────────────────────────────────────

interface TaskCardProps {
  item: ScheduleItem;
  onComplete: () => void;
  onDelete: () => void;
}

function TaskCard({ item, onComplete, onDelete }: TaskCardProps) {
  const subjectLabel =
    SUBJECTS.find((s) => s.id === item.subject)?.label ?? item.subject;
  const color = SUBJECT_COLORS[item.subject] ?? "#6366f1";
  const done = item.status === "done";

  return (
    <div
      className={cn(
        "relative rounded-xl border px-3 py-2.5 space-y-1.5 transition-all duration-200",
        done
          ? "border-border/30 bg-muted/20 opacity-60"
          : "border-border/60 bg-card/80 hover:border-primary/30"
      )}
    >
      {/* Color bar */}
      <div
        className="absolute left-0 top-2 bottom-2 w-1 rounded-full"
        style={{ backgroundColor: color }}
      />
      <div className="pl-3">
        <div className="flex items-start justify-between gap-1">
          <div className="min-w-0">
            <p
              className={cn(
                "text-xs font-semibold leading-tight",
                done && "line-through text-muted-foreground"
              )}
            >
              {subjectLabel}
            </p>
            <p className="text-[11px] text-muted-foreground leading-tight truncate">
              {item.branch ? `Branş: ${item.branch}` : item.topic}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {!done && (
              <button
                onClick={onComplete}
                className="text-muted-foreground hover:text-emerald-500 transition-colors p-0.5"
                title="Tamamla"
              >
                <Circle className="w-4 h-4" />
              </button>
            )}
            {done && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            <button
              onClick={onDelete}
              className="text-muted-foreground hover:text-destructive transition-colors p-0.5"
              title="Sil"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Chips */}
        <div className="flex flex-wrap gap-1 mt-1">
          {item.targetQuestions && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
              {done && item.actualQuestions != null
                ? `${item.actualQuestions}/${item.targetQuestions} soru`
                : `${item.targetQuestions} soru`}
            </Badge>
          )}
          {item.targetMinutes && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
              {done && item.actualMinutes != null
                ? `${item.actualMinutes}/${item.targetMinutes} dk`
                : `${item.targetMinutes} dk`}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function ProgramPage() {
  const { user } = useAuth();
  const [currentWeekBase, setCurrentWeekBase] = useState<Date>(new Date());
  const weekStart = useMemo(() => getWeekStart(currentWeekBase), [currentWeekBase]);
  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);

  const { items, loading, add, complete, remove } = useSchedule(
    user?.uid ?? null,
    weekStart
  );

  // Mobile day tab state
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const defaultDayIndex = weekDays.findIndex((d) => d === todayStr);
  const [activeDay, setActiveDay] = useState(
    defaultDayIndex >= 0 ? defaultDayIndex : 0
  );

  // Dialogs
  const [showAdd, setShowAdd] = useState(false);
  const [addForDay, setAddForDay] = useState<string | undefined>();
  const [completeItem, setCompleteItem] = useState<ScheduleItem | null>(null);

  const itemsByDay = useMemo(() => {
    const map: Record<string, ScheduleItem[]> = {};
    weekDays.forEach((d) => (map[d] = []));
    items.forEach((item) => {
      if (map[item.date]) map[item.date].push(item);
    });
    return map;
  }, [items, weekDays]);

  function openAdd(day?: string) {
    setAddForDay(day);
    setShowAdd(true);
  }

  async function handleDelete(itemId: string) {
    if (!confirm("Bu görevi silmek istediğinden emin misin?")) return;
    await remove(itemId);
    toast.success("Görev silindi.");
  }

  const isCurrentWeek = weekStart === getWeekStart(new Date());

  // Weekly stats
  const totalTasks = items.length;
  const doneTasks = items.filter((i) => i.status === "done").length;
  const progressPct = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        {/* Extra bottom padding on mobile for nav bar */}
        <main className="flex-1 max-w-5xl mx-auto w-full px-3 sm:px-4 py-5 pb-24 md:pb-8 space-y-5 animate-fade-in-up">
          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <CalendarDays className="w-7 h-7 text-primary shrink-0" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-none">
                  Haftalık Program
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {format(parseISO(weekDays[0]), "d MMM", { locale: tr })} —{" "}
                  {format(parseISO(weekDays[6]), "d MMM yyyy", { locale: tr })}
                  {isCurrentWeek && (
                    <span className="ml-2 text-primary font-medium">Bu Hafta</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Week navigation */}
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() => setCurrentWeekBase((d) => subWeeks(d, 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {!isCurrentWeek && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs px-2"
                  onClick={() => setCurrentWeekBase(new Date())}
                >
                  Bugün
                </Button>
              )}
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() => setCurrentWeekBase((d) => addWeeks(d, 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button onClick={() => openAdd()} className="gap-1.5 h-9 text-sm ml-1">
                <Plus className="w-4 h-4" />
                <span className="hidden xs:inline">Görev Ekle</span>
                <span className="xs:hidden">Ekle</span>
              </Button>
            </div>
          </div>

          {/* ── Progress Bar ── */}
          {totalTasks > 0 && (
            <div className="rounded-xl border border-border/40 bg-card/60 px-4 py-3 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span>
                    {doneTasks}/{totalTasks} görev tamamlandı
                  </span>
                  <span className="font-medium text-foreground">%{progressPct}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-16 text-muted-foreground text-sm">
              Yükleniyor…
            </div>
          ) : (
            <>
              {/* ── DESKTOP: 7-column grid ── */}
              <div className="hidden md:grid grid-cols-7 gap-2.5">
                {weekDays.map((day, i) => {
                  const today = isToday(parseISO(day));
                  const dayItems = itemsByDay[day] ?? [];
                  return (
                    <div
                      key={day}
                      className={cn(
                        "flex flex-col rounded-2xl border min-h-[180px] transition-colors",
                        today
                          ? "border-primary/40 bg-primary/5"
                          : "border-border/40 bg-card/50"
                      )}
                    >
                      {/* Day header */}
                      <div
                        className={cn(
                          "flex items-center justify-between px-3 py-2 border-b",
                          today ? "border-primary/20" : "border-border/30"
                        )}
                      >
                        <div>
                          <p
                            className={cn(
                              "text-[11px] font-semibold uppercase tracking-wider",
                              today ? "text-primary" : "text-muted-foreground"
                            )}
                          >
                            {TR_DAYS[i]}
                          </p>
                          <p
                            className={cn(
                              "text-lg font-bold leading-none",
                              today && "text-primary"
                            )}
                          >
                            {format(parseISO(day), "d")}
                          </p>
                        </div>
                        <button
                          onClick={() => openAdd(day)}
                          className="text-muted-foreground hover:text-primary transition-colors"
                          title="Görev ekle"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Tasks */}
                      <div className="flex-1 p-2 space-y-1.5 overflow-y-auto">
                        {dayItems.length === 0 ? (
                          <p className="text-[11px] text-muted-foreground/50 text-center mt-4">
                            Görev yok
                          </p>
                        ) : (
                          dayItems.map((item) => (
                            <TaskCard
                              key={item.id}
                              item={item}
                              onComplete={() => setCompleteItem(item)}
                              onDelete={() => handleDelete(item.id)}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── MOBILE: Day tabs ── */}
              <div className="md:hidden space-y-3">
                {/* Day selector strip */}
                <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
                  {weekDays.map((day, i) => {
                    const today = isToday(parseISO(day));
                    const count = (itemsByDay[day] ?? []).length;
                    const doneCount = (itemsByDay[day] ?? []).filter(
                      (x) => x.status === "done"
                    ).length;
                    const active = i === activeDay;
                    return (
                      <button
                        key={day}
                        onClick={() => setActiveDay(i)}
                        className={cn(
                          "flex flex-col items-center min-w-[52px] px-2 py-2 rounded-xl transition-all duration-200 shrink-0",
                          active
                            ? "bg-primary text-primary-foreground shadow-md"
                            : today
                            ? "bg-primary/10 text-primary"
                            : "bg-muted/40 text-muted-foreground"
                        )}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wide">
                          {TR_DAYS[i]}
                        </span>
                        <span className="text-lg font-bold leading-none">
                          {format(parseISO(day), "d")}
                        </span>
                        {count > 0 && (
                          <span
                            className={cn(
                              "text-[9px] font-medium mt-0.5",
                              active ? "text-primary-foreground/80" : ""
                            )}
                          >
                            {doneCount}/{count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Active day tasks */}
                {(() => {
                  const day = weekDays[activeDay];
                  const today = isToday(parseISO(day));
                  const dayItems = itemsByDay[day] ?? [];
                  return (
                    <div
                      className={cn(
                        "rounded-2xl border",
                        today ? "border-primary/30 bg-primary/5" : "border-border/40 bg-card/50"
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-between px-4 py-3 border-b",
                          today ? "border-primary/20" : "border-border/30"
                        )}
                      >
                        <div>
                          <p
                            className={cn(
                              "text-sm font-semibold",
                              today && "text-primary"
                            )}
                          >
                            {TR_DAYS_FULL[activeDay]}
                            {today && (
                              <span className="ml-2 text-xs font-normal text-primary/70">
                                Bugün
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(parseISO(day), "d MMMM yyyy", { locale: tr })}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-1.5 text-xs h-8"
                          onClick={() => openAdd(day)}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Ekle
                        </Button>
                      </div>

                      <div className="p-3 space-y-2">
                        {dayItems.length === 0 ? (
                          <div className="text-center py-8 space-y-2">
                            <CalendarDays className="w-8 h-8 text-muted-foreground/30 mx-auto" />
                            <p className="text-sm text-muted-foreground">
                              Bu gün için görev yok
                            </p>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs gap-1.5"
                              onClick={() => openAdd(day)}
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Görev Ekle
                            </Button>
                          </div>
                        ) : (
                          dayItems.map((item) => (
                            <TaskCard
                              key={item.id}
                              item={item}
                              onComplete={() => setCompleteItem(item)}
                              onDelete={() => handleDelete(item.id)}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </>
          )}
        </main>

        <AddTaskDialog
          open={showAdd}
          onClose={() => {
            setShowAdd(false);
            setAddForDay(undefined);
          }}
          onAdd={add}
          weekDays={weekDays}
          defaultDate={addForDay}
          weekStart={weekStart}
        />

        <CompleteDialog
          item={completeItem}
          onClose={() => setCompleteItem(null)}
          onComplete={complete}
        />
      </div>
    </AuthGuard>
  );
}
