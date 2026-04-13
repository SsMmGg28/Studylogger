import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) return false;

  const permission = await Notification.requestPermission();
  return permission === "granted";
}

export function sendLocalNotification(title: string, body: string): void {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  new Notification(title, {
    body,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: "studylogger",
  });
}

export async function saveFCMToken(uid: string, token: string): Promise<void> {
  await setDoc(doc(db, "users", uid, "tokens", token), {
    token,
    createdAt: new Date(),
    platform: navigator.userAgent,
  });
}

/**
 * Check if user should be reminded.
 * Call this when the app loads — if last study was > 20 hours ago, show reminder.
 */
export function checkStudyReminder(lastLogDate: string | null): boolean {
  if (!lastLogDate) return true; // never studied
  const last = new Date(lastLogDate + "T23:59:59");
  const now = new Date();
  const hoursSince = (now.getTime() - last.getTime()) / (1000 * 60 * 60);
  return hoursSince > 20;
}

/**
 * Check streak warning — if user is about to lose their streak.
 */
export function checkStreakWarning(lastLogDate: string | null): boolean {
  if (!lastLogDate) return false;
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  // If last log was yesterday (not today), warn
  return lastLogDate === yesterday && lastLogDate !== today;
}
