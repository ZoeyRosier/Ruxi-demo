// 此文件属于品牌层（通用 memory 引擎，跨剧复用）
import type {
  BranchType,
  JudgmentResult,
  UserInterventionRecord
} from "@/lib/types";

/** 三体·YES 节点三档结局文案，按 branch 取用 */
export const SANTI_YES_ENDING_TEXT: Record<BranchType, string> = {
  high: "叶文洁停顿了。她的手悬在按钮上方，久久未落下。",
  medium: "叶文洁读完了这条消息，神情复杂，但她的手依然缓缓按下了按钮。",
  low: "消息像石子落入深渊，不见回响。叶文洁按下了YES。"
};

export interface BuildInterventionRecordParams {
  userId: string;
  dramaId: string;
  nodeId: string;
  identityId: string;
  userMessage: string;
  judgment: JudgmentResult;
  endingText: string;
}

/** 跨运行时安全的 ID 生成：优先 crypto.randomUUID，降级到时间戳。 */
function generateId(): string {
  const g = globalThis as unknown as {
    crypto?: { randomUUID?: () => string };
  };
  if (g.crypto?.randomUUID) {
    return g.crypto.randomUUID();
  }
  return Date.now().toString();
}

/**
 * 构造一条介入记录（纯逻辑，不写存储；写入由 InterventionStorage 实现层负责）。
 * - id 自动生成
 * - createdAt 自动填 Date.now()
 */
export function buildInterventionRecord(
  params: BuildInterventionRecordParams
): UserInterventionRecord {
  return {
    id: generateId(),
    userId: params.userId,
    dramaId: params.dramaId,
    nodeId: params.nodeId,
    identityId: params.identityId,
    userMessage: params.userMessage,
    judgment: params.judgment,
    endingText: params.endingText,
    createdAt: Date.now()
  };
}
