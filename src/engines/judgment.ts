// 此文件属于品牌层（通用 AI 引擎，跨剧复用）
import type { JudgeRequest, JudgmentResult } from "@/lib/types";

/**
 * 调用 /api/judge 获取评分；不处理 fallback，错误直接抛给 service 层。
 * 设计上不依赖 React、不直接引用 Anthropic SDK，保持纯逻辑层。
 */
export async function runJudgment(
  request: JudgeRequest
): Promise<JudgmentResult> {
  const response = await fetch("/api/judge", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    throw new Error(`runJudgment HTTP ${response.status}`);
  }

  // /api/judge 已保证返回 JudgmentResult 结构（含 fallback 形态），此处直接 cast
  const data = (await response.json()) as JudgmentResult;
  return data;
}
