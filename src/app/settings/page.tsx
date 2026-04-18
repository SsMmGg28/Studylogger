"use client";

import { useState, useEffect } from "react";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { updateUserProfile } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { User, Lock, Bell, Clock3 } from "lucide-react";
import { requestNotificationPermission } from "@/lib/notifications";

const DEFAULT_NOTIFICATION_SETTINGS = {
  enabled: true,
  reminderHours: [19],
  timezone: "Europe/Istanbul",
};

function normalizeHours(hours: number[]): number[] {
  return [...new Set(hours.filter((h) => Number.isInteger(h) && h >= 0 && h <= 23))].sort((a, b) => a - b);
}

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
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [reminderHours, setReminderHours] = useState<number[]>([19]);
  const [reminderHourInput, setReminderHourInput] = useState("19");
  const [timezone, setTimezone] = useState("Europe/Istanbul");

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
      setPrivacy(profile.privacySettings);
      const settings = profile.notificationSettings ?? {
        ...DEFAULT_NOTIFICATION_SETTINGS,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_NOTIFICATION_SETTINGS.timezone,
      };
      setNotificationEnabled(settings.enabled);
      setReminderHours(normalizeHours(settings.reminderHours));
      setTimezone(settings.timezone || DEFAULT_NOTIFICATION_SETTINGS.timezone);
    }
  }, [profile]);

  function addReminderHour(hour: number) {
    const normalized = normalizeHours([...reminderHours, hour]);
    if (normalized.length === reminderHours.length) {
      toast.info("Bu saat zaten listede.");
      return;
    }
    setReminderHours(normalized);
  }

  function removeReminderHour(hour: number) {
    const updated = reminderHours.filter((h) => h !== hour);
    if (updated.length === 0) {
      toast.error("En az bir bildirim saati seçmelisiniz.");
      return;
    }
    setReminderHours(updated);
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(user.uid, {
        displayName,
        privacySettings: privacy,
        notificationSettings: {
          enabled: notificationEnabled,
          reminderHours: normalizeHours(reminderHours),
          timezone,
        },
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

              <div className="flex items-center justify-between gap-4 py-3 border-t border-border/50">
                <div>
                  <p className="text-sm font-medium">Planlı Hatırlatmalar</p>
                  <p className="text-xs text-muted-foreground">
                    Seçtiğiniz saatlerde, o gün kayıt yoksa hatırlatma gönderilir.
                  </p>
                </div>
                <Switch checked={notificationEnabled} onCheckedChange={setNotificationEnabled} />
              </div>

              <div className="py-3 border-t border-border/50 space-y-3">
                <div className="flex items-center gap-2">
                  <Clock3 className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Bildirim Saatleri</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {reminderHours.map((hour) => (
                    <Button
                      key={hour}
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => removeReminderHour(hour)}
                    >
                      {String(hour).padStart(2, "0")}:00 kaldır
                    </Button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    type="number"
                    min={0}
                    max={23}
                    value={reminderHourInput}
                    onChange={(e) => setReminderHourInput(e.target.value)}
                    placeholder="Saat (0-23)"
                    disabled={!notificationEnabled}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={!notificationEnabled}
                    onClick={() => {
                      const hour = Number(reminderHourInput);
                      if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
                        toast.error("Geçerli bir saat girin (0-23).");
                        return;
                      }
                      addReminderHour(hour);
                    }}
                  >
                    Saat Ekle
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[8, 12, 16, 19, 21].map((h) => (
                    <Button
                      key={h}
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={!notificationEnabled}
                      onClick={() => addReminderHour(h)}
                    >
                      {String(h).padStart(2, "0")}:00 hızlı ekle
                    </Button>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground">
                  Saat dilimi: {timezone}. Vercel cron görevinin saatlik çalışması önerilir.
                </p>
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
