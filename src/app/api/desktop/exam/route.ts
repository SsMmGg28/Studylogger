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

    const examType: string = payload.examType;
    const examCategory: string = payload.examCategory || "brans";
    const date: string = payload.date || new Date().toISOString().split("T")[0];

    if (!examType || !["tyt", "ayt"].includes(examType)) {
      return NextResponse.json({ error: "Invalid examType" }, { status: 400 });
    }
    if (!["tam", "brans"].includes(examCategory)) {
      return NextResponse.json({ error: "Invalid examCategory" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: Record<string, any> = {
      uid,
      examType,
      examCategory,
      date,
      createdAt: new Date(),
      source: "desktop_app",
    };

    if (examCategory === "brans") {
      const subject = payload.subject;
      const net = payload.net != null ? Number(payload.net) : null;
      if (!subject || net == null) {
        return NextResponse.json(
          { error: "subject and net are required for branş denemesi" },
          { status: 400 }
        );
      }
      data.subject = String(subject);
      data.net = net;
      if (payload.durationMinutes) data.durationMinutes = Number(payload.durationMinutes);
      if (payload.notes) data.notes = String(payload.notes);
    } else {
      // tam deneme
      if (payload.subjectNets && typeof payload.subjectNets === "object") {
        data.subjectNets = payload.subjectNets;
      }
      if (payload.totalNet != null) data.totalNet = Number(payload.totalNet);
      if (payload.notes) data.notes = String(payload.notes);
    }

    const ref = adminDb.collection("examLogs").doc();
    await ref.set(data);

    return NextResponse.json({ status: "success", examLogId: ref.id });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
