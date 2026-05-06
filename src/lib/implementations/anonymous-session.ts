// 此文件属于品牌层
import type { UserSession } from "@/lib/abstractions";
import type { UserSessionProfile } from "@/lib/types";

const SESSION_USER_KEY = "ruxi:v1:session:userId";
const FALLBACK_USER_ID = "anonymous-user";

function generateUuid(): string {
  const g = globalThis as unknown as {
    crypto?: { randomUUID?: () => string };
  };
  if (g.crypto?.randomUUID) {
    return g.crypto.randomUUID();
  }
  return Date.now().toString();
}

export class AnonymousUserSession implements UserSession {
  getUserId(): string {
    if (typeof window === "undefined") {
      return FALLBACK_USER_ID;
    }
    const existing = window.sessionStorage.getItem(SESSION_USER_KEY);
    if (existing) return existing;

    const generated = generateUuid();
    window.sessionStorage.setItem(SESSION_USER_KEY, generated);
    return generated;
  }

  isAuthenticated(): boolean {
    return false;
  }

  async getProfile(): Promise<UserSessionProfile | null> {
    return {
      userId: this.getUserId(),
      isAuthenticated: false
    };
  }
}
