// 此文件属于品牌层（基础设施：Claude API 调用封装）
import type { JudgmentResult } from "@/lib/types";

const MAX_TOKENS = 1024;
const TIMEOUT_MS = 8_000;
const RETRY_DELAY_MS = 1_000;

// API_PROVIDER=deepseek 时走 OpenAI-compatible 格式；默认走 Anthropic 格式
const PROVIDER = (process.env.API_PROVIDER ?? "anthropic") as "anthropic" | "deepseek";
const MODEL = PROVIDER === "deepseek" ? "deepseek-chat" : "claude-sonnet-4-5";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callClaudeOnce(prompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");

  const base = (process.env.ANTHROPIC_BASE_URL ?? "https://api.anthropic.com/v1").replace(/\/$/, "");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    let response: Response;

    if (PROVIDER === "deepseek") {
      // OpenAI-compatible 格式（DeepSeek / 大部分国内中转站）
      response = await fetch(`${base}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          messages: [{ role: "user", content: prompt }]
        }),
        signal: controller.signal
      });
    } else {
      // Anthropic 原生格式
      response = await fetch(`${base}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          messages: [{ role: "user", content: prompt }]
        }),
        signal: controller.signal
      });
    }

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "(unreadable)");
      throw new Error(`API ${response.status}: ${errorBody}`);
    }

    if (PROVIDER === "deepseek") {
      const data = (await response.json()) as {
        choices: Array<{ message: { content: string } }>;
      };
      const text = data.choices?.[0]?.message?.content?.trim() ?? "";
      if (!text) throw new Error("empty response");
      return text;
    } else {
      const data = (await response.json()) as {
        content: Array<{ type: string; text?: string }>;
      };
      const text = data.content
        .map((b) => (b.type === "text" ? (b.text ?? "") : ""))
        .join("")
        .trim();
      if (!text) throw new Error("empty response");
      return text;
    }
  } finally {
    clearTimeout(timer);
  }
}

/**
 * 调用 Claude；失败自动重试 1 次，重试前 console.warn。
 * 两次都失败则抛出最后一次的错误。
 */
export async function callClaude(prompt: string): Promise<string> {
  try {
    return await callClaudeOnce(prompt);
  } catch (firstError) {
    console.warn("[claude] first attempt failed, retrying in 1s...", firstError);
    await delay(RETRY_DELAY_MS);
    try {
      return await callClaudeOnce(prompt);
    } catch (secondError) {
      console.warn("[claude] retry also failed", secondError);
      throw secondError;
    }
  }
}

/**
 * 从原始字符串中提取 JSON：优先匹配 ```json ... ``` 代码块，其次匹配第一对 {...}。
 */
function extractJsonString(raw: string): string {
  const codeBlockMatch = raw.match(/```json\s*\n([\s\S]*?)\n```/i);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }
  throw new Error("invalid judge response");
}

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

/**
 * 解析 judge 响应；不通过校验抛 Error("invalid judge response")。
 * isFallback 固定为 false，durationMs 由调用方填充（此处占位 0）。
 */
export function parseJudgeResponse(raw: string): JudgmentResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(extractJsonString(raw));
  } catch {
    throw new Error("invalid judge response");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("invalid judge response");
  }

  const obj = parsed as Record<string, unknown>;
  const scoresRaw = obj.scores as Record<string, unknown> | undefined;

  if (
    !scoresRaw ||
    !isFiniteNumber(scoresRaw.completeness) ||
    !isFiniteNumber(scoresRaw.emotion) ||
    !isFiniteNumber(scoresRaw.motivation) ||
    !isFiniteNumber(scoresRaw.consistency)
  ) {
    throw new Error("invalid judge response");
  }

  if (!isFiniteNumber(obj.total)) {
    throw new Error("invalid judge response");
  }

  const branch = obj.branch;
  if (branch !== "high" && branch !== "medium" && branch !== "low") {
    throw new Error("invalid judge response");
  }

  const ksc = obj.knowledgeSourceCheck;
  const knowledgeSourceCheck =
    ksc && typeof ksc === "object"
      ? {
          usedAiredContent: Boolean(
            (ksc as Record<string, unknown>).usedAiredContent
          ),
          usedCharacterDossier: Boolean(
            (ksc as Record<string, unknown>).usedCharacterDossier
          ),
          spoilerDetected: Boolean(
            (ksc as Record<string, unknown>).spoilerDetected
          )
        }
      : undefined;

  return {
    scores: {
      completeness: scoresRaw.completeness,
      emotion: scoresRaw.emotion,
      motivation: scoresRaw.motivation,
      consistency: scoresRaw.consistency
    },
    total: obj.total,
    branch,
    reasoning: typeof obj.reasoning === "string" ? obj.reasoning : "",
    knowledgeSourceCheck,
    isFallback: false,
    durationMs: 0
  };
}
