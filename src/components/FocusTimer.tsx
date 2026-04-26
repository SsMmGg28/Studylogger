"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Timer, BookPlus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
import { useAuth } from "@/hooks/useAuth";
import {
  addExamLog,
  subscribeTimerSession,
  startTimer,
  pauseTimer,
  resetTimer,
  type TimerSession,
} from "@/lib/db";
import { DEMO_UID } from "@/lib/demo-data";
import { format } from "date-fns";
import { toast } from "sonner";

const IS_DEV = process.env.NODE_ENV === "development";

// ─── Branş Süre Veri Seti (saniye cinsinden) ───────────────────────────────
interface BranchTiming {
  label: string;
  idealSeconds: number;
  warningSeconds: number;
}

const BRANCH_TIMINGS: Record<string, BranchTiming> = {
  tyt_turkce:     { label: "TYT Türkçe",     idealSeconds: 45 * 60, warningSeconds: 35 * 60 },
  tyt_matematik:  { label: "TYT Matematik",   idealSeconds: 75 * 60, warningSeconds: 55 * 60 },
  tyt_sosyal:     { label: "TYT Sosyal",      idealSeconds: 20 * 60, warningSeconds: 15 * 60 },
  tyt_fizik:      { label: "TYT Fizik",       idealSeconds: 7 * 60,  warningSeconds: 5 * 60 },
  tyt_kimya:      { label: "TYT Kimya",       idealSeconds: 5 * 60,  warningSeconds: 4 * 60 },
  tyt_biyoloji:   { label: "TYT Biyoloji",    idealSeconds: 4 * 60,  warningSeconds: 3 * 60 },
  tyt_fen:        { label: "TYT Fen Bilgisi", idealSeconds: 20 * 60, warningSeconds: 15 * 60 },
  ayt_matematik:  { label: "AYT Matematik",   idealSeconds: 90 * 60, warningSeconds: 70 * 60 },
  ayt_fizik:      { label: "AYT Fizik",       idealSeconds: 20 * 60, warningSeconds: 15 * 60 },
  ayt_kimya:      { label: "AYT Kimya",       idealSeconds: 20 * 60, warningSeconds: 15 * 60 },
  ayt_biyoloji:   { label: "AYT Biyoloji",    idealSeconds: 15 * 60, warningSeconds: 11 * 60 },
};

type Phase = "focus" | "warning" | "danger";

const DANGER_THRESHOLD_RATIO = 1.15;

function getDangerSeconds(timing: BranchTiming): number {
  return Math.round(timing.idealSeconds * DANGER_THRESHOLD_RATIO);
}

function getPhase(elapsed: number, timing: BranchTiming): Phase {
  if (elapsed >= getDangerSeconds(timing)) return "danger";
  if (elapsed >= timing.warningSeconds) return "warning";
  return "focus";
}

function getPhaseProgress(elapsed: number, timing: BranchTiming): number {
  const dangerSeconds = getDangerSeconds(timing);
  if (elapsed >= dangerSeconds) {
    return Math.min((elapsed - dangerSeconds) / (dangerSeconds * 0.5), 1);
  }
  if (elapsed >= timing.warningSeconds) {
    return (elapsed - timing.warningSeconds) / (dangerSeconds - timing.warningSeconds);
  }
  return elapsed / timing.warningSeconds;
}

const PHASE_COLORS: Record<Phase, { hue: number; chroma: number; name: string }> = {
  focus:   { hue: 180, chroma: 0.15, name: "Odak Bölgesi" },
  warning: { hue: 55,  chroma: 0.18, name: "Uyarı Bölgesi" },
  danger:  { hue: 25,  chroma: 0.22, name: "Tehlike Bölgesi" },
};

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

/** Compute elapsed seconds from a TimerSession's timestamps. */
function computeElapsed(session: TimerSession): number {
  if (session.status === "running" && session.startedAt) {
    const startMs = (session.startedAt as { toMillis(): number }).toMillis();
    return session.accumulatedSeconds + Math.max(0, Math.floor((Date.now() - startMs) / 1000));
  }
  return session.accumulatedSeconds;
}

// ─── Animated Glow Orb ─────────────────────────────────────────────────────
interface GlowOrbProps {
  phase: Phase;
  index: number;
  intensity: number;
}

function GlowOrb({ phase, index, intensity }: GlowOrbProps) {
  const color = PHASE_COLORS[phase];
  const size = 200 + (index % 3) * 120;
  const delay = index * 1.8;
  const duration = 6 + (index % 4) * 2;

  const positions = [
    { top: "10%", left: "15%" },
    { top: "60%", right: "10%" },
    { bottom: "15%", left: "25%" },
    { top: "25%", right: "25%" },
    { bottom: "30%", left: "60%" },
    { top: "50%", left: "5%" },
    { top: "15%", right: "5%" },
  ];

  const pos = positions[index % positions.length];

  return (
    <div
      className="absolute rounded-full pointer-events-none glow-orb"
      style={{
        ...pos,
        width: size,
        height: size,
        background: `radial-gradient(circle, oklch(${0.55 + intensity * 0.15} ${color.chroma * (0.6 + intensity * 0.4)} ${color.hue} / ${0.08 + intensity * 0.14}) 0%, transparent 70%)`,
        filter: `blur(${40 + index * 10}px)`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        opacity: 0.3 + intensity * 0.5,
      }}
    />
  );
}

// ─── Save Exam Log Dialog ─────────────────────────────────────────────────
interface SaveLogDialogProps {
  open: boolean;
  onClose: () => void;
  elapsedSeconds: number;
  branchKey: string;
  onSave: (net: number | undefined, notes: string | undefined) => Promise<void>;
}

function SaveLogDialog({ open, onClose, elapsedSeconds, branchKey, onSave }: SaveLogDialogProps) {
  const timing = BRANCH_TIMINGS[branchKey];
  const [net, setNet] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const durationMinutes = Math.max(1, Math.round(elapsedSeconds / 60));

  useEffect(() => {
    if (open) { setNet(""); setNotes(""); }
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(
        net !== "" ? Number(net) : undefined,
        notes.trim() || undefined,
      );
      onClose();
    } finally { setSaving(false); }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookPlus className="w-5 h-5 text-primary" />
            Denemeyi Kaydet
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-primary/8 border border-primary/20">
            <Timer className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="text-sm font-semibold text-primary">{timing?.label}</div>
              <div className="text-xs text-muted-foreground">
                {formatTime(elapsedSeconds)} — {durationMinutes} dakika
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="net">
              Net <span className="text-muted-foreground text-xs">(opsiyonel)</span>
            </Label>
            <Input
              id="net"
              type="number"
              step="0.25"
              min="0"
              placeholder="ör. 11.75"
              value={net}
              onChange={(e) => setNet(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label>Not <span className="text-muted-foreground text-xs">(opsiyonel)</span></Label>
            <Textarea
              placeholder="Bu deneme hakkında notlar…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <div className="flex gap-2 pt-1">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? "Kaydediliyor…" : "Kaydet"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>İptal</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Dev Speed Panel (only in development) ───────────────────────────────
function DevSpeedPanel({ speed, onSpeedChange }: { speed: number; onSpeedChange: (v: number) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 glass-card rounded-xl p-4 w-56 space-y-2 border border-amber-500/25 shadow-xl shadow-black/40">
      <div className="flex items-center gap-2 text-amber-400">
        <Zap className="w-3.5 h-3.5" />
        <span className="text-xs font-bold uppercase tracking-wider">Dev Mode</span>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Hız çarpanı</span>
          <span className="font-mono font-bold text-amber-300">{speed}×</span>
        </div>
        <input
          type="range" min={1} max={20} step={1} value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-full accent-amber-400 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground/50">
          <span>1×</span><span>10×</span><span>20×</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function FocusTimer() {
  const { user } = useAuth();
  const [cloudSyncUnavailable, setCloudSyncUnavailable] = useState(false);

  // ── Demo / local-only mode (no Firestore) ─────────────────────────────────
  // Used when user is not authenticated or is in demo mode.
  const isDemoMode = !user || user.uid === DEMO_UID || cloudSyncUnavailable;

  const [localBranch, setLocalBranch] = useState<string | null>(null);
  const [localElapsed, setLocalElapsed] = useState(0);
  const [localRunning, setLocalRunning] = useState(false);
  const localIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Cloud timer state (authenticated users) ───────────────────────────────
  // `session` is the Firestore doc. `pendingBranch` is the branch the user has
  // selected but not yet started (no session exists yet).
  const [session, setSession] = useState<TimerSession | null>(null);
  const [pendingBranch, setPendingBranch] = useState<string | null>(null);
  // Elapsed seconds computed from session timestamps, refreshed by a 1-second interval.
  const [displayElapsed, setDisplayElapsed] = useState(0);

  const [showSave, setShowSave] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  // Optimistic start: track local start time so the timer counts immediately
  // before the Firestore snapshot round-trip completes.
  const [optimisticRunning, setOptimisticRunning] = useState(false);
  const optimisticStartRef = useRef<{ startedAt: number; accumulated: number } | null>(null);
  const permissionToastShownRef = useRef(false);

  // ── Derived values ─────────────────────────────────────────────────────────
  // Cloud: branch is locked to the active session; falls back to pending selection.
  const selectedBranch = isDemoMode ? localBranch : (session?.branchKey ?? pendingBranch);
  const isRunning = isDemoMode ? localRunning : (session?.status === "running" || optimisticRunning);
  const elapsed = isDemoMode ? localElapsed : displayElapsed;

  const timing = selectedBranch ? BRANCH_TIMINGS[selectedBranch] : null;
  const phase: Phase = timing ? getPhase(elapsed, timing) : "focus";
  const intensity = timing ? getPhaseProgress(elapsed, timing) : 0;

  // ── Subscribe to Firestore timer session (cloud mode only) ─────────────────
  useEffect(() => {
    if (isDemoMode || !user) return;
    const unsub = subscribeTimerSession(
      user.uid,
      setSession,
      (error) => {
        console.error("[FocusTimer] Timer session subscription failed:", error);
        setSession(null);
        setCloudSyncUnavailable(true);
        if (!permissionToastShownRef.current) {
          permissionToastShownRef.current = true;
          toast.error("Bulut zamanlayiciya erisilemiyor. Yerel mod kullaniliyor.");
        }
      }
    );
    return unsub;
  }, [isDemoMode, user]);

  useEffect(() => {
    if (!cloudSyncUnavailable || localBranch) return;
    if (session?.branchKey) setLocalBranch(session.branchKey);
    else if (pendingBranch) setLocalBranch(pendingBranch);
    setLocalElapsed(displayElapsed);
    setLocalRunning(session?.status === "running");
  }, [cloudSyncUnavailable, localBranch, session, pendingBranch, displayElapsed]);

  // When Firestore confirms the session is running, release optimistic state.
  useEffect(() => {
    if (optimisticRunning && session?.status === "running") {
      setOptimisticRunning(false);
      optimisticStartRef.current = null;
    }
  }, [optimisticRunning, session]);

  // ── Recompute displayElapsed every second from session timestamps ──────────
  // This is the key difference from the old client-only approach: elapsed is
  // calculated from a wall-clock timestamp stored in Firestore, so screen-off
  // or tab-suspend doesn't lose time.
  useEffect(() => {
    if (isDemoMode) return;

    // Optimistic counting: use local start time until snapshot arrives.
    if (optimisticRunning && optimisticStartRef.current) {
      const opt = optimisticStartRef.current;
      const compute = () => opt.accumulated + Math.floor((Date.now() - opt.startedAt) / 1000);
      setDisplayElapsed(compute());
      const id = setInterval(() => setDisplayElapsed(compute()), 1000);
      return () => clearInterval(id);
    }

    if (!session) {
      setDisplayElapsed(0);
      return;
    }

    const compute = () => computeElapsed(session);
    setDisplayElapsed(compute());

    if (session.status !== "running") return;

    const id = setInterval(() => setDisplayElapsed(compute()), 1000);
    return () => clearInterval(id);
  }, [session, isDemoMode, optimisticRunning]);

  // ── Demo mode: local interval ──────────────────────────────────────────────
  useEffect(() => {
    if (!isDemoMode) return;
    if (!localRunning) {
      if (localIntervalRef.current) { clearInterval(localIntervalRef.current); localIntervalRef.current = null; }
      return;
    }
    const intervalMs = IS_DEV ? Math.max(50, Math.round(1000 / speedMultiplier)) : 1000;
    localIntervalRef.current = setInterval(() => setLocalElapsed((p) => p + 1), intervalMs);
    return () => { if (localIntervalRef.current) { clearInterval(localIntervalRef.current); localIntervalRef.current = null; } };
  }, [isDemoMode, localRunning, speedMultiplier]);

  // ── Timer actions ─────────────────────────────────────────────────────────

  function handleBranchSelect(value: string) {
    if (isDemoMode) {
      setLocalBranch(value);
      setLocalRunning(false);
      setLocalElapsed(0);
    } else {
      setPendingBranch(value);
      setDisplayElapsed(0);
      // Clear any existing session when switching branch
      if (session && user) resetTimer(user.uid);
    }
  }

  async function handleStart() {
    if (isDemoMode) {
      setLocalRunning(true);
      return;
    }
    const branch = selectedBranch;
    if (!branch || !user) return;
    // Start counting immediately — don't wait for Firestore round-trip.
    optimisticStartRef.current = { startedAt: Date.now(), accumulated: displayElapsed };
    setOptimisticRunning(true);
    try {
      await startTimer(user.uid, branch, displayElapsed);
      // session snapshot will arrive and seamlessly replace optimistic state.
    } catch {
      optimisticStartRef.current = null;
      setOptimisticRunning(false);
      toast.error("Zamanlayici baslatilamadi. Lutfen tekrar deneyin.");
    }
  }

  async function handlePause() {
    if (isDemoMode) {
      setLocalRunning(false);
      return;
    }
    if (!user || !session) return;
    optimisticStartRef.current = null;
    setOptimisticRunning(false);
    await pauseTimer(user.uid, displayElapsed);
  }

  async function handleReset() {
    if (isDemoMode) {
      setLocalRunning(false);
      setLocalElapsed(0);
      return;
    }
    optimisticStartRef.current = null;
    setOptimisticRunning(false);
    setDisplayElapsed(0);
    setPendingBranch(null);
    if (user && session) await resetTimer(user.uid);
  }

  // ── Derived display values ─────────────────────────────────────────────────
  const phaseColor = PHASE_COLORS[phase];
  const dangerSeconds = timing ? getDangerSeconds(timing) : 0;
  const remaining = timing ? Math.max(0, timing.idealSeconds - elapsed) : 0;
  const overtime = timing && elapsed > timing.idealSeconds ? elapsed - timing.idealSeconds : 0;

  const tytBranches = Object.entries(BRANCH_TIMINGS).filter(([k]) => k.startsWith("tyt_"));
  const aytBranches = Object.entries(BRANCH_TIMINGS).filter(([k]) => k.startsWith("ayt_"));

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* ─── Background Glow Layer ──────────────────────────────── */}
      <div className="fixed inset-0 -z-10 overflow-hidden" style={{ top: "3.5rem" }}>
        <div
          className="absolute inset-0 transition-all duration-[3000ms] ease-in-out"
          style={{
            background: selectedBranch && (isRunning || elapsed > 0)
              ? `radial-gradient(ellipse 80% 60% at 50% 40%, oklch(${0.14 + intensity * 0.04} ${phaseColor.chroma * 0.3} ${phaseColor.hue} / 0.6) 0%, oklch(0.12 0.012 265) 100%)`
              : undefined,
          }}
        />

        {selectedBranch && (isRunning || elapsed > 0) && (
          <>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <GlowOrb key={i} phase={phase} index={i} intensity={intensity} />
            ))}
          </>
        )}
      </div>

      {/* ─── Content ──────────────────────────────────────────────── */}
      <main className="relative z-10 max-w-2xl mx-auto px-4 pt-10 pb-20 flex flex-col items-center gap-8">
        {/* Title */}
        <div className="text-center space-y-2 animate-fade-in-up">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Timer className="w-5 h-5" />
            <span className="text-sm font-medium tracking-wide uppercase">Branş Kronometresi</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Deneme Zamanlayıcı</h1>
          {!isDemoMode && (
            <p className="text-xs text-muted-foreground/60">
              Zamanlayıcı bulutta çalışır — ekranı kapatsanız bile süre sayılmaya devam eder
            </p>
          )}
        </div>

        {/* Branch Selector */}
        <div className="w-full max-w-md animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <Select
            value={selectedBranch ?? undefined}
            onValueChange={handleBranchSelect}
            disabled={isRunning}
          >
            <SelectTrigger
              className={cn(
                "h-12 w-full rounded-xl border border-white/15 bg-white/8 px-4 text-left text-sm font-medium",
                "transition-all duration-200 hover:bg-white/12 hover:border-white/22",
                "focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:border-primary/30",
                "data-[placeholder]:text-muted-foreground",
                selectedBranch ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <SelectValue placeholder="Branş seçin..." />
            </SelectTrigger>
            <SelectContent
              position="popper"
              align="start"
              sideOffset={8}
              className="z-[120] max-h-72 w-[var(--radix-select-trigger-width)] rounded-xl border border-white/15 bg-[oklch(0.19_0.018_265)] p-2 text-foreground shadow-[0_8px_40px_oklch(0_0_0_/_0.5)]"
            >
              <SelectGroup>
                <SelectLabel className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">TYT</SelectLabel>
                {tytBranches.map(([key, val]) => (
                  <SelectItem
                    key={key}
                    value={key}
                    className="cursor-pointer rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-white/8 data-[state=checked]:bg-primary/15 data-[state=checked]:text-primary"
                  >
                    <span className="flex w-full items-center justify-between gap-3">
                      <span>{val.label}</span>
                      <span className="text-xs text-muted-foreground">{val.idealSeconds / 60} dk</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel className="mt-1 px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">AYT</SelectLabel>
                {aytBranches.map(([key, val]) => (
                  <SelectItem
                    key={key}
                    value={key}
                    className="cursor-pointer rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-white/8 data-[state=checked]:bg-primary/15 data-[state=checked]:text-primary"
                  >
                    <span className="flex w-full items-center justify-between gap-3">
                      <span>{val.label}</span>
                      <span className="text-xs text-muted-foreground">{val.idealSeconds / 60} dk</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Timer Display */}
        <div className="flex flex-col items-center gap-6 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          {/* Phase badge */}
          {selectedBranch && (isRunning || elapsed > 0) && (
            <div
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-1000",
                phase === "focus" && "bg-teal-500/15 text-teal-400 border border-teal-500/20",
                phase === "warning" && "bg-amber-500/15 text-amber-400 border border-amber-500/20",
                phase === "danger" && "bg-red-500/15 text-red-400 border border-red-500/20 animate-pulse",
              )}
            >
              {phaseColor.name}
            </div>
          )}

          {/* Time */}
          <div className="relative">
            <span
              className={cn(
                "font-mono text-8xl md:text-9xl font-bold tracking-tighter tabular-nums transition-colors duration-1000",
                !selectedBranch && "text-muted-foreground/30",
                phase === "focus" && selectedBranch && "text-teal-300",
                phase === "warning" && "text-amber-300",
                phase === "danger" && "text-red-400",
              )}
              style={
                phase === "danger" && elapsed > 0
                  ? { textShadow: `0 0 40px oklch(0.65 0.23 25 / ${0.3 + intensity * 0.3})` }
                  : phase === "warning" && elapsed > 0
                  ? { textShadow: `0 0 30px oklch(0.75 0.18 55 / ${0.2 + intensity * 0.2})` }
                  : phase === "focus" && elapsed > 0
                  ? { textShadow: `0 0 20px oklch(0.7 0.15 180 / 0.15)` }
                  : undefined
              }
            >
              {formatTime(elapsed)}
            </span>
          </div>

          {/* Sub info */}
          {selectedBranch && timing && (isRunning || elapsed > 0) && (
            <div className="flex items-center gap-4 text-sm">
              {overtime > 0 ? (
                <span className={cn(
                  "font-medium animate-pulse",
                  phase === "warning" ? "text-amber-400" : "text-red-400"
                )}>
                  Süre aşımı: +{formatTime(overtime)}
                </span>
              ) : (
                <span className="text-muted-foreground">
                  Kalan: <span className={cn(
                    "font-medium",
                    phase === "focus" && "text-teal-400",
                    phase === "warning" && "text-amber-400",
                  )}>{formatTime(remaining)}</span>
                </span>
              )}
              <span className="text-muted-foreground/50">•</span>
              <span className="text-muted-foreground">
                İdeal: {timing.idealSeconds / 60} dk
              </span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          {!isRunning ? (
            <Button
              size="lg"
              onClick={handleStart}
              disabled={!selectedBranch}
              className={cn(
                "rounded-full px-8 h-14 text-base font-semibold gap-2 transition-all duration-300",
                "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70",
                "shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30",
                "disabled:opacity-30 disabled:shadow-none"
              )}
            >
              <Play className="w-5 h-5" />
              {elapsed > 0 ? "Devam Et" : "Başlat"}
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={handlePause}
              variant="secondary"
              className="rounded-full px-8 h-14 text-base font-semibold gap-2 bg-white/10 hover:bg-white/15 border border-white/10"
            >
              <Pause className="w-5 h-5" />
              Duraklat
            </Button>
          )}

          {/* Save button — visible when paused with elapsed time */}
          {!isRunning && elapsed > 0 && selectedBranch && (
            <Button
              size="lg"
              onClick={() => setShowSave(true)}
              variant="secondary"
              className="rounded-full px-6 h-14 text-base font-semibold gap-2 bg-primary/12 hover:bg-primary/20 border border-primary/25 text-primary shadow-none"
            >
              <BookPlus className="w-5 h-5" />
              Kaydet
            </Button>
          )}

          {(elapsed > 0 || isRunning) && (
            <Button
              size="lg"
              variant="ghost"
              onClick={handleReset}
              className="rounded-full h-14 w-14 p-0 text-muted-foreground hover:text-foreground hover:bg-white/10"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Progress bar */}
        {selectedBranch && timing && (isRunning || elapsed > 0) && (
          <div className="w-full max-w-md animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
            <div className="relative h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                className={cn(
                  "absolute inset-y-0 left-0 rounded-full transition-all duration-500",
                  phase === "focus" && "bg-gradient-to-r from-teal-500 to-teal-400",
                  phase === "warning" && "bg-gradient-to-r from-amber-500 to-amber-400",
                  phase === "danger" && "bg-gradient-to-r from-red-500 to-red-400",
                )}
                style={{ width: `${Math.min((elapsed / dangerSeconds) * 100, 100)}%` }}
              />
              <div
                className="absolute top-0 bottom-0 w-px bg-white/20"
                style={{ left: `${(timing.warningSeconds / dangerSeconds) * 100}%` }}
              />
              <div
                className="absolute top-0 bottom-0 w-px bg-white/30"
                style={{ left: `${(timing.idealSeconds / dangerSeconds) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-xs text-muted-foreground/60">
              <span>0:00</span>
              <span>{formatTime(timing.warningSeconds)}</span>
              <span className="text-muted-foreground/80">{formatTime(timing.idealSeconds)}</span>
              <span className="text-red-500/60">{formatTime(dangerSeconds)}</span>
            </div>
          </div>
        )}

        {/* Branch info card (when not started) */}
        {selectedBranch && timing && !isRunning && elapsed === 0 && (
          <div className="w-full max-w-md glass-card rounded-xl p-5 space-y-3 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <h3 className="text-sm font-semibold text-foreground">{timing.label} — Süre Bilgisi</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-lg bg-teal-500/8 border border-teal-500/15">
                <div className="text-xs text-teal-400/80 mb-1">Odak</div>
                <div className="text-sm font-bold text-teal-300">0 — {Math.floor(timing.warningSeconds / 60)} dk</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-amber-500/8 border border-amber-500/15">
                <div className="text-xs text-amber-400/80 mb-1">Uyarı</div>
                <div className="text-sm font-bold text-amber-300">{Math.floor(timing.warningSeconds / 60)} — {Math.round(getDangerSeconds(timing) / 60)} dk</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-red-500/8 border border-red-500/15">
                <div className="text-xs text-red-400/80 mb-1">Tehlike</div>
                <div className="text-sm font-bold text-red-300">{Math.round(getDangerSeconds(timing) / 60)} dk+</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground/60 text-center">
              İdeal süre {timing.idealSeconds / 60} dk — {Math.round((DANGER_THRESHOLD_RATIO - 1) * 100)}% tolerans tamponu var
            </p>
          </div>
        )}
      </main>

      {/* ─── Save Log Dialog ─── */}
      {selectedBranch && (
        <SaveLogDialog
          open={showSave}
          onClose={() => setShowSave(false)}
          elapsedSeconds={elapsed}
          branchKey={selectedBranch}
          onSave={async (net, notes) => {
            const uid = user?.uid ?? DEMO_UID;
            const durationMinutes = Math.max(1, Math.round(elapsed / 60));
            await addExamLog(uid, {
              examType: selectedBranch.startsWith("ayt_") ? "ayt" : "tyt",
              examCategory: "brans",
              date: format(new Date(), "yyyy-MM-dd"),
              subject: selectedBranch,
              net,
              durationMinutes,
              notes,
            });
            toast.success("Deneme kaydedildi!");
            if (isDemoMode) {
              setLocalRunning(false);
              setLocalElapsed(0);
            } else {
              setDisplayElapsed(0);
              setPendingBranch(null);
              if (user) await resetTimer(user.uid);
            }
          }}
        />
      )}

      {/* ─── Dev Speed Panel (dev server only) ─── */}
      {IS_DEV && isDemoMode && (
        <DevSpeedPanel speed={speedMultiplier} onSpeedChange={setSpeedMultiplier} />
      )}
    </div>
  );
}
