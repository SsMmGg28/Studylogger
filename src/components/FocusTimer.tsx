"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Timer, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

// Danger starts at 115% of ideal time — gives a 15% buffer past ideal where warning still shows
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
    // In danger zone: 0-1 maps to dangerSeconds..dangerSeconds*1.5
    return Math.min((elapsed - dangerSeconds) / (dangerSeconds * 0.5), 1);
  }
  if (elapsed >= timing.warningSeconds) {
    return (elapsed - timing.warningSeconds) / (dangerSeconds - timing.warningSeconds);
  }
  return elapsed / timing.warningSeconds;
}

// Phase color configs (hue in oklch)
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

  // Position orbs around the screen
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

// ─── Main Component ─────────────────────────────────────────────────────────
export default function FocusTimer() {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [showSelector, setShowSelector] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const elapsedBeforePause = useRef<number>(0);

  const timing = selectedBranch ? BRANCH_TIMINGS[selectedBranch] : null;
  const phase: Phase = timing ? getPhase(elapsed, timing) : "focus";
  const intensity = timing ? getPhaseProgress(elapsed, timing) : 0;

  const start = useCallback(() => {
    if (!selectedBranch) return;
    startTimeRef.current = Date.now();
    elapsedBeforePause.current = elapsed;
    setIsRunning(true);
  }, [selectedBranch, elapsed]);

  const pause = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    pause();
    setElapsed(0);
    elapsedBeforePause.current = 0;
  }, [pause]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const diff = Math.floor((now - startTimeRef.current) / 1000);
        setElapsed(elapsedBeforePause.current + diff);
      }, 200);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  // Phase label & remaining info
  const phaseColor = PHASE_COLORS[phase];
  const dangerSeconds = timing ? getDangerSeconds(timing) : 0;
  const remaining = timing ? Math.max(0, timing.idealSeconds - elapsed) : 0;
  // overtime shown once past ideal, but color follows phase (amber in buffer zone, red in danger)
  const overtime = timing && elapsed > timing.idealSeconds ? elapsed - timing.idealSeconds : 0;

  // Group branches
  const tytBranches = Object.entries(BRANCH_TIMINGS).filter(([k]) => k.startsWith("tyt_"));
  const aytBranches = Object.entries(BRANCH_TIMINGS).filter(([k]) => k.startsWith("ayt_"));

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* ─── Background Glow Layer ──────────────────────────────── */}
      <div className="fixed inset-0 -z-10 overflow-hidden" style={{ top: "3.5rem" }}>
        {/* Base gradient that shifts with phase */}
        <div
          className="absolute inset-0 transition-all duration-[3000ms] ease-in-out"
          style={{
            background: selectedBranch && (isRunning || elapsed > 0)
              ? `radial-gradient(ellipse 80% 60% at 50% 40%, oklch(${0.14 + intensity * 0.04} ${phaseColor.chroma * 0.3} ${phaseColor.hue} / 0.6) 0%, oklch(0.12 0.012 265) 100%)`
              : undefined,
          }}
        />

        {/* Glowing orbs */}
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
        </div>

        {/* Branch Selector */}
        <div className="w-full max-w-md animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div className="relative">
            <button
              onClick={() => setShowSelector(!showSelector)}
              disabled={isRunning}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl",
                "bg-white/5 border border-white/10 backdrop-blur-sm",
                "text-left transition-all duration-200",
                "hover:bg-white/8 hover:border-white/15",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                selectedBranch ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <span className="text-sm font-medium">
                {selectedBranch ? BRANCH_TIMINGS[selectedBranch].label : "Branş seçin..."}
              </span>
              <ChevronDown className={cn("w-4 h-4 transition-transform", showSelector && "rotate-180")} />
            </button>

            {showSelector && (
              <div className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-card/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden z-50 animate-fade-in">
                <div className="p-2 max-h-80 overflow-y-auto">
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">TYT</div>
                  {tytBranches.map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => { setSelectedBranch(key); setShowSelector(false); reset(); }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                        selectedBranch === key ? "bg-primary/15 text-primary" : "hover:bg-white/5 text-foreground"
                      )}
                    >
                      <span>{val.label}</span>
                      <span className="text-xs text-muted-foreground">{val.idealSeconds / 60} dk</span>
                    </button>
                  ))}
                  <div className="px-2 py-1.5 mt-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">AYT</div>
                  {aytBranches.map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => { setSelectedBranch(key); setShowSelector(false); reset(); }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                        selectedBranch === key ? "bg-primary/15 text-primary" : "hover:bg-white/5 text-foreground"
                      )}
                    >
                      <span>{val.label}</span>
                      <span className="text-xs text-muted-foreground">{val.idealSeconds / 60} dk</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
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
        <div className="flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          {!isRunning ? (
            <Button
              size="lg"
              onClick={start}
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
              onClick={pause}
              variant="secondary"
              className="rounded-full px-8 h-14 text-base font-semibold gap-2 bg-white/10 hover:bg-white/15 border border-white/10"
            >
              <Pause className="w-5 h-5" />
              Duraklat
            </Button>
          )}

          {(elapsed > 0 || isRunning) && (
            <Button
              size="lg"
              variant="ghost"
              onClick={reset}
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
              {/* Warning threshold marker */}
              <div
                className="absolute top-0 bottom-0 w-px bg-white/20"
                style={{ left: `${(timing.warningSeconds / dangerSeconds) * 100}%` }}
              />
              {/* Ideal time marker */}
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
    </div>
  );
}
