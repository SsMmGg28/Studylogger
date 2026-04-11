"use client";

import { useState, useMemo } from "react";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import LogCard from "@/components/LogCard";
import StudyLogForm from "@/components/StudyLogForm";
import { useAuth } from "@/hooks/useAuth";
import { useStudyLogs } from "@/hooks/useStudyLogs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import type { StudyLog } from "@/lib/db";
import { toast } from "sonner";
import { Filter, X } from "lucide-react";

export default function HistoryPage() {
  const { user } = useAuth();
  const { logs, loading, update, remove } = useStudyLogs(user?.uid ?? null);
  const [editing, setEditing] = useState<StudyLog | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      if (filterSubject !== "all" && log.subject !== filterSubject) return false;
      if (filterFrom && log.date < filterFrom) return false;
      if (filterTo && log.date > filterTo) return false;
      return true;
    });
  }, [logs, filterSubject, filterFrom, filterTo]);

  const totalMins = filtered.reduce((s, l) => s + l.durationMinutes, 0);
  const totalQs = filtered.reduce((s, l) => s + l.questionCount, 0);
  const totalHours = Math.floor(totalMins / 60);
  const remMins = totalMins % 60;

  async function handleDelete(id: string) {
    if (!confirm("Bu kaydı silmek istediğinden emin misin?")) return;
    await remove(id);
    toast.success("Kayıt silindi.");
  }

  async function handleEditSave(data: Omit<StudyLog, "id" | "uid" | "createdAt">) {
    if (!editing) return;
    setEditLoading(true);
    try {
      await update(editing.id, data);
      toast.success("Kayıt güncellendi.");
      setEditing(null);
    } catch {
      toast.error("Güncelleme başarısız.");
    } finally {
      setEditLoading(false);
    }
  }

  const hasFilters = filterSubject !== "all" || filterFrom || filterTo;

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 space-y-6 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Geçmiş Kayıtlar</h1>
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() => { setFilterSubject("all"); setFilterFrom(""); setFilterTo(""); }}
              >
                <X className="w-4 h-4 mr-1" /> Filtreyi Temizle
              </Button>
            )}
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Select value={filterSubject} onValueChange={setFilterSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tüm Dersler" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Dersler</SelectItem>
                    {SUBJECTS.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Başlangıç Tarihi</label>
                  <Input type="date" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Bitiş Tarihi</label>
                  <Input type="date" value={filterTo} onChange={(e) => setFilterTo(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          {filtered.length > 0 && (
            <div className="flex gap-5 text-sm text-muted-foreground px-1">
              <span><strong className="text-foreground font-semibold">{filtered.length}</strong> kayıt</span>
              <span><strong className="text-foreground font-semibold">{totalHours > 0 ? `${totalHours}s ` : ""}{remMins}dk</strong> toplam süre</span>
              {totalQs > 0 && <span><strong className="text-foreground font-semibold">{totalQs}</strong> soru</span>}
            </div>
          )}

          {/* Log list */}
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              {hasFilters ? "Bu filtrelerle eşleşen kayıt bulunamadı." : "Henüz kayıt yok. İlk çalışmanı ekle!"}
            </div>
          ) : (
            <div className="space-y-2 stagger-children">
              {filtered.map((log) => (
                <LogCard key={log.id} log={log} onEdit={setEditing} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Kaydı Düzenle</DialogTitle>
          </DialogHeader>
          {editing && (
            <StudyLogForm
              initial={editing}
              onSubmit={handleEditSave}
              onCancel={() => setEditing(null)}
              loading={editLoading}
            />
          )}
        </DialogContent>
      </Dialog>
    </AuthGuard>
  );
}
