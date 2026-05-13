"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[PageError]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-8">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 flex flex-col items-center gap-4 text-center">
            <div className="p-3 rounded-full bg-destructive/10">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold">Bir Sorun Oluştu</h2>
            <p className="text-sm text-muted-foreground">
              Veriler yüklenirken bir hata meydana geldi. İnternet bağlantınızı
              kontrol edin veya tekrar deneyin.
            </p>
            {error.message && (
              <p className="text-xs text-muted-foreground font-mono bg-muted px-3 py-2 rounded w-full text-left break-all">
                {error.message}
              </p>
            )}
            <div className="flex gap-3">
              <Button onClick={reset} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Tekrar Dene
              </Button>
              <Button variant="outline" onClick={() => (window.location.href = "/")}>
                Ana Sayfa
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
