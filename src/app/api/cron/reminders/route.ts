import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      status: "disabled",
      message: "Hourly reminders are temporarily disabled.",
    },
    { status: 200 }
  );
}
