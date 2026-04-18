import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminMessaging } from "@/lib/firebase-admin";

type NotificationSettings = {
  enabled?: boolean;
  reminderHours?: number[];
  timezone?: string;
};

function getDateInTimezone(now: Date, timezone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;
  return `${year}-${month}-${day}`;
}

function getHourInTimezone(now: Date, timezone: string): number {
  const hourText = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    hour12: false,
  }).format(now);
  return Number(hourText);
}

export async function GET(request: NextRequest) {
  // CRON endpoint, requires authorization token
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!adminDb || !adminMessaging) {
    return NextResponse.json({ error: "Firebase admin is not configured" }, { status: 500 });
  }

  try {
    const now = new Date();

    const usersSnapshot = await adminDb.collection("users").get();
    const tokensToSend: string[] = [];
    let usersInScheduleWindow = 0;
    let skippedBySchedule = 0;
    let skippedBecauseStudied = 0;

    for (const doc of usersSnapshot.docs) {
      const uid = doc.id;
      const profile = doc.data() as { notificationSettings?: NotificationSettings };
      const settings = profile.notificationSettings;

      const enabled = settings?.enabled ?? true;
      if (!enabled) {
        skippedBySchedule += 1;
        continue;
      }

      const timezone = settings?.timezone || "Europe/Istanbul";
      const reminderHours = Array.isArray(settings?.reminderHours) && settings?.reminderHours.length > 0
        ? settings!.reminderHours!.filter((h) => Number.isInteger(h) && h >= 0 && h <= 23)
        : [19];

      const localHour = getHourInTimezone(now, timezone);
      if (!reminderHours.includes(localHour)) {
        skippedBySchedule += 1;
        continue;
      }

      usersInScheduleWindow += 1;
      const localDate = getDateInTimezone(now, timezone);
      
      // Does user have a log today?
      const logSearch = await adminDb.collection("studyLogs")
        .where("uid", "==", uid)
        .where("date", "==", localDate)
        .limit(1)
        .get();

      if (logSearch.empty) {
        // No log today, so grab ALL tokens and gather them
        const tokensSnap = await adminDb.collection(`users/${uid}/tokens`).get();
        tokensSnap.forEach(tDoc => {
          tokensToSend.push(tDoc.id); // Doc IDs are the actual FCM tokens
        });
      } else {
        skippedBecauseStudied += 1;
      }
    }

    if (tokensToSend.length > 0) {
      await adminMessaging.sendEachForMulticast({
        tokens: [...new Set(tokensToSend)],
        notification: {
          title: "StudyLogger Hatırlatma",
          body: "Bugun hedeflerine bir adim daha yaklasmak icin kisa bir calisma kaydi ekle.",
        },
      });
    }

    return NextResponse.json({
      status: "Success",
      usersChecked: usersSnapshot.size,
      usersInScheduleWindow,
      skippedBySchedule,
      skippedBecauseStudied,
      tokensReady: [...new Set(tokensToSend)].length,
    });
  } catch (error) {
    console.error("Cron Error", error);
    return new NextResponse("Failed", { status: 500 });
  }
}
