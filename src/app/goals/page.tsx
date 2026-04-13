"use client";

import { useState, useMemo } from "react";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { Target, Plus } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import GoalCard from "@/components/GoalCard";
import { useAuth } from "@/hooks/useAuth";
import { useGoals } from "@/hooks/useGoals";
import { useStudyLogs } from "@/hooks/useStudyLogs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { SUBJECTS } from "@/lib/subjects";
import { aggregateBySubject } from "@/lib/db";
import { toast } from "sonner";

export default function GoalsPage() {
  const { user } = useAuth();
  const { goals, loading, add, remove } = useGoals(user?.uid ?? null);
  const { logs } = useStudyLogs(user?.uid ?? null);
  const [showAdd, setShowAdd] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newMetric, setNewMetric] = useState<"minutes" | "questions">("minutes");
  const [newPeriod, setNewPeriod] = useState<"weekly" | "monthly">("weekly");
  const [newTarget, setNewTarget] = useState("");
  const [saving, setSaving] = useState(false);

  const now = new Date();
  const weekStart = format(startOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd");
  const weekEnd = format(endOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd");
  const monthStart = format(new Date(now.getFullYear(), now.getMonth(), 1), "yyyy-MM-dd");

  const weekLogs = useMemo(() => logs.filter((l) => l.date >= weekStart && l.date <= weekEnd), [logs, weekStart, weekEnd]);
  const monthLogs = useMemo(() => logs.filter((l) => l.date >= monthStart), [logs, monthStart]);

  const weekBySubject = useMemo(() => aggregateBySubject(weekLogs), [weekLogs]);
  const monthBySubject = useMemo(() => aggregateBySubject(monthLogs), [monthLogs]);

  function getCurrent(goal: { subject: string; metric: "minutes" | "questions"; period: "weekly" | "monthly" }) {
    const agg = goal.period === "weekly" ? weekBySubject : monthBySubject;
    const data = agg[goal.subject];
    if (!data) return 0;
    return goal.metric === "minutes" ? data.minutes : data.questions;
  }

  async function handleAdd() {
    if (!newSubject || !newTarget) return;
    setSaving(true);
    try {
      await add({ subject: newSubject, metric: newMetric, period: newPeriod, target: Number(newTarget) });
      toast.success("Hedef eklendi.");
      setShowAdd(false);
      setNewSubject("");
      setNewTarget("");
    } catch {
      toast.error("Hedef eklenemedi.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu hedefi silmek istediğinden emin misin?")) return;
    await remove(id);
    toast.success("Hedef silindi.");
  }

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 space-y-6 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-7 h-7 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">Hedeflerim</h1>
            </div>
            <Button onClick={() => setShowAdd(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Hedef Ekle
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : goals.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              Henüz hedef yok. Hemen bir hedef belirle!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-children">
              {goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} current={getCurrent(goal)} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Add Goal Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Yeni Hedef</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Ders</Label>
              <Select value={newSubject} onValueChange={setNewSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Ders seçin…" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      <span className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                        {s.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Metrik</Label>
                <Select value={newMetric} onValueChange={(v) => setNewMetric(v as "minutes" | "questions")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutes">Dakika</SelectItem>
                    <SelectItem value="questions">Soru</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Periyot</Label>
                <Select value={newPeriod} onValueChange={(v) => setNewPeriod(v as "weekly" | "monthly")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Haftalık</SelectItem>
                    <SelectItem value="monthly">Aylık</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Hedef</Label>
              <Input
                type="number"
                min="1"
                placeholder={newMetric === "minutes" ? "örn: 300" : "örn: 100"}
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={handleAdd} disabled={saving || !newSubject || !newTarget} className="flex-1">
                {saving ? "Kaydediliyor…" : "Kaydet"}
              </Button>
              <Button variant="outline" onClick={() => setShowAdd(false)}>
                İptal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AuthGuard>
  );
}
