"use client";

import { BarChart3 } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import TopicBreakdownChart from "@/components/TopicBreakdownChart";
import EfficiencyCard from "@/components/EfficiencyCard";
import { useAuth } from "@/hooks/useAuth";
import { useStudyLogs } from "@/hooks/useStudyLogs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatsPage() {
  const { user } = useAuth();
  const { logs, loading } = useStudyLogs(user?.uid ?? null);

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
                    <SummaryRow label="Toplam Çalışma" value={formatMins(logs.reduce((s, l) => s + l.durationMinutes, 0))} />
                    <SummaryRow label="Toplam Soru" value={String(logs.reduce((s, l) => s + l.questionCount, 0))} />
                    <SummaryRow label="Toplam Kayıt" value={String(logs.length)} />
                    <SummaryRow
                      label="Genel Verimlilik"
                      value={
                        logs.reduce((s, l) => s + l.durationMinutes, 0) > 0
                          ? `${(logs.reduce((s, l) => s + l.questionCount, 0) / logs.reduce((s, l) => s + l.durationMinutes, 0)).toFixed(2)} soru/dk`
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
          )}
        </main>
      </div>
    </AuthGuard>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}

function formatMins(m: number) {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return h > 0 ? `${h}s ${min}dk` : `${min}dk`;
}
