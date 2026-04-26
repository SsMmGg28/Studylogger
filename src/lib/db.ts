import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  serverTimestamp,
  Timestamp,
  setDoc,
  writeBatch,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";

/** Remove keys with undefined values (Firestore rejects undefined) */
function stripUndefined<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as T;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StudyLog {
  id: string;
  uid: string;
  subject: string;
  topic: string;
  durationMinutes: number;
  questionCount: number;
  notes?: string;
  tags?: string[];
  date: string; // ISO date string "YYYY-MM-DD"
  createdAt: Timestamp;
}

export interface StudyGoal {
  id: string;
  subject: string;
  metric: "minutes" | "questions";
  period: "weekly" | "monthly";
  target: number;
}

export interface UserProfile {
  displayName: string;
  username: string;
  email: string;
  privacySettings: {
    showHours: boolean;
    showQuestions: boolean;
    showSubjectBreakdown: boolean;
  };
  notificationSettings?: {
    enabled: boolean;
    reminderHours: number[];
    timezone: string;
  };
}

export interface Friendship {
  id: string;
  userA: string;
  userB: string;
  status: "pending" | "accepted";
  initiator: string;
}

// ─── Study Logs ───────────────────────────────────────────────────────────────

export async function addStudyLog(
  uid: string,
  data: Omit<StudyLog, "id" | "uid" | "createdAt">
): Promise<string> {
  const ref = await addDoc(collection(db, "studyLogs"), stripUndefined({
    ...data,
    uid,
    createdAt: serverTimestamp(),
  }));
  return ref.id;
}

export async function updateStudyLog(
  id: string,
  data: Partial<Omit<StudyLog, "id" | "uid" | "createdAt">>
): Promise<void> {
  await updateDoc(doc(db, "studyLogs", id), stripUndefined(data as Record<string, unknown>));
}

export async function deleteStudyLog(id: string): Promise<void> {
  await deleteDoc(doc(db, "studyLogs", id));
}

export async function getUserStudyLogs(uid: string): Promise<StudyLog[]> {
  // No orderBy in query — avoids composite index requirement on Firestore
  const q = query(
    collection(db, "studyLogs"),
    where("uid", "==", uid)
  );
  const snap = await getDocs(q);
  const logs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as StudyLog));
  return logs.sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    const aTs = a.createdAt?.seconds ?? 0;
    const bTs = b.createdAt?.seconds ?? 0;
    return bTs - aTs;
  });
}

export async function getFriendStudyLogs(uid: string): Promise<StudyLog[]> {
  const q = query(
    collection(db, "studyLogs"),
    where("uid", "==", uid)
  );
  const snap = await getDocs(q);
  const logs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as StudyLog));
  return logs.sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 200);
}

// ─── User Profiles ────────────────────────────────────────────────────────────

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function updateUserProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<void> {
  await updateDoc(doc(db, "users", uid), data as Record<string, unknown>);
}

export async function getUserByUsername(username: string): Promise<{ uid: string; profile: UserProfile } | null> {
  const usernameSnap = await getDoc(doc(db, "usernames", username.toLowerCase()));
  if (!usernameSnap.exists()) return null;
  const uid = usernameSnap.data().uid as string;
  const profile = await getUserProfile(uid);
  return profile ? { uid, profile } : null;
}

// ─── Friendships ──────────────────────────────────────────────────────────────

function friendshipId(a: string, b: string): string {
  return [a, b].sort().join("_");
}

export async function sendFriendRequest(fromUid: string, toUid: string): Promise<void> {
  const id = friendshipId(fromUid, toUid);
  await setDoc(doc(db, "friendships", id), {
    userA: fromUid < toUid ? fromUid : toUid,
    userB: fromUid < toUid ? toUid : fromUid,
    initiator: fromUid,
    status: "pending",
  });
}

export async function acceptFriendRequest(fromUid: string, toUid: string): Promise<void> {
  const id = friendshipId(fromUid, toUid);
  await updateDoc(doc(db, "friendships", id), { status: "accepted" });
}

export async function removeFriend(uidA: string, uidB: string): Promise<void> {
  const id = friendshipId(uidA, uidB);
  await deleteDoc(doc(db, "friendships", id));
}

export async function getFriendships(uid: string): Promise<Friendship[]> {
  const q1 = query(collection(db, "friendships"), where("userA", "==", uid));
  const q2 = query(collection(db, "friendships"), where("userB", "==", uid));
  const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
  const results: Friendship[] = [];
  snap1.forEach((d) => results.push({ id: d.id, ...d.data() } as Friendship));
  snap2.forEach((d) => {
    if (!results.find((r) => r.id === d.id))
      results.push({ id: d.id, ...d.data() } as Friendship);
  });
  return results;
}

// ─── Exam Logs (Deneme) ───────────────────────────────────────────────────────

export interface ExamLog {
  id: string;
  uid: string;
  examType: "tyt" | "ayt";
  examCategory: "tam" | "brans";
  date: string; // YYYY-MM-DD
  // Tam deneme fields
  subjectNets?: Record<string, number>; // subject id → net score
  totalNet?: number;
  // Branş denemesi fields
  subject?: string;
  net?: number;
  durationMinutes?: number;
  notes?: string;
  createdAt: Timestamp;
}

export async function addExamLog(
  uid: string,
  data: Omit<ExamLog, "id" | "uid" | "createdAt">
): Promise<string> {
  const ref = await addDoc(collection(db, "examLogs"), stripUndefined({
    ...data,
    uid,
    createdAt: serverTimestamp(),
  }));
  return ref.id;
}

export async function deleteExamLog(id: string): Promise<void> {
  await deleteDoc(doc(db, "examLogs", id));
}

export async function getUserExamLogs(uid: string): Promise<ExamLog[]> {
  const q = query(collection(db, "examLogs"), where("uid", "==", uid));
  const snap = await getDocs(q);
  const logs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ExamLog));
  return logs.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// ─── Stats helpers ────────────────────────────────────────────────────────────

export function aggregateBySubject(logs: StudyLog[]): Record<string, { minutes: number; questions: number }> {
  const map: Record<string, { minutes: number; questions: number }> = {};
  for (const log of logs) {
    if (!map[log.subject]) map[log.subject] = { minutes: 0, questions: 0 };
    map[log.subject].minutes += log.durationMinutes;
    map[log.subject].questions += log.questionCount;
  }
  return map;
}

export function aggregateByTopic(logs: StudyLog[]): Record<string, { minutes: number; questions: number }> {
  const map: Record<string, { minutes: number; questions: number }> = {};
  for (const log of logs) {
    const key = `${log.subject}:${log.topic}`;
    if (!map[key]) map[key] = { minutes: 0, questions: 0 };
    map[key].minutes += log.durationMinutes;
    map[key].questions += log.questionCount;
  }
  return map;
}

export function getLastStudiedByTopic(logs: StudyLog[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const log of logs) {
    const key = `${log.subject}:${log.topic}`;
    if (!map[key] || log.date > map[key]) {
      map[key] = log.date;
    }
  }
  return map;
}

// SM-2 tabanlı basit bir model
// Her konu için kullanıcının kaç kez çalıştığını, ortalama çalışma süresini ve son tarihi alıp
// bir "spaced repetition interval" (gün cinsinden) hesaplar.
export function calculateSM2Intervals(logs: StudyLog[]): Record<string, { lastStudied: string; interval: number; repetitions: number; nextReview: string }> {
  const tMap: Record<string, { lastStudied: string; reps: number; successFactor: number }> = {};
  
  for (const log of logs) {
    const key = `${log.subject}:${log.topic}`;
    if (!tMap[key]) {
      tMap[key] = { lastStudied: log.date, reps: 1, successFactor: log.questionCount > 0 ? 1.2 : 0.8 };
    } else {
      tMap[key].reps += 1;
      tMap[key].successFactor += log.questionCount > 0 ? 0.2 : 0; // Soru çözüldüyse pekişmiş sayılır
      if (log.date > tMap[key].lastStudied) {
        tMap[key].lastStudied = log.date;
      }
    }
  }

  const result: Record<string, { lastStudied: string; interval: number; repetitions: number; nextReview: string }> = {};
  
  for (const [key, data] of Object.entries(tMap)) {
    // SM-2 Base logic: 
    // Rep 1 = 1 day, Rep 2 = 6 days, Rep > 2 = (Rep - 1) * EF
    // EF (Ease Factor) = 2.5
    const easeFactor = Math.max(1.3, 2.5 * (data.successFactor / data.reps));
    
    let interval = 1;
    if (data.reps === 2) interval = 6;
    else if (data.reps > 2) {
      interval = Math.round(6 * Math.pow(easeFactor, data.reps - 2));
    }
    
    // Güvenlik tavanı: Max 60 gün
    interval = Math.min(interval, 60);

    const lastDate = new Date(data.lastStudied);
    const nextDate = new Date(lastDate);
    nextDate.setDate(lastDate.getDate() + interval);

    result[key] = {
      lastStudied: data.lastStudied,
      interval,
      repetitions: data.reps,
      nextReview: nextDate.toISOString().split("T")[0],
    };
  }

  return result;
}

// ─── Goals ────────────────────────────────────────────────────────────────────

export async function getGoals(uid: string): Promise<StudyGoal[]> {
  const q = query(collection(db, "users", uid, "goals"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as StudyGoal));
}

export async function setGoal(
  uid: string,
  data: Omit<StudyGoal, "id">
): Promise<string> {
  const ref = await addDoc(collection(db, "users", uid, "goals"), data);
  return ref.id;
}

export async function deleteGoal(uid: string, goalId: string): Promise<void> {
  await deleteDoc(doc(db, "users", uid, "goals", goalId));
}

// ─── Topic Progress ────────────────────────────────────────────────────────────

export interface TopicProgress {
  completed: string[];
}

/** Fetch all completed topics for a user, keyed by subjectId. */
export async function getTopicProgress(uid: string): Promise<Record<string, string[]>> {
  const snap = await getDocs(collection(db, "users", uid, "topicProgress"));
  const result: Record<string, string[]> = {};
  snap.docs.forEach((d) => {
    result[d.id] = (d.data() as TopicProgress).completed ?? [];
  });
  return result;
}

/** Mark or unmark a single topic as completed using atomic array operations. */
export async function setTopicCompleted(
  uid: string,
  subjectId: string,
  topic: string,
  completed: boolean
): Promise<void> {
  const ref = doc(db, "users", uid, "topicProgress", subjectId);
  await setDoc(
    ref,
    { completed: completed ? arrayUnion(topic) : arrayRemove(topic) },
    { merge: true }
  );
}

// ─── Weekly Schedule ──────────────────────────────────────────────────────────

export interface ScheduleItem {
  id: string;
  uid: string;
  subject: string;
  topic?: string;       // optional when branch is used
  date: string;         // YYYY-MM-DD (the specific day)
  weekStart: string;    // YYYY-MM-DD (Monday of the week)
  targetQuestions?: number;
  targetMinutes?: number;
  branch?: string;
  status: "pending" | "done";
  actualQuestions?: number;
  actualMinutes?: number;
  completedAt?: Timestamp;
}

export async function getScheduleItems(uid: string, weekStart: string): Promise<ScheduleItem[]> {
  const q = query(
    collection(db, "users", uid, "schedule"),
    where("weekStart", "==", weekStart)
  );
  const snap = await getDocs(q);
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ScheduleItem));
  return items.sort((a, b) => (a.date < b.date ? -1 : 1));
}

export async function getAllScheduleItems(uid: string): Promise<ScheduleItem[]> {
  const snap = await getDocs(collection(db, "users", uid, "schedule"));
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ScheduleItem));
  return items.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function addScheduleItem(
  uid: string,
  data: Omit<ScheduleItem, "id" | "uid" | "completedAt">
): Promise<string> {
  const ref = await addDoc(
    collection(db, "users", uid, "schedule"),
    stripUndefined({ ...data, uid })
  );
  return ref.id;
}

export async function completeScheduleItem(
  uid: string,
  itemId: string,
  actual: { actualQuestions?: number; actualMinutes?: number }
): Promise<void> {
  await updateDoc(doc(db, "users", uid, "schedule", itemId), stripUndefined({
    ...actual,
    status: "done",
    completedAt: serverTimestamp(),
  } as Record<string, unknown>));
}

export async function deleteScheduleItem(uid: string, itemId: string): Promise<void> {
  await deleteDoc(doc(db, "users", uid, "schedule", itemId));
}

// ─── Cloud Timer Sessions ─────────────────────────────────────────────────────
// One document per user at timerSessions/{uid}.
// The source of truth for the timer — survives screen off, tab close, page refresh.

export interface TimerSession {
  uid: string;
  status: "running" | "paused";
  branchKey: string;
  /** Server timestamp of when the current run segment started. Null when paused. */
  startedAt: Timestamp | null;
  /** Total seconds accumulated across all previous run segments. */
  accumulatedSeconds: number;
  updatedAt: Timestamp;
}

/** Subscribe to the user's active timer session in real time. */
export function subscribeTimerSession(
  uid: string,
  callback: (session: TimerSession | null) => void,
  onError?: (error: Error) => void
): () => void {
  if (!db) return () => {};
  const docRef = doc(db, "timerSessions", uid);
  return onSnapshot(
    docRef,
    (snap) => {
      callback(snap.exists() ? (snap.data() as TimerSession) : null);
    },
    (error) => {
      onError?.(error);
    }
  );
}

/** Start or resume the timer. Records server timestamp as the run-segment start. */
export async function startTimer(
  uid: string,
  branchKey: string,
  accumulatedSeconds: number
): Promise<void> {
  if (!db) return;
  await setDoc(doc(db, "timerSessions", uid), {
    uid,
    branchKey,
    status: "running",
    startedAt: serverTimestamp(),
    accumulatedSeconds,
    updatedAt: serverTimestamp(),
  });
}

/** Pause the timer, persisting the current elapsed seconds. */
export async function pauseTimer(uid: string, accumulatedSeconds: number): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, "timerSessions", uid), {
    status: "paused",
    startedAt: null,
    accumulatedSeconds,
    updatedAt: serverTimestamp(),
  });
}

/** Clear the timer session entirely (after reset or save). */
export async function resetTimer(uid: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, "timerSessions", uid));
}
