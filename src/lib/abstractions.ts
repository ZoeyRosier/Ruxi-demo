import type { UserInterventionRecord, UserSessionProfile } from "@/lib/types";

export interface VideoSource {
  load(videoKey: string): Promise<void>;
  play(): Promise<void>;
  pause(): void;
  seek(seconds: number): void;
  getCurrentTime(): number;
  onTimeUpdate(callback: (seconds: number) => void): () => void;
}

export interface UserSession {
  getUserId(): string;
  isAuthenticated(): boolean;
  getProfile(): Promise<UserSessionProfile | null>;
}

export interface InterventionStorage {
  save(record: UserInterventionRecord): Promise<void>;
  list(userId: string): Promise<UserInterventionRecord[]>;
  upsertLatestByNode(record: UserInterventionRecord): Promise<void>;
  clear?(userId: string): Promise<void>;
}
