import { addStudyLog } from "./db";

const DB_NAME = "studylogger-offline";
const STORE_NAME = "pendingLogs";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export interface PendingLog {
  id?: number;
  uid: string;
  data: {
    subject: string;
    topic: string;
    durationMinutes: number;
    questionCount: number;
    notes?: string;
    tags?: string[];
    date: string;
  };
}

export async function queueOfflineLog(log: PendingLog): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.objectStore(STORE_NAME).add(log);
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function syncOfflineLogs(): Promise<number> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);

  const logs: PendingLog[] = await new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  if (logs.length === 0) return 0;

  let synced = 0;
  for (const log of logs) {
    try {
      await addStudyLog(log.uid, log.data);
      // Remove from queue
      const delTx = db.transaction(STORE_NAME, "readwrite");
      delTx.objectStore(STORE_NAME).delete(log.id!);
      await new Promise<void>((resolve) => { delTx.oncomplete = () => resolve(); });
      synced++;
    } catch (err) {
      console.error("[OfflineSync] Failed to sync log:", log.id, err);
      // Continue trying other logs instead of stopping
    }
  }
  if (synced > 0) console.log(`[OfflineSync] Synced ${synced}/${logs.length} offline logs`);
  return synced;
}

export async function getPendingCount(): Promise<number> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  return new Promise((resolve, reject) => {
    const req = tx.objectStore(STORE_NAME).count();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
