"use client";

import { useEffect, useState, useCallback } from "react";
import { getUserStudyLogs, addStudyLog, updateStudyLog, deleteStudyLog, type StudyLog } from "@/lib/db";
import type { Timestamp } from "firebase/firestore";
import { DEMO_UID, DEMO_LOGS } from "@/lib/demo-data";

interface UseStudyLogsResult {
  logs: StudyLog[];
  loading: boolean;
  refresh: () => Promise<void>;
  add: (data: Omit<StudyLog, "id" | "uid" | "createdAt">) => Promise<void>;
  update: (id: string, data: Partial<Omit<StudyLog, "id" | "uid" | "createdAt">>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export function useStudyLogs(uid: string | null): UseStudyLogsResult {
  const [logs, setLogs] = useState<StudyLog[]>([]);
  const [loading, setLoading] = useState(true);

  const isDemo = uid === DEMO_UID;

  const refresh = useCallback(async () => {
    if (!uid || isDemo) return;
    setLoading(true);
    const data = await getUserStudyLogs(uid);
    setLogs(data);
    setLoading(false);
  }, [uid, isDemo]);

  useEffect(() => {
    if (!uid) {
      setLogs([]);
      setLoading(false);
    } else if (isDemo) {
      setLogs([...DEMO_LOGS]);
      setLoading(false);
    } else {
      refresh();
    }
  }, [uid, isDemo, refresh]);

  const add = async (data: Omit<StudyLog, "id" | "uid" | "createdAt">) => {
    if (!uid) return;
    if (isDemo) {
      const now = new Date();
      const newLog: StudyLog = {
        ...data,
        id: `demo-new-${Date.now()}`,
        uid: DEMO_UID,
        createdAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0, toDate: () => now } as unknown as Timestamp,
      };
      setLogs((prev) => [newLog, ...prev]);
      return;
    }
    await addStudyLog(uid, data);
    await refresh();
  };

  const update = async (id: string, data: Partial<Omit<StudyLog, "id" | "uid" | "createdAt">>) => {
    await updateStudyLog(id, data);
    await refresh();
  };

  const remove = async (id: string) => {
    if (!isDemo) await deleteStudyLog(id);
    setLogs((prev) => prev.filter((l) => l.id !== id));
  };

  return { logs, loading, refresh, add, update, remove };
}
