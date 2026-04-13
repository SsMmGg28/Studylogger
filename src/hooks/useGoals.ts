"use client";

import { useEffect, useState, useCallback } from "react";
import { getGoals, setGoal, deleteGoal, type StudyGoal } from "@/lib/db";

interface UseGoalsResult {
  goals: StudyGoal[];
  loading: boolean;
  refresh: () => Promise<void>;
  add: (data: Omit<StudyGoal, "id">) => Promise<void>;
  remove: (goalId: string) => Promise<void>;
}

export function useGoals(uid: string | null): UseGoalsResult {
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!uid) return;
    setLoading(true);
    const data = await getGoals(uid);
    setGoals(data);
    setLoading(false);
  }, [uid]);

  useEffect(() => {
    if (!uid) {
      setGoals([]);
      setLoading(false);
    } else {
      refresh();
    }
  }, [uid, refresh]);

  const add = async (data: Omit<StudyGoal, "id">) => {
    if (!uid) return;
    await setGoal(uid, data);
    await refresh();
  };

  const remove = async (goalId: string) => {
    if (!uid) return;
    await deleteGoal(uid, goalId);
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
  };

  return { goals, loading, refresh, add, remove };
}
