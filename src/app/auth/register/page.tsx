"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    displayName: "",
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);

  function handle(field: string, val: string) {
    setForm((prev) => ({ ...prev, [field]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error("Şifreler eşleşmiyor.");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Şifre en az 6 karakter olmalı.");
      return;
    }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username)) {
      toast.error("Kullanıcı adı 3-20 karakter, sadece harf, rakam ve _ içermeli.");
      return;
    }
    setLoading(true);
    try {
      await register(form.email, form.password, form.displayName, form.username);
      toast.success("Hesap oluşturuldu!");
      router.push("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Kayıt başarısız.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2 text-primary">
            <BookOpen className="w-8 h-8" />
            <span className="text-2xl font-bold">StudyLogger</span>
          </div>
          <p className="text-muted-foreground text-sm">YKS sürecini takip et, arkadaşlarınla yarış</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Kayıt Ol</CardTitle>
            <CardDescription>Hesabını oluşturmak için bilgilerini gir</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Ad Soyad</Label>
                  <Input
                    id="displayName"
                    placeholder="Ahmet Yılmaz"
                    value={form.displayName}
                    onChange={(e) => handle("displayName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Kullanıcı Adı</Label>
                  <Input
                    id="username"
                    placeholder="ahmet_yks"
                    value={form.username}
                    onChange={(e) => handle("username", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@gmail.com"
                  value={form.email}
                  onChange={(e) => handle("email", e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Şifre</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="En az 6 karakter"
                  value={form.password}
                  onChange={(e) => handle("password", e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Şifre Tekrar</Label>
                <Input
                  id="confirm"
                  type="password"
                  placeholder="••••••••"
                  value={form.confirm}
                  onChange={(e) => handle("confirm", e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Zaten hesabın var mı?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Giriş yap
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
