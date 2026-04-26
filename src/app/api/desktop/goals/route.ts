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

/**
 * GET /api/desktop/goals?uid=<uid>
 *
 * Returns all active goals for the user along with current week/today progress.
 *
 * Response shape:
 * {
 *   status: "success",
 *   goals: [
 *     {
 *       id: string,
 *       subject: string,
 *       metric: "minutes" | "questions",
 *       period: "weekly" | "monthly",
 *       target: number,
 *       progress: number,       — minutes or questions so far this period
 *       percent: number,        — 0-100 (capped at 100)
 *     }
 *   ]
 * }
 */
export async function GET(req: NextRequest) {
  const uid = await verifyDesktopToken(req);
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!adminDb) {
    return NextResponse.json({ error: "Firebase admin not configured" }, { status: 500 });
  }

  try {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    // Hafta başı (Pazartesi)
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
    const weekStartStr = weekStart.toISOString().split("T")[0];

    // Ay başı
    const monthStartStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;

    const [goalsSnap, weekLogsSnap, monthLogsSnap] = await Promise.all([
      adminDb.collection("users").doc(uid).collection("goals").get(),
      adminDb.collection("studyLogs").where("uid", "==", uid).where("date", ">=", weekStartStr).get(),
      adminDb.collection("studyLogs").where("uid", "==", uid).where("date", ">=", monthStartStr).get(),
    ]);

    // Haftalık ve aylık toplamlar (ders bazlı + genel)
    const weekBySubject: Record<string, { minutes: number; questions: number }> = {};
    let weekMinutesTotal = 0;
    let weekQuestionsTotal = 0;
    weekLogsSnap.forEach((doc) => {
      const d = doc.data();
      const s: string = d.subject || "diger";
      if (!weekBySubject[s]) weekBySubject[s] = { minutes: 0, questions: 0 };
      weekBySubject[s].minutes += d.durationMinutes || 0;
      weekBySubject[s].questions += d.questionCount || 0;
      weekMinutesTotal += d.durationMinutes || 0;
      weekQuestionsTotal += d.questionCount || 0;
    });

    const monthBySubject: Record<string, { minutes: number; questions: number }> = {};
    let monthMinutesTotal = 0;
    let monthQuestionsTotal = 0;
    monthLogsSnap.forEach((doc) => {
      const d = doc.data();
      const s: string = d.subject || "diger";
      if (!monthBySubject[s]) monthBySubject[s] = { minutes: 0, questions: 0 };
      monthBySubject[s].minutes += d.durationMinutes || 0;
      monthBySubject[s].questions += d.questionCount || 0;
      monthMinutesTotal += d.durationMinutes || 0;
      monthQuestionsTotal += d.questionCount || 0;
    });

    // Bugün için günlük log sorgusu
    const todayLogsSnap = await adminDb
      .collection("studyLogs")
      .where("uid", "==", uid)
      .where("date", "==", todayStr)
      .get();
    const todayBySubject: Record<string, { minutes: number; questions: number }> = {};
    let todayMinutesTotal = 0;
    let todayQuestionsTotal = 0;
    todayLogsSnap.forEach((doc) => {
      const d = doc.data();
      const s: string = d.subject || "diger";
      if (!todayBySubject[s]) todayBySubject[s] = { minutes: 0, questions: 0 };
      todayBySubject[s].minutes += d.durationMinutes || 0;
      todayBySubject[s].questions += d.questionCount || 0;
      todayMinutesTotal += d.durationMinutes || 0;
      todayQuestionsTotal += d.questionCount || 0;
    });

    const goals = goalsSnap.docs.map((doc) => {
      const g = doc.data();
      const subject: string = g.subject || "all";
      const metric: "minutes" | "questions" = g.metric === "questions" ? "questions" : "minutes";
      const period: "weekly" | "monthly" = g.period === "monthly" ? "monthly" : "weekly";

      let progress = 0;
      if (period === "weekly") {
        const bucket = subject === "all" ? null : weekBySubject[subject];
        progress = metric === "minutes"
          ? (bucket ? bucket.minutes : weekMinutesTotal)
          : (bucket ? bucket.questions : weekQuestionsTotal);
      } else if (period === "monthly") {
        const bucket = subject === "all" ? null : monthBySubject[subject];
        progress = metric === "minutes"
          ? (bucket ? bucket.minutes : monthMinutesTotal)
          : (bucket ? bucket.questions : monthQuestionsTotal);
      }

      const target: number = g.target || 1;
      return {
        id: doc.id,
        subject,
        metric,
        period,
        target,
        progress,
        percent: Math.min(100, Math.round((progress / target) * 100)),
      };
    });

    return NextResponse.json({ status: "success", goals });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Desktop goals API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
