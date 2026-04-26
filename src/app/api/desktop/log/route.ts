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

export async function POST(req: NextRequest) {
  const uid = await verifyDesktopToken(req);
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!adminDb) {
    return NextResponse.json({ error: "Firebase admin is not configured" }, { status: 500 });
  }

  try {
    const payload = await req.json();
    
    // Default subject to "other" or assume the desktop app sends valid subject/topic IDs
    const subject = payload.subject || "diger";
    const topic = payload.topic || "Serbest Calisma";
    const durationMinutes = Number(payload.durationMinutes) || 0;
    const questionCount = Number(payload.questionCount) || 0;
    const notes = payload.notes || "Masaüstü odaklanma moduyla eklendi.";
    
    if (durationMinutes <= 0 && questionCount <= 0) {
      return NextResponse.json({ error: "Can't log empty session" }, { status: 400 });
    }

    const todayStr = new Date().toISOString().split("T")[0];

    const newLogRef = adminDb.collection("studyLogs").doc();
    const ts = new Date();

    const data = {
      uid,
      subject,
      topic,
      durationMinutes,
      questionCount,
      notes,
      date: todayStr,
      source: "desktop_app",
      createdAt: ts,
    };

    await newLogRef.set(data);

    return NextResponse.json({
      status: "success",
      logId: newLogRef.id,
      activityAdded: {
        durationMinutes,
        questionCount
      }
    });

  } catch (error: any) {
    console.error("Desktop Session Log Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
