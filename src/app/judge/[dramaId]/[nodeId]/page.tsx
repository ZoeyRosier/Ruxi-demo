// 此文件属于主题层
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { loadComposeDraft } from "@/services/compose-service";
import { submitIntervention } from "@/services/judge-service";
import { DebugDrawer } from "@/components/shared/DebugDrawer";
import { useTheme } from "@/contexts/ThemeProvider";
import type { JudgmentResult } from "@/lib/types";
import { ThemeHeader } from "@/components/shared/ThemeHeader";
import { StepNav } from "@/components/shared/StepNav";

interface JudgePageProps {
  params: {
    dramaId: string;
    nodeId: string;
  };
}

const BRANCH_KEY = (dramaId: string, nodeId: string) =>
  `ruxi:v1:judge:${dramaId}:${nodeId}:branch`;

const RESULT_KEY = (dramaId: string, nodeId: string) =>
  `ruxi:v1:judge:${dramaId}:${nodeId}:result`;

function RadarChart({
  dims,
  active
}: {
  dims: Array<{ key: string; val: number }>;
  active: boolean;
}) {
  const size = 380;
  const c = size / 2;
  const r = 116;
  const n = dims.length;
  const points = dims.map((d, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI / n);
    const ratio = active ? d.val / 100 : 0;
    return [c + Math.cos(angle) * r * ratio, c + Math.sin(angle) * r * ratio];
  });
  const labels = dims.map((_, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI / n);
    return [c + Math.cos(angle) * (r + 26), c + Math.sin(angle) * (r + 26)];
  });
  const grid = [0.25, 0.5, 0.75, 1].map((g) => {
    const pts = dims
      .map((_, i) => {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI / n);
        return [c + Math.cos(angle) * r * g, c + Math.sin(angle) * r * g].join(",");
      })
      .join(" ");
    return pts;
  });

  return (
    <svg width={size} height={size} style={{ transition: "all 1.2s" }}>
      {grid.map((g, i) => (
        <polygon
          key={i}
          points={g}
          fill="none"
          stroke="rgba(255,255,255,.08)"
          strokeWidth="1"
        />
      ))}
      {dims.map((_, i) => {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI / n);
        return (
          <line
            key={i}
            x1={c}
            y1={c}
            x2={c + Math.cos(angle) * r}
            y2={c + Math.sin(angle) * r}
            stroke="rgba(255,255,255,.1)"
            strokeWidth="1"
          />
        );
      })}
      <polygon
        points={points.map((p) => p.join(",")).join(" ")}
        fill="rgba(57,255,20,0.2)"
        stroke="#39FF14"
        strokeWidth="2"
        style={{
          filter: "drop-shadow(0 0 12px #39FF14)",
          transition: "all 1.4s cubic-bezier(.2,.7,.2,1)"
        }}
      />
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p[0]}
          cy={p[1]}
          r="4"
          fill="#39FF14"
          style={{ filter: "drop-shadow(0 0 6px #39FF14)" }}
        />
      ))}
      {labels.map((p, i) => (
        <g key={i}>
          <text
            x={p[0]}
            y={p[1]}
            fontFamily="var(--font-mono)"
            fontSize="11"
            letterSpacing="0.15em"
            fill="rgba(255,255,255,.85)"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {dims[i].key}
          </text>
          <text
            x={p[0]}
            y={Number(p[1]) + 16}
            fontFamily="var(--font-orbitron)"
            fontSize="13"
            fontWeight="700"
            fill="#39FF14"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ filter: "drop-shadow(0 0 4px #39FF14)" }}
          >
            {active ? dims[i].val : 0}
          </text>
        </g>
      ))}
    </svg>
  );
}

const BRANCH_NARRATIVE: Record<"high" | "medium" | "low", string> = {
  high:
    "信号穿透屏障的瞬间，叶文洁的手指骤然停住。\n她盯着那行字，很久没有动。某个埋藏已久的声音在胸腔里重新震动——那是她父亲被批斗时最后望向她的眼神。\n她慢慢将手从发送键上收回。今夜，红岸基地的天线沉默了。",
  medium:
    "叶文洁读完，沉默了几秒钟。\n有什么东西在她眼底一闪而过，像一颗落入深水的石子，激起涟漪，又迅速归于平静。\n她深吸一口气，手指落下——键入的声音在机房里显得格外清脆。信号已经发出。",
  low:
    "那行字只停留在她视线里不到两秒。\n叶文洁没有犹豫。对她而言，人类的劝阻与宇宙的沉默相比，轻如尘埃。\n发送键被按下的声音几乎听不见，但那个信号，已经永远离开了地球。"
};

export default function JudgePage({ params }: JudgePageProps) {
  const { dramaId, nodeId } = params;
  const router = useRouter();
  const { setTheme } = useTheme();
  const [userMessage, setUserMessage] = useState<string | null>(null);
  const [result, setResult] = useState<JudgmentResult | null>(null);
  const [phase, setPhase] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const hasStartedRef = useRef(false);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    setTheme("santi");
  }, []);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const message = loadComposeDraft(dramaId, nodeId) ?? "";
    setUserMessage(message || null);

    let cancelled = false;

    void (async () => {
      const judgment = await submitIntervention({
        dramaId,
        nodeId,
        userMessage: message
      });

      if (cancelled) return;

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(BRANCH_KEY(dramaId, nodeId), judgment.branch);
        window.sessionStorage.setItem(
          RESULT_KEY(dramaId, nodeId),
          JSON.stringify(judgment)
        );
      }

      setResult(judgment);
    })();

    return () => {
      cancelled = true;
      hasStartedRef.current = false;
    };
  }, [dramaId, nodeId]);

  useEffect(() => {
    if (!result || hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    const t1 = window.setTimeout(() => setPhase(1), 800);
    const t2 = window.setTimeout(() => setPhase(2), 2200);
    const t3 = window.setTimeout(() => setPhase(3), 4500);

    const scoreTimer = window.setInterval(() => {
      setDisplayScore((prev) => {
        const next = prev + 2;
        if (next >= result.total) {
          window.clearInterval(scoreTimer);
          return result.total;
        }
        return next;
      });
    }, 20);

    const branch = result.branch as "high" | "medium" | "low";
    const reasoning = BRANCH_NARRATIVE[branch] ?? BRANCH_NARRATIVE.medium;
    let idx = 0;
    const typingTimer = window.setInterval(() => {
      idx += 1;
      setDisplayText(reasoning.slice(0, idx));
      if (idx >= reasoning.length) {
        window.clearInterval(typingTimer);
      }
    }, 30);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearInterval(scoreTimer);
      window.clearInterval(typingTimer);
    };
  }, [result]);

  const dims = [
    { key: "情感共鸣", val: result?.scores.emotion ?? 0 },
    { key: "历史克制", val: result?.scores.completeness ?? 0 },
    { key: "叙事韵脚", val: result?.scores.motivation ?? 0 },
    { key: "介入克制", val: result?.scores.consistency ?? 0 }
  ];

  const scoringDone = result !== null;

  return (
    <>
      <ThemeHeader label="AI 评分 · 影响力解析" />
      <main
        style={{
          position: "relative",
          width: "100vw",
          minHeight: "calc(100vh - 40px)",
          background: "var(--theme-bg)",
          overflow: "auto",
          color: "#fff",
          paddingBottom: "60px"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "repeating-linear-gradient(0deg, transparent 0, transparent 3px, rgba(57,255,20,.03) 3px, rgba(57,255,20,.03) 4px)"
          }}
        />

        <div
          style={{
            maxWidth: 1300,
            margin: "0 auto",
            padding: "120px 60px 100px",
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: 60,
            position: "relative"
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.3em",
                color: "#FFB347",
                marginBottom: 24
              }}
            >
              ◆ INFLUENCE / 4D ANALYSIS
            </div>

            <RadarChart dims={dims} active={result !== null} />

            <div
              style={{
                marginTop: 40,
                display: "flex",
                alignItems: "baseline",
                gap: 24
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "rgba(255,255,255,.5)",
                    letterSpacing: "0.2em",
                    marginBottom: 6
                  }}
                >
                  TOTAL · 影响力
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-orbitron)",
                    fontSize: 96,
                    fontWeight: 900,
                    color: "#39FF14",
                    textShadow: "0 0 28px #39FF14aa",
                    lineHeight: 1,
                    letterSpacing: "0.05em"
                  }}
                >
                  {displayScore}
                </div>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "#FFB347",
                  letterSpacing: "0.15em",
                  padding: "6px 14px",
                  border: "1px solid #FFB347",
                  opacity: phase >= 2 ? 1 : 0,
                  transition: "opacity .5s"
                }}
              >
                RANK · S
              </div>
            </div>
          </div>

          <div>
            <div
              style={{
                padding: 22,
                border: "1px solid #39FF1455",
                background: "rgba(0,0,0,.4)",
                marginBottom: 28
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  color: "#39FF14",
                  marginBottom: 12
                }}
              >
                YOUR MESSAGE
              </div>
              <div
                style={{
                  fontSize: 15,
                  lineHeight: 1.8,
                  color: "rgba(255,255,255,.92)",
                  fontFamily: "var(--font-mono)",
                  whiteSpace: "pre-wrap"
                }}
              >
                {userMessage || "——"}
              </div>
            </div>

            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.3em",
                color: "#FFB347",
                marginBottom: 14
              }}
            >
              ◇ 叶文洁 · 此刻反应
            </div>
            <div
              style={{
                padding: 22,
                border: "1px dashed #FFB34766",
                background: "#FFB34708",
                fontSize: 14,
                lineHeight: 1.9,
                color: "rgba(255,255,255,.85)",
                minHeight: 140,
                fontFamily: "var(--font-mono)",
                marginBottom: 30
              }}
            >
              {displayText}
              <span className="cursor-blink" />
            </div>

            {result?.isFallback && (
              <p
                style={{
                  margin: "0 0 24px 0",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  color: "rgba(255,255,255,.65)"
                }}
              >
                信号不稳。这次先按预设影响力计算。
              </p>
            )}

            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "#39FF14",
                letterSpacing: "0.2em",
                marginBottom: 18,
                opacity: phase >= 3 ? 1 : 0,
                transition: "opacity .5s"
              }}
            >
              ● 叶文洁 正在阅读 ...
            </div>

            <button
              type="button"
              onClick={() => router.push(`/branch/${dramaId}/${nodeId}`)}
              disabled={!scoringDone}
              style={{
                padding: "16px 32px",
                fontSize: 13,
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.15em",
                background: "#39FF14",
                color: "#000",
                border: "none",
                fontWeight: 700,
                opacity: phase >= 3 && scoringDone ? 1 : 0.4,
                cursor: scoringDone ? "pointer" : "not-allowed",
                boxShadow: "0 0 0 1px #39FF14, 0 0 20px rgba(57,255,20,0.4)"
              }}
            >
              查看结局
            </button>
          </div>
        </div>

        <DebugDrawer
          knowledgeSourceCheck={result?.knowledgeSourceCheck}
          isFallback={result?.isFallback}
          extra={
            result
              ? {
                  total: result.total,
                  branch: result.branch,
                  durationMs: result.durationMs,
                  fallbackReason: result.fallbackReason
                }
              : { status: "loading" }
          }
        />
      </main>
      <StepNav currentStep={6} />
    </>
  );
}
