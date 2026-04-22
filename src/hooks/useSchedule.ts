"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ScheduleItem,
  getScheduleItems,
  addScheduleItem,
  completeScheduleItem,
  deleteScheduleItem,
} from "@/lib/db";

export function useSchedule(uid: string | null, weekStart: string) {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!uid) return;
    setLoading(true);
    try {
      const data = await getScheduleItems(uid, weekStart);
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, [uid, weekStart]);

  useEffect(() => {
    load();
  }, [load]);

  async function add(data: Omit<ScheduleItem, "id" | "uid" | "completedAt">) {
    if (!uid) return;
    const id = await addScheduleItem(uid, data);
    setItems((prev) => [...prev, { ...data, id, uid } as ScheduleItem]);
  }

  async function complete(
    itemId: string,
    actual: { actualQuestions?: number; actualMinutes?: number }
  ) {
    if (!uid) return;
    await completeScheduleItem(uid, itemId, actual);
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, ...actual, status: "done" } : item
      )
    );
  }

  async function remove(itemId: string) {
    if (!uid) return;
    await deleteScheduleItem(uid, itemId);
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  }

  return { items, loading, add, complete, remove, reload: load };
}
