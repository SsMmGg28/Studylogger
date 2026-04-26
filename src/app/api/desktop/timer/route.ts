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
 * GET /api/desktop/timer?uid=<uid>
 *
 * Returns the current cloud timer state for the given user.
 * Used by the desktop Dynamic Island to display and sync the running timer.
 *
 * Response shape:
 *   { status: "idle" }                          — no active session
 *   { status: "running" | "paused",             — active session
 *     branchKey: string,
 *     elapsed: number,                          — total elapsed seconds (computed server-side)
 *     accumulatedSeconds: number,               — seconds before current run segment
 *     startedAt: number | null }                — Unix ms of run-segment start
 */
export async function GET(req: NextRequest) {
  const uid = await verifyDesktopToken(req);
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!adminDb) {
    return NextResponse.json({ error: "Firebase admin not configured" }, { status: 500 });
  }

  try {
    const snap = await adminDb.collection("timerSessions").doc(uid).get();

    if (!snap.exists) {
      return NextResponse.json({ status: "idle", elapsed: 0 });
    }

    const data = snap.data()!;
    let elapsed: number = data.accumulatedSeconds ?? 0;
    const startedAtMs: number | null = data.startedAt ? data.startedAt.toMillis() : null;

    if (data.status === "running" && startedAtMs !== null) {
      elapsed += Math.max(0, Math.floor((Date.now() - startedAtMs) / 1000));
    }

    return NextResponse.json({
      status: data.status as "running" | "paused",
      branchKey: data.branchKey as string,
      elapsed,
      accumulatedSeconds: data.accumulatedSeconds as number,
      startedAt: startedAtMs,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/desktop/timer
 * Body: { uid, action: "start" | "pause" | "reset", branchKey?: string, accumulatedSeconds?: number }
 *
 * start  — creates or overwrites a running timer session
 * pause  — freezes the current session, persisting elapsed time
 * reset  — deletes the session entirely
 */
export async function POST(req: NextRequest) {
  const uid = await verifyDesktopToken(req);
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!adminDb) {
    return NextResponse.json({ error: "Firebase admin not configured" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { action } = body as { uid?: string; action?: string; branchKey?: string; accumulatedSeconds?: number };
    if (!action) {
      return NextResponse.json({ error: "Missing action" }, { status: 400 });
    }

    const docRef = adminDb.collection("timerSessions").doc(uid);

    // ── start ──────────────────────────────────────────────────────────────
    if (action === "start") {
      const branchKey: string = body.branchKey ?? "tyt_matematik";
      const accumulatedSeconds: number = Number(body.accumulatedSeconds ?? 0);
      const now = new Date();
      await docRef.set({
        uid,
        branchKey,
        status: "running",
        startedAt: now,
        accumulatedSeconds,
        updatedAt: now,
      });
      return NextResponse.json({
        status: "running",
        branchKey,
        accumulatedSeconds,
        startedAt: now.getTime(),
      });
    }

    // pause and reset require an existing session
    const snap = await docRef.get();
    if (!snap.exists) {
      return NextResponse.json({ error: "No active session" }, { status: 404 });
    }

    // ── pause ──────────────────────────────────────────────────────────────
    if (action === "pause") {
      const data = snap.data()!;
      let accumulated: number = data.accumulatedSeconds ?? 0;
      if (data.status === "running" && data.startedAt) {
        accumulated += Math.max(0, Math.floor((Date.now() - data.startedAt.toMillis()) / 1000));
      }
      await docRef.update({
        status: "paused",
        startedAt: null,
        accumulatedSeconds: accumulated,
        updatedAt: new Date(),
      });
      return NextResponse.json({ status: "paused", accumulatedSeconds: accumulated });
    }

    // ── reset ──────────────────────────────────────────────────────────────
    if (action === "reset") {
      await docRef.delete();
      return NextResponse.json({ status: "idle" });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
