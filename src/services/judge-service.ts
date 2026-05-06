// 此文件属于品牌层（业务编排，UI 唯一对外入口）
import { runJudgment } from "@/engines/judgment";
import type { JudgeRequest, JudgmentResult } from "@/lib/types";

/** 网络/接口异常时返回的兜底评分（与 /api/judge 内部 fallback 文案保持一致风格） */
function buildFallback(durationMs: number, reason: string): JudgmentResult {
  return {
    scores: {
      completeness: 20,
      emotion: 18,
      motivation: 17,
      consistency: 10
    },
    total: 65,
    branch: "medium",
    reasoning: "（信号不稳，本次按预设影响力计算。）",
    knowledgeSourceCheck: {
      usedAiredContent: true,
      usedCharacterDossier: true,
      spoilerDetected: false
    },
    isFallback: true,
    fallbackReason: reason,
    durationMs
  };
}

/**
 * UI 唯一调用入口：提交介入消息，返回评分结果（含 fallback 形态）。
 * - 引擎层错误（HTTP 异常等）会被此处吞掉并兜底为 medium。
 * - durationMs 以 service 入口为基准，覆盖引擎/接口侧的耗时统计。
 */
export async function submitIntervention(
  request: JudgeRequest
): Promise<JudgmentResult> {
  const startedAt = Date.now();

  try {
    const result = await runJudgment(request);
    return {
      ...result,
      durationMs: Date.now() - startedAt
    };
  } catch (error) {
    console.warn("[judge-service] runJudgment failed, using fallback", error);
    return buildFallback(Date.now() - startedAt, "NETWORK_OR_MODEL_ERROR");
  }
}
