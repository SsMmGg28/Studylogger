"use client";

import { useState, useMemo } from "react";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import Leaderboard from "@/components/Leaderboard";
import SubjectChart from "@/components/SubjectChart";
import { useAuth } from "@/hooks/useAuth";
import { useStudyLogs } from "@/hooks/useStudyLogs";
import { useFriends } from "@/hooks/useFriends";
import { getUserByUsername } from "@/lib/db";
import { aggregateBySubject } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, CheckCircle, Users, Clock, Hash, Search } from "lucide-react";
import { toast } from "sonner";
import { SUBJECT_MAP, SUBJECTS } from "@/lib/subjects";

export default function FriendsPage() {
  const { user, profile } = useAuth();
  const { logs } = useStudyLogs(user?.uid ?? null);
  const { friends, pending, loading, sendRequest, accept, remove, refresh } = useFriends(user?.uid ?? null);

  const [searchUsername, setSearchUsername] = useState("");
  const [searching, setSearching] = useState(false);
  const [metric, setMetric] = useState<"minutes" | "questions">("minutes");

  const myStats = useMemo(() => {
    const bySubject = aggregateBySubject(logs);
    return {
      totalMinutes: logs.reduce((s, l) => s + l.durationMinutes, 0),
      totalQuestions: logs.reduce((s, l) => s + l.questionCount, 0),
      bySubject,
    };
  }, [logs]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchUsername.trim()) return;
    setSearching(true);
    try {
      const result = await getUserByUsername(searchUsername.trim());
      if (!result) {
        toast.error("Kullanıcı bulunamadı.");
        return;
      }
      if (result.uid === user?.uid) {
        toast.error("Kendinize arkadaşlık isteği gönderemezsiniz.");
        return;
      }
      const alreadyFriend = friends.find((f) => f.uid === result.uid);
      if (alreadyFriend) {
        toast.error("Bu kullanıcı zaten arkadaşınız.");
        return;
      }
      await sendRequest(result.uid);
      toast.success(`@${result.profile.username} kullanıcısına istek gönderildi!`);
      setSearchUsername("");
    } catch {
      toast.error("İstek gönderilirken hata oluştu.");
    } finally {
      setSearching(false);
    }
  }

  async function handleAccept(fromUid: string, name: string) {
    await accept(fromUid);
    toast.success(`${name} artık arkadaşınız!`);
  }

  async function handleRemove(uid: string, name: string) {
    if (!confirm(`${name} kullanıcısını arkadaş listesinden çıkarmak istiyor musun?`)) return;
    await remove(uid);
    toast.success("Arkadaş kaldırıldı.");
  }

  // Build subject comparison data
  const subjectCompareData = useMemo(() => {
    const subjects = SUBJECTS.map((s) => {
      const entry: Record<string, number> = { myMins: myStats.bySubject[s.id]?.minutes ?? 0 };
      friends.forEach((f) => {
        if (f.profile.privacySettings.showSubjectBreakdown) {
          entry[f.profile.displayName] = f.stats.bySubject[s.id]?.minutes ?? 0;
        }
      });
      return { subject: s.label, ...entry, color: s.color };
    }).filter((d) => {
      const total = Object.entries(d).filter(([k]) => k !== "subject" && k !== "color").reduce((s, [, v]) => s + (Number(v) || 0), 0);
      return total > 0;
    });
    return subjects;
  }, [myStats, friends]);

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 space-y-6 animate-fade-in-up">
          <h1 className="text-3xl font-bold tracking-tight">Arkadaşlar</h1>

          {/* Pending requests */}
          {pending.length > 0 && (
            <Card className="border-primary/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-primary">
                  <Users className="w-4 h-4" />
                  Bekleyen İstekler ({pending.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {pending.map(({ uid, profile: p }) => (
                  <div key={uid} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-muted">
                          {p.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{p.displayName}</p>
                        <p className="text-xs text-muted-foreground">@{p.username}</p>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleAccept(uid, p.displayName)} className="gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Kabul Et
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Add friend */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Arkadaş Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                  <Input
                    placeholder="kullanici_adi"
                    className="pl-7"
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={searching || !searchUsername.trim()} className="gap-1.5">
                  <UserPlus className="w-4 h-4" />
                  {searching ? "Aranıyor…" : "İstek Gönder"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Tabs: Sıralama / Ders */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <Tabs defaultValue="leaderboard">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <TabsList>
                  <TabsTrigger value="leaderboard">Sıralama</TabsTrigger>
                  <TabsTrigger value="subjects">Ders Kıyasla</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Metrik:</span>
                  <Button
                    size="sm"
                    variant={metric === "minutes" ? "default" : "outline"}
                    className="h-7 gap-1"
                    onClick={() => setMetric("minutes")}
                  >
                    <Clock className="w-3 h-3" /> Süre
                  </Button>
                  <Button
                    size="sm"
                    variant={metric === "questions" ? "default" : "outline"}
                    className="h-7 gap-1"
                    onClick={() => setMetric("questions")}
                  >
                    <Hash className="w-3 h-3" /> Soru
                  </Button>
                </div>
              </div>

              <TabsContent value="leaderboard" className="mt-4">
                {friends.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Henüz arkadaşın yok.</p>
                    <p className="text-sm">Kullanıcı adını arayarak arkadaş ekle!</p>
                  </div>
                ) : (
                  <Leaderboard
                    friends={friends}
                    currentUid={user?.uid ?? ""}
                    currentStats={myStats}
                    currentName={profile?.displayName ?? "Sen"}
                    metric={metric}
                  />
                )}
              </TabsContent>

              <TabsContent value="subjects" className="mt-4">
                {friends.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    Arkadaş ekleyerek ders bazlı kıyaslamayı kullan.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {SUBJECTS.filter((s) => {
                      const hasMy = (myStats.bySubject[s.id]?.minutes ?? 0) > 0;
                      const hasFriend = friends.some((f) => (f.stats.bySubject[s.id]?.minutes ?? 0) > 0 && f.profile.privacySettings.showSubjectBreakdown);
                      return hasMy || hasFriend;
                    }).map((s) => {
                      const data: Record<string, { minutes: number; questions: number }> = {};
                      data["__me__"] = myStats.bySubject[s.id] ?? { minutes: 0, questions: 0 };
                      friends.forEach((f) => {
                        if (f.profile.privacySettings.showSubjectBreakdown) {
                          data[f.uid] = f.stats.bySubject[s.id] ?? { minutes: 0, questions: 0 };
                        }
                      });
                      return null; // placeholder - SubjectChart below
                    })}
                    {/* Friend vs me subject summary */}
                    <Card className="col-span-full">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">
                          Toplam Ders Dağılımı (Senin)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <SubjectChart data={myStats.bySubject} metric={metric} />
                      </CardContent>
                    </Card>
                    {friends.map((f) => (
                      <Card key={f.uid}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-[10px] bg-muted">
                                {f.profile.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            {f.profile.displayName}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {f.profile.privacySettings.showSubjectBreakdown ? (
                            <SubjectChart data={f.stats.bySubject} metric={metric} />
                          ) : (
                            <p className="text-muted-foreground text-sm text-center py-4">Gizli</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}

          {/* Friend list (remove) */}
          {friends.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Arkadaş Listesi ({friends.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {friends.map((f) => (
                  <div key={f.uid} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-muted">
                          {f.profile.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{f.profile.displayName}</p>
                        <p className="text-xs text-muted-foreground">@{f.profile.username}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive text-xs"
                      onClick={() => handleRemove(f.uid, f.profile.displayName)}
                    >
                      Kaldır
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
