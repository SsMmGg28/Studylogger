"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import StudyLogForm from "@/components/StudyLogForm";
import { useAuth } from "@/hooks/useAuth";
import { useStudyLogs } from "@/hooks/useStudyLogs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import type { StudyLog } from "@/lib/db";

export default function LogPage() {
  const { user } = useAuth();
  const { add } = useStudyLogs(user?.uid ?? null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(data: Omit<StudyLog, "id" | "uid" | "createdAt">) {
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

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold mb-6 tracking-tight">Yeni Çalışma Kaydı</h1>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base text-muted-foreground font-medium">
                Bugün ne çalıştın?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StudyLogForm onSubmit={handleSubmit} loading={loading} />
            </CardContent>
          </Card>
        </main>
      </div>
    </AuthGuard>
  );
}
