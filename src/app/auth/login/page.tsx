"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login, loginDemo } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Zap, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      router.push("/");
    } catch {
      toast.error("E-posta veya şifre hatalı.");
    } finally {
      setLoading(false);
    }
  }

  function handleDemo() {
    setDemoLoading(true);
    loginDemo();
    router.push("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Animated background orbs */}
      <div className="absolute -top-48 -left-48 w-[500px] h-[500px] rounded-full bg-primary/15 blur-3xl animate-blob pointer-events-none" />
      <div className="absolute -bottom-48 -right-48 w-[500px] h-[500px] rounded-full bg-accent/15 blur-3xl animate-blob animation-delay-4000 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-primary/8 blur-3xl animate-blob animation-delay-2000 pointer-events-none" />

      <div className="w-full max-w-md space-y-8 animate-fade-in-up relative z-10">
        {/* Logo */}
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
              YKS sürecini takip et, arkadaşlarınla yarış
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-card/60 backdrop-blur-xl p-8 shadow-2xl shadow-primary/5 space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Giriş Yap</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Hesabına erişmek için bilgilerini gir
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="bg-background/50 border-white/10 focus-visible:border-primary/60 focus-visible:ring-primary/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="bg-background/50 border-white/10 focus-visible:border-primary/60 focus-visible:ring-primary/20 transition-all"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 hover:-translate-y-0.5"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Giriş yapılıyor...
                </>
              ) : (
                "Giriş Yap"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-card/60 text-muted-foreground">veya</span>
            </div>
          </div>

          {/* Demo button */}
          <Button
            type="button"
            variant="outline"
            className="w-full border-accent/40 text-accent hover:bg-accent/10 hover:border-accent/70 hover:shadow-lg hover:shadow-accent/10 gap-2 transition-all hover:-translate-y-0.5"
            onClick={handleDemo}
            disabled={demoLoading}
          >
            {demoLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            Demo Hesabıyla Giriş Yap
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Hesabın yok mu?{" "}
            <Link
              href="/auth/register"
              className="text-primary hover:text-primary/80 hover:underline font-medium transition-colors"
            >
              Kayıt ol
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground/60">
          Demo hesabı gerçek veriler içerir, Firebase gerekmez
        </p>
      </div>
    </div>
  );
}

