"use client";

import { useState, useEffect } from "react";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { updateUserProfile, getUserProfile, type UserProfile } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { User, Lock, Eye, EyeOff, Bell } from "lucide-react";
import { requestNotificationPermission } from "@/lib/notifications";

function PrivacyToggle({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-border/50 last:border-b-0">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export default function SettingsPage() {
  const { user, profile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.displayName ?? "");
  const [privacy, setPrivacy] = useState(
    profile?.privacySettings ?? {
      showHours: true,
      showQuestions: true,
      showSubjectBreakdown: true,
    }
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
      setPrivacy(profile.privacySettings);
    }
  }, [profile]);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(user.uid, {
        displayName,
        privacySettings: privacy,
      });
      toast.success("Ayarlar kaydedildi.");
    } catch {
      toast.error("Kaydetme başarısız.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-6">
          <h1 className="text-2xl font-bold">Ayarlar</h1>

          {/* Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="w-4 h-4" /> Profil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Ad Soyad</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Adınız Soyadınız"
                />
              </div>
              <div className="space-y-2">
                <Label>Kullanıcı Adı</Label>
                <div className="flex items-center gap-2">
                  <Input value={`@${profile?.username ?? ""}`} disabled className="bg-muted/50" />
                  <Badge variant="secondary" className="text-xs whitespace-nowrap">Değiştirilemez</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Kullanıcı adı kayıt sonrası değiştirilemez.</p>
              </div>
              <div className="space-y-2">
                <Label>E-posta</Label>
                <Input value={user?.email ?? ""} disabled className="bg-muted/50" />
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Lock className="w-4 h-4" /> Gizlilik
              </CardTitle>
              <CardDescription>
                Arkadaşlarının profilinde hangi verilerin görüneceğini seç.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PrivacyToggle
                label="Çalışma Saatlerimi Göster"
                description="Arkadaşlar toplam çalışma sürenizi görebilir"
                checked={privacy.showHours}
                onCheckedChange={(v) => setPrivacy((p) => ({ ...p, showHours: v }))}
              />
              <PrivacyToggle
                label="Soru Sayımı Göster"
                description="Arkadaşlar çözdüğünüz toplam soru sayısını görebilir"
                checked={privacy.showQuestions}
                onCheckedChange={(v) => setPrivacy((p) => ({ ...p, showQuestions: v }))}
              />
              <PrivacyToggle
                label="Ders Dağılımımı Göster"
                description="Arkadaşlar hangi derse ne kadar çalıştığınızı görebilir"
                checked={privacy.showSubjectBreakdown}
                onCheckedChange={(v) => setPrivacy((p) => ({ ...p, showSubjectBreakdown: v }))}
              />
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="w-4 h-4" /> Bildirimler
              </CardTitle>
              <CardDescription>
                Çalışma hatırlatmaları ve seri uyarıları için bildirimleri etkinleştirin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="text-sm font-medium">Bildirimlere İzin Ver</p>
                  <p className="text-xs text-muted-foreground">
                    {typeof window !== "undefined" && "Notification" in window
                      ? Notification.permission === "granted"
                        ? "✅ Bildirimler etkin"
                        : Notification.permission === "denied"
                        ? "❌ Bildirimler tarayıcıdan engellendi"
                        : "Henüz izin verilmedi"
                      : "Tarayıcınız bildirimleri desteklemiyor"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    const granted = await requestNotificationPermission();
                    if (granted) {
                      toast.success("Bildirimler etkinleştirildi!");
                    } else {
                      toast.error("Bildirim izni reddedildi.");
                    }
                  }}
                >
                  İzin Ver
                </Button>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? "Kaydediliyor…" : "Değişiklikleri Kaydet"}
          </Button>
        </main>
      </div>
    </AuthGuard>
  );
}
