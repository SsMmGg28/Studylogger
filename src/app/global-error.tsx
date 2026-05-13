"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console in dev; replace with a real error reporting service in prod
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html lang="tr" className="h-full dark">
      <body className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground gap-6 p-8">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <div className="p-4 rounded-full bg-destructive/10">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold">Beklenmedik Bir Hata Oluştu</h1>
          <p className="text-muted-foreground text-sm">
            Uygulama kritik bir hatayla karşılaştı. Sayfayı yenilemeyi deneyin.
            Sorun devam ederse tarayıcı önbelleğinizi temizleyin.
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground font-mono bg-muted px-3 py-1 rounded">
              Hata kodu: {error.digest}
            </p>
          )}
          <div className="flex gap-3 mt-2">
            <Button onClick={reset}>Tekrar Dene</Button>
            <Button variant="outline" onClick={() => (window.location.href = "/")}>
              Ana Sayfaya Dön
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
