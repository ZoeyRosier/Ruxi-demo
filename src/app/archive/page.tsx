// 此文件属于品牌层
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { LocalStorageInterventionStorage } from "@/lib/implementations/local-storage-intervention";
import { useTheme } from "@/contexts/ThemeProvider";
import type { UserInterventionRecord } from "@/lib/types";
import { BrandHeader } from "@/components/shared/BrandHeader";
import { StepNav } from "@/components/shared/StepNav";
import { RouteTransition } from "@/components/transitions/RouteTransition";

const SESSION_USER_KEY = "ruxi:v1:session:userId";
const FALLBACK_USER_ID = "anonymous-user";

function readUserId(): string {
  if (typeof window === "undefined") return FALLBACK_USER_ID;
  return window.sessionStorage.getItem(SESSION_USER_KEY) ?? FALLBACK_USER_ID;
}

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

function formatDateDot(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}.${pad2(d.getMonth() + 1)}.${pad2(d.getDate())}`;
}

function dramaAccent(dramaId: string): string {
  return dramaId === "santi" ? "#39FF14" : "#8B7FB8";
}

/** 与 03_claude-prototypes/page-archive.jsx 中 MiniRadar 一致（无坐标裁剪） */
function MiniRadar({ color, score }: { color: string; score: number }) {
  const dims = [score, score - 10, score + 5, score - 3];
  const c = 36;
  const r = 28;
  const pts = dims
    .map((d, i) => {
      const a = -Math.PI / 2 + (i * Math.PI) / 2;
      const ratio = d / 100;
      return [c + Math.cos(a) * r * ratio, c + Math.sin(a) * r * ratio].join(",");
    })
    .join(" ");

  return (
    <svg width="72" height="72" aria-hidden>
      <polygon
        points={`${c},${c - r} ${c + r},${c} ${c},${c + r} ${c - r},${c}`}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
      />
      <polygon
        points={pts}
        fill={`${color}33`}
        stroke={color}
        strokeWidth="1.5"
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
    </svg>
  );
}

export default function ArchivePage() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [records, setRecords] = useState<UserInterventionRecord[] | null>(null);

  useEffect(() => {
    setTheme("brand");
  }, []);

  useEffect(() => {
    const userId = readUserId();
    const storage = new LocalStorageInterventionStorage();
    let cancelled = false;
    void storage
      .list(userId)
      .then((list) => {
        if (!cancelled) setRecords(list);
      })
      .catch((err) => {
        console.warn("[archive] list failed", err);
        if (!cancelled) setRecords([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    if (!records?.length) {
      return {
        total: 0,
        maxScore: 0,
        branchVariety: 0
      };
    }
    const totals = records.map((r) => r.judgment.total);
    const maxScore = Math.max(...totals, 0);
    const branchVariety = new Set(records.map((r) => r.judgment.branch)).size;
    return {
      total: records.length,
      maxScore,
      branchVariety
    };
  }, [records]);

  const list = records ?? [];

  return (
    <RouteTransition variant="brand" duration={400}>
      <BrandHeader />
      <div
        className="page-fade-in tex-grain"
        style={{
          minHeight: "100vh",
          overflow: "auto",
          position: "relative",
          background: "var(--color-bg-primary)",
          color: "var(--brand-text)",
          paddingBottom: 120
        }}
      >
        <section
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "140px 60px 40px",
            position: "relative",
            zIndex: 2
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.4em",
              color: "var(--brand-accent)",
              marginBottom: 18
            }}
          >
            ◇ MY MARKS · 印记档案室
          </div>
          <h1
            style={{
              fontFamily: "var(--font-zh-serif)",
              fontSize: 56,
              fontWeight: 900,
              letterSpacing: "0.08em",
              color: "var(--brand-text)",
              margin: "0 0 20px 0"
            }}
          >
            我 的 印 记
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "var(--brand-text-soft)",
              maxWidth: 620,
              lineHeight: 1.7,
              margin: 0
            }}
          >
            每一次你按下的发送键，都在这里留下一道光。跨越剧目，跨越时间。
          </p>

          {records !== null && (
            <div
              style={{
                marginTop: 40,
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 0,
                borderTop: "1px solid var(--brand-border)",
                borderBottom: "1px solid var(--brand-border)"
              }}
            >
              {(
                [
                  ["总介入次数", String(stats.total), ""],
                  ["最高影响力", String(stats.maxScore), "/ 100"],
                  ["解锁分支", String(stats.branchVariety), "/ 8"],
                  ["加权排名", "#284", "/ 12,940"]
                ] as const
              ).map(([k, v, u], i) => (
                <div
                  key={k}
                  style={{
                    padding: "24px 20px",
                    borderRight:
                      i < 3 ? "1px solid var(--brand-border)" : "none"
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      letterSpacing: "0.25em",
                      color: "var(--brand-text-mute)",
                      marginBottom: 10
                    }}
                  >
                    {k.toUpperCase()}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 6,
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      color: "var(--brand-text)"
                    }}
                  >
                    <span style={{ fontSize: 36 }}>{v}</span>
                    <span
                      style={{
                        fontSize: 13,
                        color: "var(--brand-text-mute)"
                      }}
                    >
                      {u}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "10px 60px 100px",
            position: "relative",
            zIndex: 2
          }}
        >
          {records === null && (
            <div
              style={{
                padding: "36px",
                border: "1px dashed var(--brand-border-hi)",
                textAlign: "center",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: "0.2em",
                color: "var(--brand-text-mute)"
              }}
            >
              正在加载档案...
            </div>
          )}

          {records !== null && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 24,
                  paddingBottom: 16,
                  borderBottom: "1px solid var(--brand-border)"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 18,
                    fontSize: 12,
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.2em"
                  }}
                >
                  <button
                    type="button"
                    style={{
                      padding: "6px 12px",
                      background: "none",
                      border: "none",
                      borderBottom: "1px solid var(--brand-text)",
                      color: "var(--brand-text)",
                      cursor: "default",
                      fontFamily: "inherit",
                      fontSize: 12,
                      letterSpacing: "0.2em"
                    }}
                  >
                    全部
                  </button>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--brand-text-mute)",
                    letterSpacing: "0.18em"
                  }}
                >
                  {list.length} ENTRIES · SORT BY DATE
                </span>
              </div>

              {list.length === 0 && (
                <div
                  style={{
                    padding: "36px",
                    border: "1px dashed var(--brand-border-hi)",
                    textAlign: "center"
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      letterSpacing: "0.3em",
                      color: "var(--brand-text-mute)",
                      marginBottom: 8
                    }}
                  >
                    ◇ NO MARKS YET
                  </div>
                  <div style={{ fontSize: 14, color: "var(--brand-text-soft)" }}>
                    暂无介入记录
                  </div>
                </div>
              )}

              {list.length > 0 && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 18 }}
                >
                  {list.map((rec, idx) => {
                    const accent = dramaAccent(rec.dramaId);
                    const markNum = String(idx + 1).padStart(3, "0");
                    return (
                      <div
                        key={rec.id}
                        className="brand-card"
                        style={{
                          padding: "24px 28px",
                          display: "grid",
                          gridTemplateColumns: "80px 1fr 240px 140px",
                          gap: 24,
                          alignItems: "center"
                        }}
                      >
                        <div
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 28,
                            fontWeight: 700,
                            color: "var(--brand-text)"
                          }}
                        >
                          #{markNum}
                        </div>

                        <div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              marginBottom: 8,
                              flexWrap: "wrap"
                            }}
                          >
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: accent,
                                boxShadow: `0 0 8px ${accent}`
                              }}
                            />
                            <span
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: 11,
                                color: accent,
                                letterSpacing: "0.2em"
                              }}
                            >
                              {rec.dramaId}
                            </span>
                            <span style={{ color: "var(--brand-border-hi)" }}>
                              │
                            </span>
                            <span
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: 11,
                                color: "var(--brand-text-mute)",
                                letterSpacing: "0.15em"
                              }}
                            >
                              {formatDateDot(rec.createdAt)}
                            </span>
                            <span style={{ color: "var(--brand-border-hi)" }}>
                              │
                            </span>
                            <span
                              style={{
                                fontSize: 12,
                                color: "var(--brand-text-soft)"
                              }}
                            >
                              {rec.nodeId}
                            </span>
                          </div>
                          <div
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: 14,
                              fontStyle: "italic",
                              color: "var(--brand-text)",
                              lineHeight: 1.7,
                              paddingLeft: 14,
                              borderLeft: "2px solid #39FF1455",
                              wordBreak: "break-word"
                            }}
                          >
                            &quot;{rec.userMessage}&quot;
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 14
                          }}
                        >
                          <MiniRadar
                            color={accent}
                            score={rec.judgment.total}
                          />
                          <div>
                            <div
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: 10,
                                color: "var(--brand-text-mute)",
                                letterSpacing: "0.2em",
                                marginBottom: 3
                              }}
                            >
                              SCORE
                            </div>
                            <div
                              style={{
                                fontFamily: "var(--font-display)",
                                fontSize: 26,
                                fontWeight: 700,
                                color: accent,
                                textShadow: `0 0 8px ${accent}55`
                              }}
                            >
                              {rec.judgment.total}
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 10,
                            alignItems: "flex-end"
                          }}
                        >
                          <span
                            style={{
                              padding: "4px 10px",
                              border: `1px solid ${accent}55`,
                              color: accent,
                              fontFamily: "var(--font-mono)",
                              fontSize: 10,
                              letterSpacing: "0.2em"
                            }}
                          >
                            ✓ {rec.judgment.branch.toUpperCase()}
                          </span>
                          <button
                            type="button"
                            className="btn-ghost"
                            onClick={() => router.push("/drama/santi")}
                            style={{
                              padding: "8px 14px",
                              fontSize: 11,
                              fontFamily: "var(--font-mono)",
                              letterSpacing: "0.15em"
                            }}
                          >
                            再次介入 →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div
                style={{
                  marginTop: 40,
                  padding: "36px",
                  border: "1px dashed var(--brand-border-hi)",
                  textAlign: "center"
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: "0.3em",
                    color: "var(--brand-text-mute)",
                    marginBottom: 8
                  }}
                >
                  ◇ MORE NODES AWAIT
                </div>
                <div style={{ fontSize: 14, color: "var(--brand-text-soft)" }}>
                  还有更多介入节点等你介入。
                </div>
              </div>
            </>
          )}
        </section>
      </div>
      <StepNav currentStep={8} />
    </RouteTransition>
  );
}
