import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";

async function verifyDesktopToken(req: NextRequest): Promise<string | null> {
  if (!adminAuth) return null;
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return decoded.uid;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const uid = await verifyDesktopToken(req);
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!adminDb) {
    return NextResponse.json({ error: "Firebase admin is not configured" }, { status: 500 });
  }

  try {
    const today = new Date();
    const startOfToday = today.toISOString().split("T")[0];

    // ── Bugünün logları ────────────────────────────────────────────────────
    const [logsSnap, userSnap, goalsSnap] = await Promise.all([
      adminDb.collection("studyLogs").where("uid", "==", uid).where("date", "==", startOfToday).get(),
      adminDb.collection("users").doc(uid).get(),
      adminDb.collection("users").doc(uid).collection("goals").get(),
    ]);

    let todayMinutes = 0;
    let todayQuestions = 0;
    const profile = userSnap.exists ? userSnap.data() : null;

    logsSnap.forEach((doc) => {
      const data = doc.data();
      todayMinutes += data.durationMinutes || 0;
      todayQuestions += data.questionCount || 0;
    });

    // ── Streak hesapla ────────────────────────────────────────────────────
    // Son 60 günün loglarını çek, ardışık gün sayısını bul
    const sixtyDaysAgo = new Date(today);
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const sixtyDaysAgoStr = sixtyDaysAgo.toISOString().split("T")[0];

    const recentLogsSnap = await adminDb
      .collection("studyLogs")
      .where("uid", "==", uid)
      .where("date", ">=", sixtyDaysAgoStr)
      .get();

    const studiedDays = new Set<string>();
    recentLogsSnap.forEach((doc) => studiedDays.add(doc.data().date as string));

    let currentStreak = 0;
    const cursor = new Date(today);
    // Eğer bugün çalışma yoksa dünden başla
    if (!studiedDays.has(startOfToday)) cursor.setDate(cursor.getDate() - 1);
    while (true) {
      const dateStr = cursor.toISOString().split("T")[0];
      if (!studiedDays.has(dateStr)) break;
      currentStreak++;
      cursor.setDate(cursor.getDate() - 1);
    }

    // ── Hedef ilerlemesi (haftalık) ────────────────────────────────────────
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Pazartesi
    const weekStartStr = weekStart.toISOString().split("T")[0];

    const weekLogsSnap = await adminDb
      .collection("studyLogs")
      .where("uid", "==", uid)
      .where("date", ">=", weekStartStr)
      .get();

    let weekMinutes = 0;
    let weekQuestions = 0;
    weekLogsSnap.forEach((doc) => {
      const data = doc.data();
      weekMinutes += data.durationMinutes || 0;
      weekQuestions += data.questionCount || 0;
    });

    const goals: Array<{ subject: string; metric: string; period: string; target: number; progress: number }> = [];
    goalsSnap.forEach((doc) => {
      const g = doc.data();
      const progress = g.metric === "minutes"
        ? (g.period === "weekly" ? weekMinutes : todayMinutes)
        : (g.period === "weekly" ? weekQuestions : todayQuestions);
      goals.push({
        subject: g.subject as string,
        metric: g.metric as string,
        period: g.period as string,
        target: g.target as number,
        progress,
      });
    });

    return NextResponse.json({
      status: "success",
      date: startOfToday,
      todayMinutes,
      todayQuestions,
      displayName: profile?.displayName || "Student",
      streak: currentStreak,
      weekMinutes,
      weekQuestions,
      goals,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Desktop stats API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
