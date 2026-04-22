"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { getTopicProgress, setTopicCompleted } from "@/lib/db";
import { DEMO_UID } from "@/lib/demo-data";

export function useTopicProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    if (user.uid === DEMO_UID) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getTopicProgress(user.uid)
      .then((data) => setProgress(data))
      .finally(() => setLoading(false));
  }, [user]);

  const toggleTopic = useCallback(
    async (subjectId: string, topic: string) => {
      if (!user || user.uid === DEMO_UID) return;
      const current = progress[subjectId] ?? [];
      const nowCompleted = !current.includes(topic);
      // Optimistic update
      setProgress((prev) => ({
        ...prev,
        [subjectId]: nowCompleted
          ? [...current, topic]
          : current.filter((t) => t !== topic),
      }));
      await setTopicCompleted(user.uid, subjectId, topic, nowCompleted);
    },
    [user, progress]
  );

  const isCompleted = useCallback(
    (subjectId: string, topic: string): boolean =>
      (progress[subjectId] ?? []).includes(topic),
    [progress]
  );

  const getSubjectCompletedCount = useCallback(
    (subjectId: string): number => (progress[subjectId] ?? []).length,
    [progress]
  );

  const getTotalStats = useCallback(
    (subjects: { id: string; topics: string[] }[]) => {
      const total = subjects.reduce((s, sub) => s + sub.topics.length, 0);
      const completed = subjects.reduce(
        (s, sub) => s + (progress[sub.id] ?? []).length,
        0
      );
      return { total, completed };
    },
    [progress]
  );

  return { progress, loading, toggleTopic, isCompleted, getSubjectCompletedCount, getTotalStats };
}
