import { subDays, format } from "date-fns";
import type { StudyLog, UserProfile, Friendship } from "./db";
import type { Timestamp } from "firebase/firestore";
import type { FriendData } from "@/hooks/useFriends";

export const DEMO_UID = "demo-user-000";

export const DEMO_PROFILE: UserProfile = {
  displayName: "Demo Kullanıcı",
  username: "demo",
  email: "demo@studylogger.app",
  privacySettings: {
    showHours: true,
    showQuestions: true,
    showSubjectBreakdown: true,
  },
};

function fakeTs(date: Date): Timestamp {
  return {
    seconds: Math.floor(date.getTime() / 1000),
    nanoseconds: 0,
    toDate: () => date,
    toMillis: () => date.getTime(),
    isEqual: () => false,
    valueOf: () => date.toISOString(),
  } as unknown as Timestamp;
}

function log(
  daysAgo: number,
  subject: string,
  topic: string,
  durationMinutes: number,
  questionCount: number,
  notes?: string
): StudyLog {
  const date = format(subDays(new Date(), daysAgo), "yyyy-MM-dd");
  const d = subDays(new Date(), daysAgo);
  return {
    id: `demo-${daysAgo}-${subject}-${Math.random().toString(36).slice(2, 6)}`,
    uid: DEMO_UID,
    subject,
    topic,
    durationMinutes,
    questionCount,
    notes,
    date,
    createdAt: fakeTs(d),
  };
}

export const DEMO_LOGS: StudyLog[] = [
  // Bugün
  log(0, "matematik",     "Türev",                 90, 40, "Zincir kuralı ve çarpım kuralı tekrar"),
  log(0, "fizik",         "Elektrik",              60, 25),
  // Dün
  log(1, "matematik",     "İntegral",             120, 50),
  log(1, "turkce",        "Paragraf",              45, 30),
  // 2 gün önce
  log(2, "kimya",         "Organik Kimya",         75, 35),
  log(2, "biyoloji",      "Hücre",                 60, 20),
  // 3 gün önce
  log(3, "matematik",     "Limit ve Süreklilik",   90, 45),
  log(3, "fizik",         "Kuvvet ve Hareket",     80, 30),
  // 4 gün önce
  log(4, "tyt_matematik", "Temel Kavramlar",       60, 50),
  log(4, "tarih",         "Osmanlı Dönemi",        45, 25),
  // 5 gün önce
  log(5, "matematik",     "Türev",                100, 55),
  log(5, "kimya",         "Asit-Baz",              60, 28),
  // 6 gün önce
  log(6, "biyoloji",      "Kalıtım",               70, 22),
  // 8 gün önce
  log(8, "matematik",     "İntegral",              90, 40),
  log(8, "fizik",         "Dalgalar",              75, 32),
  // 9 gün önce
  log(9, "turkce",        "Sözcük Türleri",        50, 35),
  // 10 gün önce
  log(10, "matematik",    "Türev",                 80, 45),
  log(10, "kimya",        "Elektrokimya",          65, 30),
  // 12 gün önce
  log(12, "matematik",    "Limit ve Süreklilik",   90, 50),
  // 14 gün önce
  log(14, "fizik",        "Optik",                 70, 28),
  log(14, "biyoloji",     "DNA ve Protein Sentezi",80, 18),
  // 16 gün önce
  log(16, "matematik",    "Denklemler",            95, 60),
  log(16, "turkce",       "Cümlede Anlam",         40, 28),
  // 19 gün önce
  log(19, "kimya",        "Kimyasal Denge",        70, 33),
  log(19, "fizik",        "Termodinamik",          60, 20),
  // 21 gün önce
  log(21, "matematik",    "Trigonometri",          85, 48),
  log(21, "biyoloji",     "Fotosentez",            55, 15),
];

// ─── Demo Friends ─────────────────────────────────────────

function friendLog(
  uid: string,
  daysAgo: number,
  subject: string,
  topic: string,
  durationMinutes: number,
  questionCount: number,
): StudyLog {
  const date = format(subDays(new Date(), daysAgo), "yyyy-MM-dd");
  const d = subDays(new Date(), daysAgo);
  return {
    id: `${uid}-${daysAgo}-${subject}-${Math.random().toString(36).slice(2, 6)}`,
    uid,
    subject,
    topic,
    durationMinutes,
    questionCount,
    date,
    createdAt: fakeTs(d),
  };
}

const FRIEND_1_UID = "demo-friend-001";
const FRIEND_2_UID = "demo-friend-002";
const FRIEND_3_UID = "demo-friend-003";

const FRIEND_1_PROFILE: UserProfile = {
  displayName: "Elif Yılmaz",
  username: "elif_yilmaz",
  email: "elif@example.com",
  privacySettings: { showHours: true, showQuestions: true, showSubjectBreakdown: true },
};

const FRIEND_2_PROFILE: UserProfile = {
  displayName: "Burak Kaya",
  username: "burak_k",
  email: "burak@example.com",
  privacySettings: { showHours: true, showQuestions: true, showSubjectBreakdown: true },
};

const FRIEND_3_PROFILE: UserProfile = {
  displayName: "Zeynep Demir",
  username: "zeynep_d",
  email: "zeynep@example.com",
  privacySettings: { showHours: true, showQuestions: false, showSubjectBreakdown: true },
};

const FRIEND_1_LOGS: StudyLog[] = [
  friendLog(FRIEND_1_UID, 0, "matematik",  "İntegral",          120, 55),
  friendLog(FRIEND_1_UID, 0, "kimya",      "Organik Kimya",      80, 40),
  friendLog(FRIEND_1_UID, 1, "fizik",      "Elektrik",           90, 35),
  friendLog(FRIEND_1_UID, 1, "turkce",     "Paragraf",           60, 40),
  friendLog(FRIEND_1_UID, 2, "matematik",  "Türev",             100, 48),
  friendLog(FRIEND_1_UID, 3, "biyoloji",   "Kalıtım",           75, 25),
  friendLog(FRIEND_1_UID, 3, "matematik",  "Limit ve Süreklilik",95, 50),
  friendLog(FRIEND_1_UID, 4, "fizik",      "Kuvvet ve Hareket",  85, 32),
  friendLog(FRIEND_1_UID, 5, "kimya",      "Asit-Baz",           70, 30),
  friendLog(FRIEND_1_UID, 6, "matematik",  "Trigonometri",       90, 45),
  friendLog(FRIEND_1_UID, 8, "fizik",      "Optik",              60, 22),
  friendLog(FRIEND_1_UID, 10, "matematik", "Denklemler",        110, 60),
  friendLog(FRIEND_1_UID, 12, "turkce",    "Cümlede Anlam",      50, 35),
  friendLog(FRIEND_1_UID, 14, "kimya",     "Kimyasal Denge",     65, 28),
  friendLog(FRIEND_1_UID, 16, "biyoloji",  "DNA ve Protein Sentezi", 80, 20),
  friendLog(FRIEND_1_UID, 19, "matematik", "Polinomlar",         85, 42),
];

const FRIEND_2_LOGS: StudyLog[] = [
  friendLog(FRIEND_2_UID, 0, "fizik",       "Termodinamik",       90, 30),
  friendLog(FRIEND_2_UID, 1, "matematik",   "Türev",              80, 38),
  friendLog(FRIEND_2_UID, 1, "kimya",       "Elektrokimya",       60, 25),
  friendLog(FRIEND_2_UID, 2, "tyt_matematik","Sayılar",           45, 60),
  friendLog(FRIEND_2_UID, 3, "fizik",       "Dalgalar",           70, 28),
  friendLog(FRIEND_2_UID, 4, "matematik",   "İntegral",           95, 45),
  friendLog(FRIEND_2_UID, 5, "biyoloji",    "Hücre",              55, 18),
  friendLog(FRIEND_2_UID, 7, "matematik",   "Limit ve Süreklilik",75, 40),
  friendLog(FRIEND_2_UID, 9, "fizik",       "Elektrik",           65, 22),
  friendLog(FRIEND_2_UID, 11, "kimya",      "Çözeltiler",         50, 20),
  friendLog(FRIEND_2_UID, 14, "matematik",  "Trigonometri",       80, 35),
  friendLog(FRIEND_2_UID, 18, "tarih",      "Osmanlı Dönemi",     40, 25),
];

const FRIEND_3_LOGS: StudyLog[] = [
  friendLog(FRIEND_3_UID, 0, "matematik",   "Türev",             140, 65),
  friendLog(FRIEND_3_UID, 0, "fizik",       "Elektrik",          100, 40),
  friendLog(FRIEND_3_UID, 1, "kimya",       "Organik Kimya",      90, 38),
  friendLog(FRIEND_3_UID, 1, "matematik",   "İntegral",          110, 52),
  friendLog(FRIEND_3_UID, 2, "biyoloji",    "Kalıtım",            80, 30),
  friendLog(FRIEND_3_UID, 2, "turkce",      "Paragraf",           75, 45),
  friendLog(FRIEND_3_UID, 3, "matematik",   "Limit ve Süreklilik",100, 50),
  friendLog(FRIEND_3_UID, 3, "fizik",       "Kuvvet ve Hareket",  90, 35),
  friendLog(FRIEND_3_UID, 4, "kimya",       "Asit-Baz",           85, 33),
  friendLog(FRIEND_3_UID, 5, "matematik",   "Trigonometri",      120, 55),
  friendLog(FRIEND_3_UID, 5, "fizik",       "Dalgalar",           70, 28),
  friendLog(FRIEND_3_UID, 6, "biyoloji",    "Fotosentez",         65, 20),
  friendLog(FRIEND_3_UID, 7, "matematik",   "Denklemler",        100, 48),
  friendLog(FRIEND_3_UID, 9, "kimya",       "Kimyasal Denge",     80, 35),
  friendLog(FRIEND_3_UID, 10, "turkce",     "Sözcük Türleri",     55, 30),
  friendLog(FRIEND_3_UID, 12, "matematik",  "Polinomlar",         90, 42),
  friendLog(FRIEND_3_UID, 14, "fizik",      "Optik",              75, 25),
  friendLog(FRIEND_3_UID, 17, "matematik",  "Fonksiyonlar",      105, 50),
  friendLog(FRIEND_3_UID, 20, "biyoloji",   "Metabolizma",        70, 22),
];

function buildFriendData(uid: string, profile: UserProfile, logs: StudyLog[]): FriendData {
  const bySubject: Record<string, { minutes: number; questions: number }> = {};
  for (const l of logs) {
    if (!bySubject[l.subject]) bySubject[l.subject] = { minutes: 0, questions: 0 };
    bySubject[l.subject].minutes += l.durationMinutes;
    bySubject[l.subject].questions += l.questionCount;
  }
  return {
    uid,
    profile,
    friendship: {
      id: `fs-${uid}`,
      userA: DEMO_UID,
      userB: uid,
      status: "accepted",
      initiator: DEMO_UID,
    },
    logs,
    stats: {
      totalMinutes: logs.reduce((s, l) => s + l.durationMinutes, 0),
      totalQuestions: logs.reduce((s, l) => s + l.questionCount, 0),
      bySubject,
    },
  };
}

export const DEMO_FRIENDS: FriendData[] = [
  buildFriendData(FRIEND_1_UID, FRIEND_1_PROFILE, FRIEND_1_LOGS),
  buildFriendData(FRIEND_2_UID, FRIEND_2_PROFILE, FRIEND_2_LOGS),
  buildFriendData(FRIEND_3_UID, FRIEND_3_PROFILE, FRIEND_3_LOGS),
].sort((a, b) => b.stats.totalMinutes - a.stats.totalMinutes);
