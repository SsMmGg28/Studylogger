"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getFriendships,
  getUserProfile,
  getFriendStudyLogs,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
  aggregateBySubject,
  type Friendship,
  type UserProfile,
  type StudyLog,
} from "@/lib/db";
import { DEMO_UID, DEMO_FRIENDS } from "@/lib/demo-data";

export interface FriendData {
  uid: string;
  profile: UserProfile;
  friendship: Friendship;
  logs: StudyLog[];
  stats: {
    totalMinutes: number;
    totalQuestions: number;
    bySubject: Record<string, { minutes: number; questions: number }>;
  };
}

interface UseFriendsResult {
  friends: FriendData[];
  pending: Array<{ friendship: Friendship; profile: UserProfile; uid: string }>;
  loading: boolean;
  refresh: () => Promise<void>;
  sendRequest: (toUid: string) => Promise<void>;
  accept: (fromUid: string) => Promise<void>;
  remove: (friendUid: string) => Promise<void>;
}

export function useFriends(uid: string | null): UseFriendsResult {
  const [friends, setFriends] = useState<FriendData[]>([]);
  const [pending, setPending] = useState<Array<{ friendship: Friendship; profile: UserProfile; uid: string }>>([]);
  const [loading, setLoading] = useState(true);
  const isDemo = uid === DEMO_UID;

  const refresh = useCallback(async () => {
    if (!uid) return;
    if (isDemo) {
      setFriends([...DEMO_FRIENDS]);
      setPending([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const friendships = await getFriendships(uid);

    const accepted: FriendData[] = [];
    const pendingArr: Array<{ friendship: Friendship; profile: UserProfile; uid: string }> = [];

    await Promise.all(
      friendships.map(async (fs) => {
        const friendUid = fs.userA === uid ? fs.userB : fs.userA;
        const profile = await getUserProfile(friendUid);
        if (!profile) return;

        if (fs.status === "accepted") {
          const logs = await getFriendStudyLogs(friendUid);
          const bySubject = aggregateBySubject(logs);
          const totalMinutes = Object.values(bySubject).reduce((s, v) => s + v.minutes, 0);
          const totalQuestions = Object.values(bySubject).reduce((s, v) => s + v.questions, 0);
          accepted.push({ uid: friendUid, profile, friendship: fs, logs, stats: { totalMinutes, totalQuestions, bySubject } });
        } else if (fs.status === "pending" && fs.initiator !== uid) {
          // incoming request
          pendingArr.push({ friendship: fs, profile, uid: friendUid });
        }
      })
    );

    setFriends(accepted.sort((a, b) => b.stats.totalMinutes - a.stats.totalMinutes));
    setPending(pendingArr);
    setLoading(false);
  }, [uid, isDemo]);

  useEffect(() => {
    if (uid) refresh();
    else { setFriends([]); setPending([]); setLoading(false); }
  }, [uid, refresh]);

  const sendRequest = async (toUid: string) => {
    if (!uid || isDemo) return;
    await sendFriendRequest(uid, toUid);
    await refresh();
  };

  const accept = async (fromUid: string) => {
    if (!uid || isDemo) return;
    await acceptFriendRequest(fromUid, uid);
    await refresh();
  };

  const remove = async (friendUid: string) => {
    if (!uid) return;
    if (isDemo) {
      setFriends((prev) => prev.filter((f) => f.uid !== friendUid));
      return;
    }
    await removeFriend(uid, friendUid);
    await refresh();
  };

  return { friends, pending, loading, refresh, sendRequest, accept, remove };
}
