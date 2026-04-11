"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { completeGoogleProfile } from "@/lib/auth";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getUserProfile } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SetupUsernamePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const a = auth as typeof auth | undefined;
    if (!a) { setAuthLoading(false); return; }
    const unsub = onAuthStateChanged(a, async (u) => {
      if (!u) {
        router.push("/auth/login");
        return;
      }
      // If profile already exists, go to dashboard
      const profile = await getUserProfile(u.uid);
      if (profile) {
        router.push("/");
        return;
      }
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsub();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      toast.error("Kullanıcı adı 3-20 karakter, sadece harf, rakam ve _ içermeli.");
      return;
    }
    setLoading(true);
    try {
      await completeGoogleProfile(user, username);
      toast.success("Hesap oluşturuldu!");
      router.push("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Bir hata oluştu.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      <div className="absolute -top-48 -left-48 w-[500px] h-[500px] rounded-full bg-primary/15 blur-3xl animate-blob pointer-events-none" />
      <div className="absolute -bottom-48 -right-48 w-[500px] h-[500px] rounded-full bg-accent/15 blur-3xl animate-blob animation-delay-4000 pointer-events-none" />

      <div className="w-full max-w-md space-y-8 animate-fade-in-up relative z-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-primary/30 blur-xl" />
            <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 backdrop-blur">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-glow bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              StudyLogger
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              Son bir adım — kullanıcı adını belirle
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-card/60 backdrop-blur-xl p-8 shadow-2xl shadow-primary/5 space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Kullanıcı Adı Seç</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Arkadaşlarının seni bulması için bir kullanıcı adı gir
            </p>
          </div>

          {user?.displayName && (
            <p className="text-sm text-muted-foreground">
              Google hesabı: <span className="text-foreground font-medium">{user.displayName}</span>
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Kullanıcı Adı</Label>
              <Input
                id="username"
                placeholder="ahmet_yks"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="bg-background/50 border-white/10 focus-visible:border-primary/60 focus-visible:ring-primary/20 transition-all"
              />
              <p className="text-xs text-muted-foreground">
                3-20 karakter, harf, rakam ve _ kullanabilirsin
              </p>
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 hover:-translate-y-0.5"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                "Devam Et"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
