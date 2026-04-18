"use client";

import { useState, useEffect, useMemo } from "react";
import { BarChart3, FileText, TrendingUp, Clock, Hash, BookOpen, Award } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import TopicBreakdownChart from "@/components/TopicBreakdownChart";
import EfficiencyCard from "@/components/EfficiencyCard";
import ExamTrendChart from "@/components/ExamTrendChart";
import { useAuth } from "@/hooks/useAuth";
import { useStudyLogs } from "@/hooks/useStudyLogs";
import { getUserExamLogs } from "@/lib/db";
import type { ExamLog } from "@/lib/db";
import { SUBJECT_MAP } from "@/lib/subjects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export default function StatsPage() {
  const { user } = useAuth();
  const { logs, loading } = useStudyLogs(user?.uid ?? null);
  const [examLogs, setExamLogs] = useState<ExamLog[]>([]);
  const [examLoading, setExamLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    // Check if demo mode
    const isDemo = typeof window !== "undefined" && localStorage.getItem("demo-mode") === "true";
    if (isDemo) {
      setExamLogs([]);
      setExamLoading(false);
      return;
    }
    getUserExamLogs(user.uid).then((data) => {
      setExamLogs(data);
      setExamLoading(false);
    }).catch(() => setExamLoading(false));
  }, [user?.uid]);

  const totalMins = logs.reduce((s, l) => s + l.durationMinutes, 0);
  const totalQs = logs.reduce((s, l) => s + l.questionCount, 0);

  // Today's stats
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayLogs = useMemo(() => logs.filter((l) => l.date === todayStr), [logs, todayStr]);
  const todayMins = todayLogs.reduce((s, l) => s + l.durationMinutes, 0);
  const todayQs = todayLogs.reduce((s, l) => s + l.questionCount, 0);

  // Exam stats
  const tamExams = useMemo(() => examLogs.filter((e) => e.examCategory === "tam"), [examLogs]);
  const bransExams = useMemo(() => examLogs.filter((e) => e.examCategory === "brans"), [examLogs]);

  // Group branch exams by subject
  const bransStatsBySubject = useMemo(() => {
    const map: Record<string, { exams: ExamLog[]; totalNet: number; avgNet: number; bestNet: number }> = {};
    for (const e of bransExams) {
      const sid = e.subject ?? "unknown";
      if (!map[sid]) map[sid] = { exams: [], totalNet: 0, avgNet: 0, bestNet: -Infinity };
      map[sid].exams.push(e);
      const net = e.net ?? 0;
      map[sid].totalNet += net;
      if (net > map[sid].bestNet) map[sid].bestNet = net;
    }
    for (const key of Object.keys(map)) {
      map[key].avgNet = map[key].exams.length > 0 ? map[key].totalNet / map[key].exams.length : 0;
    }
    return map;
  }, [bransExams]);

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-6 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">İstatistikler</h1>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <Tabs defaultValue="study" className="space-y-6">
              <TabsList className="h-9">
                <TabsTrigger value="study" className="text-sm gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  Çalışma İstatistikleri
                </TabsTrigger>
                <TabsTrigger value="exam" className="text-sm gap-1.5">
                  <FileText className="w-4 h-4" />
                  Deneme İstatistikleri
                </TabsTrigger>
              </TabsList>

              {/* ─── Study Statistics Tab ─── */}
              <TabsContent value="study" className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <MiniStatCard icon={Clock} label="Toplam Çalışma" value={formatMins(totalMins)} />
                  <MiniStatCard icon={Hash} label="Toplam Soru" value={String(totalQs)} />
                  <MiniStatCard icon={Clock} label="Bugün Süre" value={formatMins(todayMins)} highlight />
                  <MiniStatCard icon={Hash} label="Bugün Soru" value={String(todayQs)} highlight />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="lg:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-[13px] font-semibold text-muted-foreground tracking-wide uppercase">
                        Konu Bazlı Dağılım
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <TopicBreakdownChart logs={logs} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-[13px] font-semibold text-muted-foreground tracking-wide uppercase">
                        Verimlilik Trendi (12 Hafta)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <EfficiencyCard logs={logs} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-[13px] font-semibold text-muted-foreground tracking-wide uppercase">
                        Genel Özet
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <SummaryRow label="Toplam Çalışma" value={formatMins(totalMins)} />
                        <SummaryRow label="Toplam Soru" value={String(totalQs)} />
                        <SummaryRow label="Bugün Süre" value={formatMins(todayMins)} />
                        <SummaryRow label="Bugün Soru" value={String(todayQs)} />
                        <SummaryRow label="Toplam Kayıt" value={String(logs.length)} />
                        <SummaryRow
                          label="Genel Verimlilik"
                          value={
                            totalMins > 0
                              ? `${(totalQs / totalMins).toFixed(2)} soru/dk`
                              : "—"
                          }
                        />
                        <SummaryRow
                          label="Farklı Ders"
                          value={String(new Set(logs.map((l) => l.subject)).size)}
                        />
                        <SummaryRow
                          label="Farklı Konu"
                          value={String(new Set(logs.map((l) => `${l.subject}:${l.topic}`)).size)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* ─── Exam Statistics Tab ─── */}
              <TabsContent value="exam" className="space-y-6">
                {examLoading ? (
                  <div className="flex justify-center py-16">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : examLogs.length === 0 ? (
                  <Card>
                    <CardContent className="py-16 text-center">
                      <FileText className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
                      <p className="text-muted-foreground">Henüz deneme kaydı bulunmuyor.</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        Kayıt Ekle sayfasından &quot;Deneme Sınavı&quot; sekmesini kullanarak deneme ekleyebilirsiniz.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {/* Exam summary cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <MiniStatCard icon={FileText} label="Toplam Deneme" value={String(examLogs.length)} />
                      <MiniStatCard icon={BookOpen} label="Tam Deneme" value={String(tamExams.length)} />
                      <MiniStatCard icon={Award} label="Branş Deneme" value={String(bransExams.length)} />
                      <MiniStatCard
                        icon={TrendingUp}
                        label="En İyi Toplam Net"
                        value={
                          tamExams.length > 0
                            ? String(Math.max(...tamExams.map((e) => e.totalNet ?? 0)).toFixed(1))
                            : "—"
                        }
                      />
                    </div>

                    {/* Tam Deneme Grafikleri */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-[13px] font-semibold text-muted-foreground tracking-wide uppercase">
                            TYT Net Gelişimi
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ExamTrendChart exams={tamExams} type="tyt" />
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-[13px] font-semibold text-muted-foreground tracking-wide uppercase">
                            AYT Net Gelişimi
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ExamTrendChart exams={tamExams} type="ayt" />
                        </CardContent>
                      </Card>
                    </div>

                    {/* Tam Deneme Stats */}
                    {tamExams.length > 0 && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-[13px] font-semibold text-muted-foreground tracking-wide uppercase">
                            Tam Deneme Sonuçları
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                              {tamExams
                                .slice()
                                .sort((a, b) => b.date.localeCompare(a.date))
                                .map((exam) => (
                                <div
                                  key={exam.id}
                                className="p-4 rounded-xl border border-border/50 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                                      {exam.examType.toUpperCase()}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      {format(new Date(exam.date), "d MMMM yyyy", { locale: tr })}
                                    </span>
                                  </div>
                                  <span className="text-lg font-bold text-primary">
                                    {exam.totalNet?.toFixed(1)} net
                                  </span>
                                </div>
                                {exam.subjectNets && (
                                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                                    {Object.entries(exam.subjectNets).map(([subjectId, net]) => {
                                      const subj = SUBJECT_MAP[subjectId];
                                      return (
                                        <div key={subjectId} className="flex items-center gap-1.5 text-xs">
                                          <span
                                            className="w-2 h-2 rounded-full shrink-0"
                                            style={{ backgroundColor: subj?.color ?? "#666" }}
                                          />
                                          <span className="text-muted-foreground truncate">
                                            {subj?.label ?? subjectId}
                                          </span>
                                          <span className="font-semibold ml-auto tabular-nums">{net}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                                {exam.notes && (
                                  <p className="text-xs text-muted-foreground mt-2 border-t border-border/30 pt-2">
                                    {exam.notes}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Branş Deneme Stats */}
                    {bransExams.length > 0 && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-[13px] font-semibold text-muted-foreground tracking-wide uppercase">
                            Branş Deneme Sonuçları
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            {/* Subject-level summary */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {Object.entries(bransStatsBySubject).map(([subjectId, stats]) => {
                                const subj = SUBJECT_MAP[subjectId];
                                return (
                                  <div
                                    key={subjectId}
                                    className="p-4 rounded-xl border border-border/50 bg-white/[0.02]"
                                  >
                                    <div className="flex items-center gap-2 mb-3">
                                      <span
                                        className="w-3 h-3 rounded-full shrink-0"
                                        style={{ backgroundColor: subj?.color ?? "#666" }}
                                      />
                                      <span className="text-sm font-semibold">
                                        {subj?.label ?? subjectId}
                                      </span>
                                      <span className="text-xs text-muted-foreground ml-auto">
                                        {stats.exams.length} deneme
                                      </span>
                                    </div>
                                    <div className="space-y-1.5">
                                      <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">Ort. Net</span>
                                        <span className="font-semibold">{stats.avgNet.toFixed(1)}</span>
                                      </div>
                                      <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">En İyi</span>
                                        <span className="font-semibold text-green-500">{stats.bestNet.toFixed(1)}</span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Individual branch exams */}
                            <div className="space-y-2">
                              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                Tüm Branş Denemeleri
                              </p>
                              {bransExams.map((exam) => {
                                const subj = SUBJECT_MAP[exam.subject ?? ""];
                                return (
                                  <div
                                    key={exam.id}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border/50 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                                  >
                                    <span
                                      className="w-2.5 h-2.5 rounded-full shrink-0"
                                      style={{ backgroundColor: subj?.color ?? "#666" }}
                                    />
                                    <span className="text-sm font-medium flex-1">
                                      {subj?.label ?? exam.subject}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {format(new Date(exam.date), "d MMM yyyy", { locale: tr })}
                                    </span>
                                    <span className="text-sm font-bold tabular-nums min-w-[4rem] text-right">
                                      {exam.net} net
                                    </span>
                                    {exam.durationMinutes && (
                                      <span className="text-xs text-muted-foreground tabular-nums">
                                        {exam.durationMinutes} dk
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Tam Deneme Net Trend */}
                    {tamExams.length >= 2 && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-[13px] font-semibold text-muted-foreground tracking-wide uppercase">
                            Tam Deneme Net Trendi
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ExamNetTrendChart exams={tamExams} />
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}

// ─── Mini Stat Card ───────────────────────────────────────────────────────────

function MiniStatCard({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <Card className={`group hover:border-primary/20 transition-all duration-300 hover:-translate-y-0.5 ${highlight ? "border-primary/15 bg-primary/[0.03]" : ""}`}>
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`p-2 rounded-xl ${highlight ? "bg-primary/15" : "bg-white/5"}`}>
          <Icon className={`w-4 h-4 ${highlight ? "text-primary" : "text-muted-foreground"}`} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
          <p className="text-lg font-bold leading-tight tracking-tight mt-0.5">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Summary Row ──────────────────────────────────────────────────────────────

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}

// ─── Exam Net Trend Chart (pure CSS/SVG) ──────────────────────────────────────

function ExamNetTrendChart({ exams }: { exams: ExamLog[] }) {
  const sorted = [...exams].sort((a, b) => (a.date < b.date ? -1 : 1));
  const maxNet = Math.max(...sorted.map((e) => e.totalNet ?? 0), 1);
  const chartHeight = 160;

  return (
    <div className="relative" style={{ height: chartHeight + 40 }}>
      {/* Grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
        <div
          key={pct}
          className="absolute left-10 right-0 border-t border-white/5"
          style={{ top: chartHeight * (1 - pct) }}
        >
          <span className="absolute -left-10 -top-2.5 text-[10px] text-muted-foreground tabular-nums w-9 text-right">
            {Math.round(maxNet * pct)}
          </span>
        </div>
      ))}

      <svg
        className="absolute left-10 top-0"
        style={{ width: "calc(100% - 2.5rem)", height: chartHeight }}
        viewBox={`0 0 ${Math.max((sorted.length - 1) * 100, 100)} ${chartHeight}`}
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="examGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </linearGradient>
        </defs>
        {(() => {
          const points = sorted.map((e, i) => ({
            x: sorted.length > 1 ? i * (((sorted.length - 1) * 100) / (sorted.length - 1)) : 50,
            y: chartHeight - ((e.totalNet ?? 0) / maxNet) * chartHeight,
          }));
          if (points.length < 2) return null;
          const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
          const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;
          return (
            <>
              <path d={areaD} fill="url(#examGradient)" />
              <path d={pathD} stroke="#34d399" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </>
          );
        })()}
        {sorted.map((e, i) => (
          <circle
            key={i}
            cx={sorted.length > 1 ? i * (((sorted.length - 1) * 100) / (sorted.length - 1)) : 50}
            cy={chartHeight - ((e.totalNet ?? 0) / maxNet) * chartHeight}
            r="4"
            fill="#34d399"
            stroke="#16182a"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      {/* X labels */}
      <div className="absolute left-10 right-0 flex justify-between" style={{ top: chartHeight + 6 }}>
        {sorted.map((e, i) => (
          <span key={i} className="text-[10px] text-muted-foreground text-center" style={{ width: 0, overflow: "visible" }}>
            {format(new Date(e.date), "d MMM", { locale: tr })}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMins(m: number) {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return h > 0 ? `${h}s ${min}dk` : `${min}dk`;
}
