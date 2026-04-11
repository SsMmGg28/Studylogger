"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login, loginDemo, loginWithGoogle } from "@/lib/auth";
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
  const [googleLoading, setGoogleLoading] = useState(false);
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

  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      const { isNew } = await loginWithGoogle();
      router.push(isNew ? "/auth/setup-username" : "/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (!msg.includes("popup-closed")) {
        toast.error("Google ile giriş başarısız.");
      }
    } finally {
      setGoogleLoading(false);
    }
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

          {/* Google button */}
          <Button
            type="button"
            variant="outline"
            className="w-full border-white/10 hover:bg-white/5 hover:border-white/20 gap-2.5 transition-all hover:-translate-y-0.5"
            onClick={handleGoogle}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Google ile Giriş Yap
          </Button>

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

