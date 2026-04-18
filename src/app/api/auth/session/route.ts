import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminAuth, isFirebaseAdminConfigured } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    if (!isFirebaseAdminConfigured || !adminAuth) {
      return NextResponse.json({ error: "Firebase admin not configured" }, { status: 503 });
    }

    const { idToken } = await request.json();
    
    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    // Create session cookie with 14 days expiration
    const expiresIn = 60 * 60 * 24 * 14 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    const cookieStore = await cookies();
    
    cookieStore.set("session", sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax"
    });

    return NextResponse.json({ status: "success", uid });
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  cookieStore.delete("client-session");
  return NextResponse.json({ status: "success" });
}
