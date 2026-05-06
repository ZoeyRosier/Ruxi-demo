// 此文件属于品牌/主题混合层（业务编排层，跨剧通用）
const MAX_CHARS = 300;

function buildMessageKey(dramaId: string, nodeId: string): string {
  return `ruxi:v1:compose:${dramaId}:${nodeId}:message`;
}

export interface ValidateMessageResult {
  valid: boolean;
  reason?: string;
}

export function validateMessage(text: string): ValidateMessageResult {
  if (text.length > MAX_CHARS) {
    return { valid: false, reason: "超过最大字数限制" };
  }
  return { valid: true };
}

export function saveComposeDraft(
  dramaId: string,
  nodeId: string,
  text: string
): void {
  if (typeof window === "undefined") {
    return;
  }
  window.sessionStorage.setItem(buildMessageKey(dramaId, nodeId), text);
}

export function loadComposeDraft(
  dramaId: string,
  nodeId: string
): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.sessionStorage.getItem(buildMessageKey(dramaId, nodeId));
}
