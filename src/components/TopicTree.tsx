"use client";

import { useState, useMemo } from "react";
import { CheckCircle2, Circle, Network, ChevronDown, ChevronRight, Trophy, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { SUBJECTS } from "@/lib/subjects";
import { useTopicProgress } from "@/hooks/useTopicProgress";

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

// ─── Sub-components ────────────────────────────────────────────────────────────

interface TopicRowProps {
  topic: string;
  completed: boolean;
  onToggle: () => void;
  delay: number;
}

function TopicRow({ topic, completed, onToggle, delay }: TopicRowProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm",
        "transition-all duration-200 hover:bg-white/6 active:scale-[0.99]",
        "animate-fade-in-up",
      )}
      style={{ animationDelay: `${delay}s`, animationFillMode: "both" }}
    >
      <span
        className={cn(
          "shrink-0 transition-all duration-300",
          completed ? "text-emerald-400" : "text-muted-foreground/40 group-hover:text-muted-foreground/70"
        )}
      >
        {completed ? (
          <CheckCircle2 className="w-4 h-4" />
        ) : (
          <Circle className="w-4 h-4" />
        )}
      </span>
      <span
        className={cn(
          "transition-all duration-300 flex-1",
          completed
            ? "line-through text-muted-foreground/50"
            : "text-foreground/85 group-hover:text-foreground"
        )}
      >
        {topic}
      </span>
      {completed && (
        <span className="shrink-0 text-[10px] font-semibold tracking-wider text-emerald-500/70 uppercase">
          ✓
        </span>
      )}
    </button>
  );
}

interface SubjectCardProps {
  subjectId: string;
  label: string;
  color: string;
  topics: string[];
  completedCount: number;
  onToggle: (topic: string) => void;
  isCompleted: (topic: string) => boolean;
}

function SubjectCard({
  subjectId,
  label,
  color,
  topics,
  completedCount,
  onToggle,
  isCompleted,
}: SubjectCardProps) {
  const [open, setOpen] = useState(false);
  const progress = topics.length > 0 ? completedCount / topics.length : 0;
  const hue = hexToHue(color);
  const allDone = completedCount === topics.length;

  return (
    <div
      className={cn(
        "glass-card rounded-2xl overflow-hidden transition-all duration-300",
        "hover:border-white/12",
        allDone && "ring-1 ring-emerald-500/25"
      )}
    >
      {/* ─── Colored top accent bar ─────────────────────────────── */}
      <div
        className="h-[3px] w-full transition-all duration-500"
        style={{
          background: `linear-gradient(90deg, ${color}cc ${Math.round(progress * 100)}%, ${color}22 ${Math.round(progress * 100)}%)`,
        }}
      />

      {/* ─── Card header ─────────────────────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="group flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-white/4 transition-colors"
      >
        {/* Color dot */}
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full shadow-[0_0_8px_var(--dot-glow)]"
          style={{
            background: color,
            "--dot-glow": `${color}80`,
          } as React.CSSProperties}
        />

        {/* Label */}
        <span className="flex-1 text-sm font-semibold">{label}</span>

        {/* Progress chip */}
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

        {/* Chevron */}
        <span className={cn("text-muted-foreground/50 transition-transform duration-200", open && "rotate-90")}>
          <ChevronRight className="w-4 h-4" />
        </span>
      </button>

      {/* ─── Thin progress bar ───────────────────────────────────── */}
      <div className="mx-4 mb-3 h-1.5 rounded-full bg-white/6 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${Math.round(progress * 100)}%`,
            background: allDone
              ? "oklch(0.65 0.15 155)"
              : `oklch(0.65 0.18 ${hue})`,
          }}
        />
      </div>

      {/* ─── Topic list ──────────────────────────────────────────── */}
      {open && (
        <div className="px-2 pb-3 border-t border-white/6 pt-2 space-y-0.5">
          {topics.map((topic, i) => (
            <TopicRow
              key={topic}
              topic={topic}
              completed={isCompleted(topic)}
              onToggle={() => onToggle(topic)}
              delay={i * 0.025}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Summary Banner ────────────────────────────────────────────────────────────

function SummaryBanner({
  total,
  completed,
}: {
  total: number;
  completed: number;
}) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="glass-card rounded-2xl px-6 py-5 flex items-center gap-5 animate-fade-in-up">
      {/* Icon */}
      <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/12 border border-primary/20">
        <Trophy className="w-6 h-6 text-primary" />
      </div>

      {/* Stats */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1.5">
          <span className="text-2xl font-bold tabular-nums">{completed}</span>
          <span className="text-muted-foreground text-sm">/ {total} konu tamamlandı</span>
          <span className="ml-auto text-sm font-semibold text-primary">%{percent}</span>
        </div>
        {/* Progress bar */}
        <div className="h-2 rounded-full bg-white/8 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out bg-primary"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Streak flame if all done */}
      {percent === 100 && (
        <div className="shrink-0 flex items-center gap-1.5 text-amber-400">
          <Flame className="w-5 h-5" />
          <span className="text-xs font-bold">Tamamlandı!</span>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function TopicTree() {
  const [activeTab, setActiveTab] = useState<ExamType>("tyt");
  const { loading, toggleTopic, isCompleted, getSubjectCompletedCount, getTotalStats } =
    useTopicProgress();

  const filteredSubjects = useMemo(
    () => SUBJECTS.filter((s) => s.type === activeTab),
    [activeTab]
  );

  const { total, completed } = useMemo(
    () => getTotalStats(filteredSubjects),
    [filteredSubjects, getTotalStats]
  );

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
                subjectId={subject.id}
                label={subject.label}
                color={subject.color}
                topics={subject.topics}
                completedCount={getSubjectCompletedCount(subject.id)}
                onToggle={(topic) => toggleTopic(subject.id, topic)}
                isCompleted={(topic) => isCompleted(subject.id, topic)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
