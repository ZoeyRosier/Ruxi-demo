// 此文件属于品牌层（基础设施实现，跨剧通用）
import type { InterventionStorage } from "@/lib/abstractions";
import type { UserInterventionRecord } from "@/lib/types";

const KEY_RECORD = (userId: string, recordId: string) =>
  `ruxi:v1:interventions:${userId}:${recordId}`;

const KEY_LATEST = (userId: string, dramaId: string, nodeId: string) =>
  `ruxi:v1:latest:${userId}:${dramaId}:${nodeId}`;

const RECORD_PREFIX = (userId: string) => `ruxi:v1:interventions:${userId}:`;

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function safeParse(raw: string): UserInterventionRecord | null {
  try {
    return JSON.parse(raw) as UserInterventionRecord;
  } catch {
    return null;
  }
}

export class LocalStorageInterventionStorage implements InterventionStorage {
  async save(record: UserInterventionRecord): Promise<void> {
    const storage = getStorage();
    if (!storage) return;
    storage.setItem(KEY_RECORD(record.userId, record.id), JSON.stringify(record));
  }

  async list(userId: string): Promise<UserInterventionRecord[]> {
    const storage = getStorage();
    if (!storage) return [];

    const prefix = RECORD_PREFIX(userId);
    const records: UserInterventionRecord[] = [];

    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (!key || !key.startsWith(prefix)) continue;
      const raw = storage.getItem(key);
      if (!raw) continue;
      const parsed = safeParse(raw);
      if (parsed) {
        records.push(parsed);
      }
    }

    // 按 createdAt 降序（最新在前）
    records.sort((a, b) => b.createdAt - a.createdAt);
    return records;
  }

  async upsertLatestByNode(record: UserInterventionRecord): Promise<void> {
    const storage = getStorage();
    if (!storage) return;
    storage.setItem(
      KEY_LATEST(record.userId, record.dramaId, record.nodeId),
      JSON.stringify(record)
    );
  }

  async clear(userId: string): Promise<void> {
    const storage = getStorage();
    if (!storage) return;

    const recordPrefix = RECORD_PREFIX(userId);
    const latestPrefix = `ruxi:v1:latest:${userId}:`;

    // 先收集 keys 再删除（避免一边遍历一边删除导致索引错位）
    const keysToRemove: string[] = [];
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (!key) continue;
      if (key.startsWith(recordPrefix) || key.startsWith(latestPrefix)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => storage.removeItem(key));
  }
}
