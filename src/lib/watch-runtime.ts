function buildPausedAtKey(dramaId: string, nodeId: string): string {
  return `ruxi:v1:watch:${dramaId}:${nodeId}:pausedAt`;
}

function buildResumeKey(dramaId: string, nodeId: string): string {
  return `ruxi:v1:watch:${dramaId}:${nodeId}:resume`;
}

export function saveWatchResume(dramaId: string, nodeId: string, seconds: number): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(buildResumeKey(dramaId, nodeId), String(seconds));
}

export function loadWatchResume(dramaId: string, nodeId: string): number | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(buildResumeKey(dramaId, nodeId));
  if (raw === null) return null;
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : null;
}

export function savePausedAt(dramaId: string, nodeId: string, seconds: number): void {
  if (typeof window === "undefined") {
    return;
  }

  const key = buildPausedAtKey(dramaId, nodeId);
  window.sessionStorage.setItem(key, String(seconds));
}

export function loadPausedAt(dramaId: string, nodeId: string): number | null {
  if (typeof window === "undefined") {
    return null;
  }

  const key = buildPausedAtKey(dramaId, nodeId);
  const raw = window.sessionStorage.getItem(key);

  if (raw === null) {
    return null;
  }

  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}
