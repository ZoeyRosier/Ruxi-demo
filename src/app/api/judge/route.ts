// 此文件属于品牌层（API 路由）
import { NextResponse } from "next/server";

import { callClaude, parseJudgeResponse } from "@/lib/claude";
import { yeWenjieDossier } from "@/themes/santi/knowledge/characters/ye-wenjie";
import { listener1379Dossier } from "@/themes/santi/knowledge/characters/listener-1379";
import type { JudgeRequest, JudgmentResult } from "@/lib/types";

/** 任意错误统一兜底为中分结果，确保前端流程不卡死 */
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

/** 把角色档案转成可读文本片段，供 prompt 引用 */
function dossierToText(label: string, dossier: typeof yeWenjieDossier): string {
  return [
    `【${label}】`,
    `- 姓名：${dossier.name}`,
    `- 价值观：${dossier.coreValues.join("；")}`,
    `- 语言风格：${dossier.speechStyle}`,
    `- 关键事实：`,
    ...dossier.facts.map((f) => `  · ${f}`)
  ].join("\n");
}

function buildPrompt(req: JudgeRequest): string {
  return [
    "你是《三体》剧版剧情判断引擎。本次评估场景为：",
    "- 节点：1971 年红岸基地 YES 按钮节点（user 扮演三体监听员 1379 向叶文洁发送一条警告/劝阻消息）",
    "- 你必须严格基于剧版已发生事实评估，不得引入剧版未呈现的细节。",
    "",
    dossierToText("叶文洁档案", yeWenjieDossier),
    "",
    dossierToText("监听员 1379 档案", listener1379Dossier),
    "",
    "【用户消息】",
    req.userMessage,
    "",
    "【评分维度】",
    "- completeness（信息完整度，0-30）：是否清晰传达核心警示与必要信息。",
    "- emotion（情感强度，0-30）：是否触动叶文洁人性深处。",
    "- motivation（人物动机匹配，0-25）：是否切合叶文洁内核与监听员 1379 的克制视角。",
    "- consistency（剧情逻辑自洽，0-15）：是否符合 1971 年时空、剧版事实与监听员人设。",
    "",
    "【分支规则】",
    "- total > 80 → branch = \"high\"",
    "- 50 ≤ total ≤ 80 → branch = \"medium\"",
    "- total < 50 → branch = \"low\"",
    "",
    "【输出规范（务必严格遵守）】",
    "只返回一个 JSON 对象，不要附加任何解释或 markdown：",
    "{",
    '  "scores": { "completeness": <0-30>, "emotion": <0-30>, "motivation": <0-25>, "consistency": <0-15> },',
    '  "total": <0-100>,',
    '  "branch": "high" | "medium" | "low",',
    '  "reasoning": "<2-3 句中文，结尾标注引用来源（如：基于角色档案 / 剧版第 X 集事件）>",',
    '  "knowledgeSourceCheck": {',
    '    "usedAiredContent": <bool>,        // 是否引用了"剧版已播事件清单"中的内容',
    '    "usedCharacterDossier": <bool>,    // 是否引用了角色档案中的核心特质',
    '    "spoilerDetected": <bool>          // 是否引用了 YES 节点之后/未播出的剧情细节',
    "  }",
    "}",
    "",
    "knowledgeSourceCheck 必须诚实自评：若用户消息引入了剧版未呈现或未来集数的内容，将 spoilerDetected 设为 true，并在 reasoning 中指出。"
  ].join("\n");
}

export async function POST(request: Request): Promise<NextResponse> {
  const startedAt = Date.now();

  let body: Partial<JudgeRequest>;
  try {
    body = (await request.json()) as Partial<JudgeRequest>;
  } catch {
    return NextResponse.json(
      { error: "INVALID_JSON_BODY" },
      { status: 400 }
    );
  }

  const { dramaId, nodeId, userMessage } = body;
  if (
    typeof dramaId !== "string" ||
    typeof nodeId !== "string" ||
    typeof userMessage !== "string"
  ) {
    return NextResponse.json(
      { error: "INVALID_FIELDS" },
      { status: 400 }
    );
  }

  const judgeRequest: JudgeRequest = { dramaId, nodeId, userMessage };

  try {
    const prompt = buildPrompt(judgeRequest);
    const raw = await callClaude(prompt);
    const parsed = parseJudgeResponse(raw);

    const result: JudgmentResult = {
      ...parsed,
      durationMs: Date.now() - startedAt
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.warn("[/api/judge] failed, returning fallback", error);
    const fallback = buildFallback(Date.now() - startedAt, "NETWORK_OR_MODEL_ERROR");
    return NextResponse.json(fallback, { status: 200 });
  }
}

/** 其他方法返回 405 */
function methodNotAllowed(): NextResponse {
  return NextResponse.json(
    { error: "METHOD_NOT_ALLOWED" },
    { status: 405, headers: { Allow: "POST" } }
  );
}

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
