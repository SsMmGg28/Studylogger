"use client";

import { Crown, Clock, Hash } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SUBJECT_MAP, SUBJECT_COLORS } from "@/lib/subjects";
import type { FriendData } from "@/hooks/useFriends";

interface LeaderboardProps {
  friends: FriendData[];
  currentUid: string;
  currentStats: { totalMinutes: number; totalQuestions: number };
  currentName: string;
  privacySettings?: { showHours: boolean; showQuestions: boolean; showSubjectBreakdown: boolean };
  metric?: "minutes" | "questions";
}

interface Entry {
  uid: string;
  name: string;
  totalMinutes: number;
  totalQuestions: number;
  bySubject: Record<string, { minutes: number; questions: number }>;
  isMe: boolean;
}

export default function Leaderboard({
  friends,
  currentUid,
  currentStats,
  currentName,
  privacySettings,
  metric = "minutes",
}: LeaderboardProps) {
  const me: Entry = {
    uid: currentUid,
    name: currentName,
    totalMinutes: currentStats.totalMinutes,
    totalQuestions: currentStats.totalQuestions,
    bySubject: {},
    isMe: true,
  };

  const entries: Entry[] = [
    me,
    ...friends.map((f) => ({
      uid: f.uid,
      name: f.profile.displayName,
      totalMinutes: f.profile.privacySettings.showHours ? f.stats.totalMinutes : -1,
      totalQuestions: f.profile.privacySettings.showQuestions ? f.stats.totalQuestions : -1,
      bySubject: f.profile.privacySettings.showSubjectBreakdown ? f.stats.bySubject : {},
      isMe: false,
    })),
  ].sort((a, b) => {
    const av = metric === "minutes" ? a.totalMinutes : a.totalQuestions;
    const bv = metric === "minutes" ? b.totalMinutes : b.totalQuestions;
    if (av === -1) return 1;
    if (bv === -1) return -1;
    return bv - av;
  });

  function formatMinutes(m: number) {
    if (m < 0) return "Gizli";
    const h = Math.floor(m / 60);
    const min = m % 60;
    return h > 0 ? `${h}s ${min}dk` : `${min}dk`;
  }

  return (
    <div className="space-y-2">
      {entries.map((entry, idx) => {
        const rank = idx + 1;
        const initials = entry.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
        const primary = metric === "minutes" ? formatMinutes(entry.totalMinutes) : entry.totalQuestions >= 0 ? `${entry.totalQuestions} soru` : "Gizli";

        return (
          <Card key={entry.uid} className={entry.isMe ? "border-primary/40 bg-primary/5" : ""}>
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                {/* Rank */}
                <div className="w-7 text-center shrink-0">
                  {rank === 1 ? (
                    <Crown className="w-5 h-5 text-yellow-400 mx-auto" />
                  ) : (
                    <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
                  )}
                </div>

                {/* Avatar */}
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback
                    className="text-xs font-bold"
                    style={{ backgroundColor: entry.isMe ? "hsl(var(--primary) / 0.2)" : "hsl(var(--muted))" }}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{entry.name}</span>
                    {entry.isMe && <Badge variant="outline" className="text-xs border-primary/40 text-primary">sen</Badge>}
                  </div>
                  {/* Subject bars */}
                  {Object.keys(entry.bySubject).length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {Object.entries(entry.bySubject)
                        .sort((a, b) => b[1].minutes - a[1].minutes)
                        .slice(0, 5)
                        .map(([subId]) => (
                          <span
                            key={subId}
                            className="inline-block w-2 h-2 rounded-full"
                            style={{ backgroundColor: SUBJECT_COLORS[subId] ?? "#6366f1" }}
                            title={SUBJECT_MAP[subId]?.label}
                          />
                        ))}
                    </div>
                  )}
                </div>

                {/* Primary stat */}
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    {metric === "minutes" ? <Clock className="w-3.5 h-3.5 text-muted-foreground" /> : <Hash className="w-3.5 h-3.5 text-muted-foreground" />}
                    {primary}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
