import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

// Use a secure secret key shared between StudyLogger and the Desktop App
const DESKTOP_SECRET = process.env.DESKTOP_API_SECRET;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!DESKTOP_SECRET || authHeader !== `Bearer ${DESKTOP_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!adminDb) {
    return NextResponse.json({ error: "Firebase admin is not configured" }, { status: 500 });
  }

  const url = new URL(req.url);
  const uid = url.searchParams.get("uid");

  if (!uid) {
    return NextResponse.json({ error: "Missing uid parameter" }, { status: 400 });
  }

  try {
    // Return today's basic stats to show in the Desktop Overlay
    const today = new Date();
    const startOfToday = today.toISOString().split("T")[0];

    const logsSnap = await adminDb.collection("studyLogs")
      .where("uid", "==", uid)
      .where("date", "==", startOfToday)
      .get();

    let todayMinutes = 0;
    let todayQuestions = 0;
    
    logsSnap.forEach((doc) => {
      const data = doc.data();
      todayMinutes += data.durationMinutes || 0;
      todayQuestions += data.questionCount || 0;
    });

    const userSnap = await adminDb.collection("users").doc(uid).get();
    const profile = userSnap.exists ? userSnap.data() : null;

    return NextResponse.json({
      status: "success",
      date: startOfToday,
      todayMinutes,
      todayQuestions,
      displayName: profile?.displayName || "Student",
    });
  } catch (error: any) {
    console.error("Desktop API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
