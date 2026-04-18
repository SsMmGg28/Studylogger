"use client";

import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot
} from "recharts";
import { parseISO, format } from "date-fns";
import { tr } from "date-fns/locale";
import type { ExamLog } from "@/lib/db";

interface ExamTrendChartProps {
  exams: ExamLog[];
  type: "tyt" | "ayt";
}

export default React.memo(function ExamTrendChart({ exams, type }: ExamTrendChartProps) {
  const chartData = useMemo(() => {
    return exams
      .filter((e) => e.examCategory === "tam" && e.examType === type && e.totalNet !== undefined)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((e) => ({
        date: e.date,
        displayDate: format(parseISO(e.date), "d MMM", { locale: tr }),
        net: Number(e.totalNet?.toFixed(2)),
      }));
  }, [exams, type]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-52 text-sm text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border/50">
        Bu sınav türü için henüz tam deneme kaydı yok.
      </div>
    );
  }

  const maxNet = type === "tyt" ? 120 : 80;

  return (
    <div className="h-[250px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`gradient_${type}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={type === "tyt" ? "#60a5fa" : "#c084fc"} stopOpacity={0.3} />
              <stop offset="95%" stopColor={type === "tyt" ? "#60a5fa" : "#c084fc"} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="displayDate" 
            tick={{ fontSize: 11, fill: "#64748b" }} 
            tickLine={false} 
            axisLine={false} 
            dy={8}
          />
          <YAxis 
            domain={[0, maxNet]} 
            tick={{ fontSize: 11, fill: "#64748b" }} 
            tickLine={false} 
            axisLine={false} 
            dx={-8}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#16182a",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              color: "#e2e8f0",
              fontSize: "12px",
              padding: "8px 12px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            }}
            labelStyle={{ color: "#94a3b8", fontWeight: 600, marginBottom: "4px" }}
            itemStyle={{ color: type === "tyt" ? "#93c5fd" : "#d8b4fe", fontWeight: 600 }}
            formatter={(value: number) => [`${value} Net`, "Toplam Net"]}
            labelFormatter={(label) => label}
          />
          <Line
            type="monotone"
            dataKey="net"
            stroke={type === "tyt" ? "#3b82f6" : "#a855f7"}
            strokeWidth={3}
            dot={{ r: 4, fill: "#1e1e2e", strokeWidth: 2 }}
            activeDot={{ r: 6, fill: type === "tyt" ? "#60a5fa" : "#c084fc", strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});