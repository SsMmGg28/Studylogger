import Link from "next/link";
import { BookOpen, Monitor, Download, CheckCircle, ArrowLeft, Smartphone, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "İndir — StudyLogger Masaüstü",
  description: "StudyLogger masaüstü uygulamasını Windows'a indirin ve çalışma sürenizi dinamik ada ile takip edin.",
};

export default function DownloadPage() {
  const RELEASE_URL =
    "https://github.com/SsMmGg28/Studylogger/releases/latest";
  const DIRECT_DOWNLOAD_URL =
    "https://github.com/SsMmGg28/Studylogger/releases/download/v1.0.0/Dynamic.Island.Setup.1.0.0.exe";  const ANDROID_APK_URL =
    "https://github.com/SsMmGg28/Studylogger/releases/download/v1.0.1/DynamicIslandBridge-v1.0.1.apk";
  const ANDROID_RELEASE_URL =
    "https://github.com/SsMmGg28/Studylogger/releases/tag/v1.0.1";
  const features = [
    "Windows görev çubuğunuzda dinamik ada widget'ı",
    "Çalışma zamanlayıcısını doğrudan ada üzerinden kontrol edin",
    "Branş denemesi sonuçlarını anlık olarak kaydedin",
    "Web hesabınızla otomatik senkronizasyon",
    "Sistem kaynaklarını neredeyse sıfır düzeyde kullanır",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/landing" className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors border border-primary/20">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              StudyLogger
            </span>
          </Link>
          <Link href="/landing" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Ana Sayfa
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 mb-8 shadow-xl shadow-primary/10">
            <Monitor className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Masaüstü Uygulaması
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Windows için dinamik ada widget&apos;ı ile çalışmalarınızı takip edin.
            Zamanlayıcıyı başlatın, branş denemeleri kaydedin — hiçbir zaman tarayıcıya geçmeden.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <a href={DIRECT_DOWNLOAD_URL} download>
              <Button
                size="lg"
                className="text-base px-8 py-6 shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all gap-2.5 group"
              >
                <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                Windows için İndir (.exe)
              </Button>
            </a>
            <a href={RELEASE_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="text-base px-8 py-6 border-white/10 hover:bg-white/5 gap-2">
                GitHub Releases
              </Button>
            </a>
          </div>

          <p className="mt-4 text-xs text-muted-foreground/60">
            Windows 10/11 (64-bit) · Ücretsiz
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Neler içeriyor?</h2>
          <ul className="space-y-4">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 px-4 sm:px-6 bg-card/20 border-y border-border/30">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Nasıl kurulur?</h2>
          <div className="space-y-6">
            {[
              {
                step: "1",
                title: "İndir",
                desc: 'Yukarıdaki "Windows için İndir" butonuna tıklayın ve kurulum dosyasını kaydedin.',
              },
              {
                step: "2",
                title: "Kur",
                desc: "İndirilen .exe dosyasını çalıştırın ve kurulum adımlarını takip edin.",
              },
              {
                step: "3",
                title: "Bağlan",
                desc: "Uygulamayı açın, StudyLogger hesabınızla oturum açın ve çalışmaya başlayın.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-5 items-start">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Android Companion */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl border border-border/50 bg-card/40 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-4 px-6 py-5 border-b border-border/40 bg-gradient-to-r from-green-500/5 to-blue-500/5">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 shrink-0">
                <Smartphone className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Android Companion Uygulaması</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Telefon bildirimlerini Dynamic Island&apos;a aktar
                </p>
              </div>
              <span className="ml-auto shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                v1.0.1
              </span>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              {/* How it works */}
              <div className="flex items-start gap-3 text-sm text-muted-foreground bg-blue-500/5 border border-blue-500/10 rounded-xl px-4 py-3">
                <Wifi className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p>
                  Android uygulaması ve Windows masaüstü uygulaması aynı Wi-Fi ağındayken WebSocket üzerinden bağlanır.
                  Telefona gelen her bildirim anında Dynamic Island&apos;da görünür.
                </p>
              </div>

              {/* Requirements */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-3">Gereksinimler</p>
                <ul className="space-y-2">
                  {[
                    "Android 7.0 ve üzeri",
                    "Dynamic Island masaüstü uygulaması (Windows)",
                    "Aynı Wi-Fi ağına bağlı olmak",
                    "Bildirim erişim izni",
                  ].map((r) => (
                    <li key={r} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Steps */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-3">Kurulum adımları</p>
                <ol className="space-y-3">
                  {[
                    { n: "1", t: "APK'yı indir ve kur", d: 'Aşağıdaki butona tıkla, dosyayı telefonuna indir ve yükle.' },
                    { n: "2", t: "Bildirim izni ver", d: 'Uygulamayı aç → "İzin Ver" → Ayarlar sayfasında Dynamic Island Bridge\'i etkinleştir.' },
                    { n: "3", t: "IP ve portu gir", d: 'Masaüstü uygulamasında bildirimler panelinden IP adresini kopyala, uygulamaya gir.' },
                    { n: "4", t: "Bağlan", d: 'Bağlan butonuna bas — bildirimler artık Dynamic Island\'da görünecek.' },
                  ].map((s) => (
                    <li key={s.n} className="flex gap-3 text-sm">
                      <span className="shrink-0 w-6 h-6 rounded-lg bg-primary/10 border border-primary/20 text-primary font-bold text-xs flex items-center justify-center">
                        {s.n}
                      </span>
                      <div>
                        <span className="font-medium text-foreground">{s.t}</span>
                        <span className="text-muted-foreground"> — {s.d}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Download buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <a href={ANDROID_APK_URL} download className="flex-1">
                  <Button className="w-full gap-2 bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/35 hover:-translate-y-0.5 transition-all">
                    <Download className="w-4 h-4" />
                    APK İndir (Android)
                  </Button>
                </a>
                <a href={ANDROID_RELEASE_URL} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                    GitHub Release
                  </Button>
                </a>
              </div>

              <p className="text-xs text-muted-foreground/50 text-center">
                Android 7.0+ · ARM (32-bit ve 64-bit uyumlu) · Ücretsiz
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-muted-foreground mb-6">
            Henüz hesabınız yok mu? Web uygulamasına ücretsiz kayıt olun.
          </p>
          <Link href="/auth/register">
            <Button variant="outline" className="border-white/10 hover:bg-white/5">
              Ücretsiz Hesap Oluştur
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
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
