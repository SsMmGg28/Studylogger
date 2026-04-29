import Link from "next/link";
import { BookOpen, Monitor, Download, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "İndir — StudyLogger Masaüstü",
  description: "StudyLogger masaüstü uygulamasını Windows'a indirin ve çalışma sürenizi dinamik ada ile takip edin.",
};

export default function DownloadPage() {
  const RELEASE_URL =
    "https://github.com/SsMmGg28/Studylogger/releases/latest";

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
            <a href={RELEASE_URL} target="_blank" rel="noopener noreferrer">
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
