"use client";

import { useEffect, useState } from "react";
import { differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Timer } from "lucide-react";

// YKS TYT: 14 Haziran 2025 — AYT: 15 Haziran 2025
// 2026 için resmi tarihler henüz açıklanmadı; yaklaşık olarak Haziran ortası
const YKS_TYT_DATE = new Date("2026-06-13T09:00:00");
const YKS_AYT_DATE = new Date("2026-06-14T09:00:00");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(target: Date): TimeLeft {
  const now = new Date();
  const totalSeconds = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

function Segment({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl sm:text-3xl font-bold tabular-nums text-primary leading-none font-mono">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest font-medium">{label}</span>
    </div>
  );
}

export default function ExamCountdown() {
  const [tyt, setTyt] = useState<TimeLeft>(calcTimeLeft(YKS_TYT_DATE));
  const [ayt, setAyt] = useState<TimeLeft>(calcTimeLeft(YKS_AYT_DATE));

  useEffect(() => {
    const id = setInterval(() => {
      setTyt(calcTimeLeft(YKS_TYT_DATE));
      setAyt(calcTimeLeft(YKS_AYT_DATE));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const isPast = tyt.days === 0 && tyt.hours === 0 && tyt.minutes === 0 && tyt.seconds === 0;

  if (isPast) {
    return (
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-4 text-center">
          <p className="font-bold text-primary">Sınav günü geldi! Başarılar! 🎉</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/15 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 overflow-hidden animate-pulse-glow">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Timer className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-semibold text-primary">YKS Geri Sayım</span>
          <span className="ml-auto text-xs text-muted-foreground">~13 Haziran 2026</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* TYT */}
          <div className="bg-background/50 rounded-xl p-4 border border-border/30">
            <p className="text-[11px] text-muted-foreground mb-2.5 font-semibold uppercase tracking-wider">TYT</p>
            <div className="flex items-center gap-2 flex-wrap">
              <Segment value={tyt.days} label="Gün" />
              <span className="text-muted-foreground text-lg font-light pb-2">:</span>
              <Segment value={tyt.hours} label="Saat" />
              <span className="text-muted-foreground text-lg font-light pb-2">:</span>
              <Segment value={tyt.minutes} label="Dk" />
              <span className="text-muted-foreground text-lg font-light pb-2">:</span>
              <Segment value={tyt.seconds} label="Sn" />
            </div>
          </div>

          {/* AYT */}
          <div className="bg-background/50 rounded-xl p-4 border border-border/30">
            <p className="text-[11px] text-muted-foreground mb-2.5 font-semibold uppercase tracking-wider">AYT</p>
            <div className="flex items-center gap-2 flex-wrap">
              <Segment value={ayt.days} label="Gün" />
              <span className="text-muted-foreground text-lg font-light pb-2">:</span>
              <Segment value={ayt.hours} label="Saat" />
              <span className="text-muted-foreground text-lg font-light pb-2">:</span>
              <Segment value={ayt.minutes} label="Dk" />
              <span className="text-muted-foreground text-lg font-light pb-2">:</span>
              <Segment value={ayt.seconds} label="Sn" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
