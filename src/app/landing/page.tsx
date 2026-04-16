"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  BarChart3,
  Users,
  Target,
  Clock,
  TrendingUp,
  ChevronRight,
  Zap,
  Shield,
  Smartphone,
  ArrowRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function LandingPage() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    const isDemo = localStorage.getItem("demo-mode") === "true";
    if (isDemo) {
      router.push("/");
      return;
    }
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.push("/");
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ─── Sticky Nav ─── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrollY > 50
            ? "bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-lg shadow-black/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors border border-primary/20">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              StudyLogger
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-sm hover:bg-white/5">
                Giriş Yap
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
                Kayıt Ol
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 px-4 sm:px-6">
        {/* Background effects */}
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full bg-primary/12 blur-[120px] animate-blob pointer-events-none" />
        <div className="absolute -bottom-48 -right-48 w-[500px] h-[500px] rounded-full bg-accent/12 blur-[120px] animate-blob animation-delay-4000 pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-primary/6 blur-[100px] animate-blob animation-delay-2000 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm mb-8 animate-fade-in-up">
            <Star className="w-3.5 h-3.5" />
            <span>YKS 2026 için tasarlandı</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] animate-fade-in-up">
            Çalışmalarını takip et,{" "}
            <span className="bg-gradient-to-r from-primary via-indigo-400 to-accent bg-clip-text text-transparent">
              hedeflerine ulaş
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            Günlük çalışma sürenizi, çözdüğünüz soruları ve deneme sonuçlarınızı takip edin.
            Arkadaşlarınızla yarışın, hedefler belirleyin ve YKS&apos;ye en verimli şekilde hazırlanın.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <Link href="/auth/register">
              <Button size="lg" className="text-base px-8 py-6 shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all gap-2 group">
                Hemen Başla
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="text-base px-8 py-6 border-white/10 hover:bg-white/5 hover:border-white/20 transition-all gap-2">
                Giriş Yap
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Mini stats preview */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto animate-fade-in-up" style={{ animationDelay: "400ms" }}>
            {[
              { label: "Desteklenen Ders", value: "15" },
              { label: "Alt Konu", value: "189" },
              { label: "Sınav Türü", value: "TYT - AYT" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-xl sm:text-2xl font-bold text-primary">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              İhtiyacın olan{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                her şey
              </span>{" "}
              tek yerde
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              StudyLogger, YKS hazırlığında ihtiyacın olan tüm araçları sunuyor.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Clock,
                title: "Çalışma Takibi",
                desc: "Günlük çalışma sürenizi ve çözdüğünüz soruları ders ve konu bazında kaydedin.",
                color: "#6366f1",
              },
              {
                icon: BarChart3,
                title: "Detaylı İstatistikler",
                desc: "Konu bazlı dağılım, verimlilik trendi ve deneme sonuçlarınızı analiz edin.",
                color: "#8b5cf6",
              },
              {
                icon: Target,
                title: "Hedef Belirleme",
                desc: "Haftalık ve aylık hedefler koyun, ilerlemenizi takip edin.",
                color: "#06b6d4",
              },
              {
                icon: Users,
                title: "Arkadaş Yarışması",
                desc: "Arkadaşlarınızla karşılaştırma yapın, liderlik tablosunda yarışın.",
                color: "#10b981",
              },
              {
                icon: TrendingUp,
                title: "Deneme Takibi",
                desc: "TYT/AYT tam ve branş deneme sonuçlarınızı kaydedin, net trendini izleyin.",
                color: "#f59e0b",
              },
              {
                icon: BookOpen,
                title: "Tekrar Önerileri",
                desc: "3+ gündür çalışmadığınız konuları otomatik hatırlatan akıllı sistem.",
                color: "#ef4444",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group relative p-6 rounded-2xl border border-border/50 bg-card/30 hover:bg-card/60 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
              >
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 transition-colors"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it Works ─── */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Nasıl çalışır?
            </h2>
            <p className="mt-4 text-muted-foreground">Üç basit adımda YKS takibine başla</p>
          </div>

          <div className="space-y-8">
            {[
              {
                step: "01",
                title: "Hesap Oluştur",
                desc: "E-posta veya Google hesabınla saniyeler içinde kayıt ol.",
              },
              {
                step: "02",
                title: "Çalışmalarını Kaydet",
                desc: "Her gün ne kadar çalıştığını, kaç soru çözdüğünü ve deneme sonuçlarını gir.",
              },
              {
                step: "03",
                title: "İlerlemeni Takip Et",
                desc: "İstatistikleri incele, hedeflerini kontrol et ve arkadaşlarınla yarış.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-6 items-start group p-6 rounded-2xl hover:bg-white/[0.02] transition-colors"
              >
                <div className="shrink-0 w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xl group-hover:bg-primary/15 group-hover:scale-110 transition-all">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Additional Features ─── */}
      <section className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "Hızlı & Kolay",
                desc: "Kayıt eklemek sadece birkaç saniye sürer. Günlük rutinine kolayca dahil et.",
              },
              {
                icon: Shield,
                title: "Güvenli Veriler",
                desc: "Tüm verilerin Firebase altyapısıyla güvenle saklanır. Gizlilik ayarları sende.",
              },
              {
                icon: Smartphone,
                title: "Her Cihazda",
                desc: "PWA desteğiyle telefonuna yükle, çevrimdışı bile çalış.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="text-center p-8 rounded-2xl border border-border/30 bg-card/20 hover:bg-card/40 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            YKS yolculuğuna{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              bugün başla
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Ücretsiz hesap oluştur ve çalışmalarını takip etmeye hemen başla.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="/auth/register">
              <Button size="lg" className="text-base px-10 py-6 shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all gap-2 group">
                Ücretsiz Kayıt Ol
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="text-base px-10 py-6 border-white/10 hover:bg-white/5 gap-2">
                Demo Hesabı ile Dene
                <Zap className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border/40 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-muted-foreground">StudyLogger</span>
          </div>
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} StudyLogger. YKS öğrencileri için tasarlandı.
          </p>
        </div>
      </footer>
    </div>
  );
}
