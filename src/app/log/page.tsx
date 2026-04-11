"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import StudyLogForm from "@/components/StudyLogForm";
import ExamLogForm from "@/components/ExamLogForm";
import { useAuth } from "@/hooks/useAuth";
import { useStudyLogs } from "@/hooks/useStudyLogs";
import { addExamLog } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import type { StudyLog, ExamLog } from "@/lib/db";

export default function LogPage() {
  const { user } = useAuth();
  const { add } = useStudyLogs(user?.uid ?? null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"calisma" | "deneme">("calisma");
  const router = useRouter();

  async function handleStudySubmit(data: Omit<StudyLog, "id" | "uid" | "createdAt">) {
    setLoading(true);
    try {
      await add(data);
      toast.success("Çalışma kaydedildi!");
      router.push("/");
    } catch {
      toast.error("Kayıt sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  async function handleExamSubmit(data: Omit<ExamLog, "id" | "uid" | "createdAt">) {
    if (!user) return;
    setLoading(true);
    try {
      await addExamLog(user.uid, data);
      toast.success("Deneme kaydedildi!");
      router.push("/");
    } catch {
      toast.error("Kayıt sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold mb-6 tracking-tight">Yeni Kayıt</h1>

          {/* Tab toggle */}
          <div className="flex gap-1 p-1 bg-muted/40 rounded-lg mb-6 border border-border/50">
            <button
              onClick={() => setTab("calisma")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                tab === "calisma"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Çalışma Kaydı
            </button>
            <button
              onClick={() => setTab("deneme")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                tab === "deneme"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Deneme Kaydı
            </button>
          </div>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base text-muted-foreground font-medium">
                {tab === "calisma" ? "Bugün ne çalıştın?" : "Deneme sonucunu kaydet"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tab === "calisma" ? (
                <StudyLogForm onSubmit={handleStudySubmit} loading={loading} />
              ) : (
                <ExamLogForm onSubmit={handleExamSubmit} loading={loading} />
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </AuthGuard>
  );
}

