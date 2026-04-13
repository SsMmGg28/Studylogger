"use client";

import { useMemo, useEffect } from "react";
import Link from "next/link";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { tr } from "date-fns/locale";
import { PlusCircle, Clock, Hash, TrendingUp, BookOpen } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import LogCard from "@/components/LogCard";
import SubjectChart from "@/components/SubjectChart";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import WeeklyBarChart from "@/components/WeeklyBarChart";
import ExamCountdown from "@/components/ExamCountdown";
import StreakBadge from "@/components/StreakBadge";
import GoalCard from "@/components/GoalCard";
import RevisionSuggestions from "@/components/RevisionSuggestions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useStudyLogs } from "@/hooks/useStudyLogs";
import { useGoals } from "@/hooks/useGoals";
import { aggregateBySubject } from "@/lib/db";
import { checkStudyReminder, checkStreakWarning, sendLocalNotification } from "@/lib/notifications";

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <Card className="group hover:border-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5">
      <CardContent className="p-5 flex items-center gap-4">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-colors">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
          <p className="text-xl font-bold leading-tight tracking-tight mt-0.5">{value}</p>
          {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const { logs, loading } = useStudyLogs(user?.uid ?? null);
  const { goals } = useGoals(user?.uid ?? null);

  const now = new Date();
  const weekStart = format(startOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd");
  const weekEnd = format(endOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd");
  const monthStart = format(
    new Date(now.getFullYear(), now.getMonth(), 1),
    "yyyy-MM-dd"
  );

  const weekLogs = useMemo(
    () => logs.filter((l) => l.date >= weekStart && l.date <= weekEnd),
    [logs, weekStart, weekEnd]
  );
  const monthLogs = useMemo(
    () => logs.filter((l) => l.date >= monthStart),
    [logs, monthStart]
  );
  const allBySubject = useMemo(() => aggregateBySubject(logs), [logs]);
  const weekBySubject = useMemo(() => aggregateBySubject(weekLogs), [weekLogs]);

  const weekMins = weekLogs.reduce((s, l) => s + l.durationMinutes, 0);
  const weekQs = weekLogs.reduce((s, l) => s + l.questionCount, 0);
  const monthMins = monthLogs.reduce((s, l) => s + l.durationMinutes, 0);
  const totalMins = logs.reduce((s, l) => s + l.durationMinutes, 0);

  function fmtMins(m: number) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    return h > 0 ? `${h}s ${min}dk` : `${min}dk`;
  }

  function getGoalCurrent(goal: { subject: string; metric: "minutes" | "questions"; period: "weekly" | "monthly" }) {
    const agg = goal.period === "weekly" ? weekBySubject : aggregateBySubject(monthLogs);
    const data = agg[goal.subject];
    if (!data) return 0;
    return goal.metric === "minutes" ? data.minutes : data.questions;
  }

  const recentLogs = logs.slice(0, 5);

  // Push notification checks
  useEffect(() => {
    if (loading || logs.length === 0) return;
    const lastDate = logs[0]?.date ?? null;
    if (checkStreakWarning(lastDate)) {
      sendLocalNotification("Serini kaybetme! 🔥", "Bugün henüz çalışmadın. Serini devam ettirmek için bir kayıt ekle.");
    } else if (checkStudyReminder(lastDate)) {
      sendLocalNotification("Hayırla başla! 📚", "Son çalışmandan bu yana uzun zaman geçti. Bugün bir şeyler çalışmaya ne dersin?");
    }
  }, [loading, logs]);

  const greeting = () => {
    const h = now.getHours();
    if (h < 12) return "Günaydın";
    if (h < 18) return "İyi günler";
    return "İyi akşamlar";
  };

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {greeting()},{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {profile?.displayName?.split(" ")[0] ?? "Öğrenci"}
                </span>
                {" "}👋
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {format(now, "d MMMM yyyy, EEEE", { locale: tr })}
              </p>
            </div>
            <Link href="/log">
              <Button className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all">
                <PlusCircle className="w-4 h-4" />
                Çalışma Ekle
              </Button>
            </Link>
          </div>

          {/* YKS Countdown */}
          <ExamCountdown />

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Stats row */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 stagger-children">
                <StatCard
                  icon={Clock}
                  label="Bu Hafta"
                  value={fmtMins(weekMins)}
                  sub={`${weekLogs.length} kayıt`}
                />
                <StatCard
                  icon={Hash}
                  label="Bu Hafta Soru"
                  value={String(weekQs)}
                  sub="toplam"
                />
                <StatCard
                  icon={TrendingUp}
                  label="Bu Ay"
                  value={fmtMins(monthMins)}
                  sub={`${monthLogs.length} kayıt`}
                />
                <StatCard
                  icon={BookOpen}
                  label="Toplam"
                  value={fmtMins(totalMins)}
                  sub={`${logs.length} kayıt`}
                />
                {/* Streak card */}
                <Card className="col-span-2 lg:col-span-1 hover:border-primary/20 transition-all duration-300 hover:-translate-y-0.5">
                  <CardContent className="p-5 flex items-center h-full">
                    <StreakBadge logs={logs} />
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                {/* Left column: Pie + bar */}
                <div className="lg:col-span-1 space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-[13px] font-semibold text-muted-foreground tracking-wide uppercase">
                        Ders Dağılımı
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="week">
                        <TabsList className="mb-2 h-7">
                          <TabsTrigger value="week" className="text-xs">
                            Bu Hafta
                          </TabsTrigger>
                          <TabsTrigger value="all" className="text-xs">
                            Tümü
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="week">
                          <SubjectChart data={weekBySubject} />
                        </TabsContent>
                        <TabsContent value="all">
                          <SubjectChart data={allBySubject} />
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-[13px] font-semibold text-muted-foreground tracking-wide uppercase">
                        Günlük Dağılım (Bu Hafta)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <WeeklyBarChart logs={weekLogs} />
                    </CardContent>
                  </Card>
                </div>

                {/* Right column */}
                <div className="lg:col-span-2 space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-[13px] font-semibold text-muted-foreground tracking-wide uppercase">
                        Çalışma Takvimi (Son 15 Hafta)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <WeeklyCalendar logs={logs} weeks={15} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-[13px] font-semibold text-muted-foreground tracking-wide uppercase">
                        Hedeflerim
                      </CardTitle>
                      <Link
                        href="/goals"
                        className="text-xs text-primary hover:underline"
                      >
                        Tümünü Gör →
                      </Link>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {goals.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground text-sm">
                          Henüz hedef yok.{" "}
                          <Link href="/goals" className="text-primary hover:underline">
                            Hedef belirle!
                          </Link>
                        </div>
                      ) : (
                        goals.slice(0, 3).map((goal) => (
                          <GoalCard key={goal.id} goal={goal} current={getGoalCurrent(goal)} />
                        ))
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-[13px] font-semibold text-muted-foreground tracking-wide uppercase">
                        Son Kayıtlar
                      </CardTitle>
                      <Link
                        href="/history"
                        className="text-xs text-primary hover:underline"
                      >
                        Tümünü Gör →
                      </Link>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {recentLogs.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground text-sm">
                          Henüz kayıt yok.{" "}
                          <Link
                            href="/log"
                            className="text-primary hover:underline"
                          >
                            İlk çalışmanı ekle!
                          </Link>
                        </div>
                      ) : (
                        recentLogs.map((log) => (
                          <LogCard key={log.id} log={log} />
                        ))
                      )}
                    </CardContent>
                  </Card>

                  <RevisionSuggestions logs={logs} />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}

