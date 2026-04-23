import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminAuth, isFirebaseAdminConfigured } from "@/lib/firebase-admin";

export async function POST() {
  if (!isFirebaseAdminConfigured || !adminAuth) {
    return NextResponse.json({ error: "Firebase admin not configured" }, { status: 503 });
  }

  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const uid = decoded.uid;

    const customToken = await adminAuth.createCustomToken(uid);

    return NextResponse.json({ token: customToken });
  } catch (error) {
    console.error("Custom token generation error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
