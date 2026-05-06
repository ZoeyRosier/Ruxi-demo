// 此文件属于品牌层
"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

import { SANTI_IDENTITIES } from "@/themes/santi/identities";
import { santiNodes } from "@/themes/santi/nodes";
import { LocalStorageInterventionStorage } from "@/lib/implementations/local-storage-intervention";
import { useTheme } from "@/contexts/ThemeProvider";
import type { UserInterventionRecord } from "@/lib/types";
import { BrandHeader } from "@/components/shared/BrandHeader";
import { StepNav } from "@/components/shared/StepNav";

interface DramaPageProps {
  params: { dramaId: string };
}

const PRIMARY = "#39FF14";

const DEFAULT_NODE_ID = "yes-button-1971";

const DEMO_NODES = [
  {
    id: "n1",
    time: "EP.24 · 25:10",
    title: "第一声啼鸣",
    desc: "1971 · 红岸基地深夜，她将地球的信号射向了宇宙。",
    available: false
  },
  {
    id: "n2",
    time: "EP.24 · 42:10",
    title: "红岸接收外星警告",
    desc: '"不要回答！"——监听员的第一封信。',
    available: false
  },
  {
    id: "n3",
    time: "EP.25 · 12:18",
    title: "叶文洁按下回答键",
    desc: "那是人类历史上最孤独的选择——你只有一次机会，在她按下那个键之前发出警告。",
    available: true
  }
] as const;

const BANNER_GRADIENT =
  "radial-gradient(ellipse at 20% 50%, rgba(57,255,20,0.2) 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(157,78,221,0.2) 0%, transparent 50%), #0D1117";

const SYNOPSIS = `1971年，文化大革命的尾声。物理学家叶文洁被流放至黑龙江大兴安岭，意外加入秘密的「红岸工程」——一个对外星文明发射信号的军事基地。一个清晨，她按下了那枚或许改变人类命运的发送键。半个世纪后，你成为了那位监听员1379号——你能否阻止她？`;

const NODE_DESC = "1971 · 齐家屯，她按下了发送键。";

const SLOGAN = "让你不再是观众，而是故事里的人";

const SESSION_USER_KEY = "ruxi:v1:session:userId";
const FALLBACK_USER_ID = "anonymous-user";

function readUserId(): string {
  if (typeof window === "undefined") return FALLBACK_USER_ID;
  return window.sessionStorage.getItem(SESSION_USER_KEY) ?? FALLBACK_USER_ID;
}

export default function DramaPage({ params }: DramaPageProps) {
  const { dramaId } = params;
  const router = useRouter();
  const { setTheme } = useTheme();
  const [sloganDisplay, setSloganDisplay] = useState("");
  const sloganIntervalRef = useRef<number | null>(null);
  const [records, setRecords] = useState<UserInterventionRecord[] | null>(null);

  useEffect(() => {
    setTheme("brand");
  }, []);

  useEffect(() => {
    let cancelled = false;
    const startT = window.setTimeout(() => {
      let i = 0;
      sloganIntervalRef.current = window.setInterval(() => {
        if (cancelled) return;
        i += 1;
        setSloganDisplay(SLOGAN.slice(0, i));
        if (i >= SLOGAN.length && sloganIntervalRef.current !== null) {
          window.clearInterval(sloganIntervalRef.current);
          sloganIntervalRef.current = null;
        }
      }, 60);
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(startT);
      if (sloganIntervalRef.current !== null) {
        window.clearInterval(sloganIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const userId = readUserId();
    const storage = new LocalStorageInterventionStorage();
    let cancelled = false;

    void storage
      .list(userId)
      .then((list) => {
        if (!cancelled) setRecords(list.filter((r) => r.dramaId === dramaId));
      })
      .catch(() => {
        if (!cancelled) setRecords([]);
      });

    return () => {
      cancelled = true;
    };
  }, [dramaId]);

  const [selectedIdentityId, setSelectedIdentityId] = useState("listener-1379");
  const identity = useMemo(
    () => SANTI_IDENTITIES.find((x) => x.id === selectedIdentityId) ?? SANTI_IDENTITIES[0],
    [selectedIdentityId]
  );
  const watchPathNormal = `/watch/${dramaId}/${DEFAULT_NODE_ID}?mode=normal`;
  const watchPathNode = `/watch/${dramaId}/${DEFAULT_NODE_ID}?mode=node`;
  const stats = useMemo(() => {
    const list = records ?? [];
    const interventions = list.length;
    const avgImpact = interventions
      ? Math.round(list.reduce((sum, r) => sum + r.judgment.total, 0) / interventions)
      : 0;
    const branches = new Set(list.map((r) => r.judgment.branch)).size;
    return {
      interventions: String(interventions),
      avgImpact: String(avgImpact),
      branches: String(branches),
      rank: "#284"
    };
  }, [records]);

  return (
    <>
      <BrandHeader />
      <div
        className="page-fade-in tex-grain"
        style={{
          minHeight: "100vh",
          overflow: "auto",
          position: "relative",
          background: "var(--color-bg-primary)",
          color: "var(--brand-text)"
        }}
      >
        <section
          style={{
            position: "relative",
            height: 360,
            marginTop: 56,
            overflow: "hidden",
            borderBottom: "1px solid rgba(57,255,20,0.2)"
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: BANNER_GRADIENT
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(57,255,20,.05) 2px, rgba(57,255,20,.05) 3px)",
              pointerEvents: "none"
            }}
          />

          <div
            style={{
              position: "absolute",
              left: 60,
              bottom: 48,
              zIndex: 2,
              maxWidth: "min(720px, 55vw)"
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.3em",
                color: PRIMARY,
                marginBottom: 14
              }}
            >
              ◇ 进入剧场 / DRAMA DETAIL
            </div>
            <h1
              style={{
                fontFamily: "var(--font-zh-serif)",
                fontSize: 64,
                fontWeight: 900,
                letterSpacing: "0.08em",
                lineHeight: 1.05,
                margin: "0 0 20px 0",
                background: "linear-gradient(135deg, #F5F5F5, #8B7FB8)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent"
              }}
            >
              《三体》
            </h1>
            <p
              style={{
                fontSize: 22,
                fontWeight: 300,
                color: "rgba(255,255,255,0.92)",
                letterSpacing: "0.05em",
                lineHeight: 1.6,
                minHeight: 34,
                margin: 0
              }}
            >
              {sloganDisplay}
              <span
                style={{
                  display: "inline-block",
                  width: 2,
                  height: 22,
                  background: "#39FF14",
                  marginLeft: 4,
                  verticalAlign: "middle",
                  animation: "blink 1s steps(1) infinite"
                }}
              />
            </p>
          </div>

          <div
            style={{
              position: "absolute",
              right: 60,
              bottom: 48,
              textAlign: "right",
              zIndex: 2,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "rgba(255,255,255,0.45)",
              lineHeight: 1.7,
              letterSpacing: "0.2em"
            }}
          >
            <div>
              EP. 03 / 24
            </div>
            <div style={{ marginTop: 8, color: PRIMARY, textShadow: "0 0 10px #39FF1488" }}>
              红岸基地 · 1971
            </div>
          </div>
        </section>

        <section
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: 60,
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: 80,
            position: "relative",
            zIndex: 2
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.3em",
                color: "var(--brand-text-soft)",
                marginBottom: 16
              }}
            >
              剧情简介 / SYNOPSIS
            </div>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.9,
                color: "var(--brand-text-soft)",
                letterSpacing: "0.04em",
                fontWeight: 300,
                margin: "0 0 48px 0",
                whiteSpace: "pre-line"
              }}
            >
              {SYNOPSIS}
            </p>

            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.3em",
                color: "var(--brand-text-soft)",
                marginBottom: 16
              }}
            >
              你的身份 / YOUR ROLE
            </div>
            <div
              className="brand-card"
              style={{
                padding: 28,
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 24,
                background:
                  "linear-gradient(135deg, var(--brand-card) 60%, rgba(57,255,20,0.1) 100%)"
              }}
            >
              <div
                style={{
                  width: 96,
                  height: 96,
                  flexShrink: 0,
                  background:
                    "radial-gradient(ellipse at 30% 40%, rgba(57,255,20,.25), transparent 60%), #0D1117",
                  border: "1px solid rgba(57,255,20,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  color: "#39FF14",
                  textAlign: "center",
                  textShadow: "0 0 8px #39FF14"
                }}
              >
                1379_ID
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--brand-text-mute)",
                    letterSpacing: "0.2em",
                    marginBottom: 6
                  }}
                >
                  IDENTITY · {identity.codeName}
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontFamily: "var(--font-zh-serif)",
                    fontWeight: 700,
                    marginBottom: 8,
                    color: "var(--brand-text)"
                  }}
                >
                  {identity.name}
                </div>
                <div style={{ fontSize: 13, color: "var(--brand-text-soft)" }}>
                  目标：<span style={{ color: "#39FF14" }}>阻止叶文洁按下 YES 键</span>
                  <span style={{ margin: "0 12px", color: "var(--brand-border-hi)" }}>│</span>
                  位置：红岸基地 · 1971
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                marginBottom: 48
              }}
            >
              {SANTI_IDENTITIES.filter((ident) => ident.id !== selectedIdentityId).map((ident) => {
                const isSelected = ident.id === selectedIdentityId;
                const isAvailable = ident.isAvailable;
                return (
                  <div
                    key={ident.id}
                    onClick={() => isAvailable && setSelectedIdentityId(ident.id)}
                    style={{
                      padding: "16px 20px",
                      border: isSelected
                        ? "1px solid rgba(57,255,20,0.7)"
                        : "1px solid var(--brand-border)",
                      background: isSelected
                        ? "rgba(57,255,20,0.06)"
                        : "rgba(0,0,0,0.3)",
                      cursor: isAvailable ? "pointer" : "not-allowed",
                      opacity: isAvailable ? 1 : 0.45,
                      transition: "border-color 0.2s, background 0.2s",
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      alignItems: "start",
                      gap: 12
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          marginBottom: 6
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: 16,
                            fontWeight: 700,
                            color: isSelected ? "#39FF14" : "var(--brand-text-soft)",
                            letterSpacing: "0.05em"
                          }}
                        >
                          {ident.codeName}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            color: "var(--brand-text-mute)",
                            letterSpacing: "0.15em"
                          }}
                        >
                          {ident.name}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            color: isSelected ? "#39FF1488" : "var(--brand-border-hi)",
                            letterSpacing: "0.12em"
                          }}
                        >
                          · {ident.faction}
                        </span>
                      </div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 12,
                          lineHeight: 1.6,
                          color: "var(--brand-text-soft)"
                        }}
                      >
                        {ident.description}
                      </p>
                    </div>
                    <div style={{ flexShrink: 0, paddingTop: 2 }}>
                      {isAvailable ? (
                        <div
                          style={{
                            width: 16,
                            height: 16,
                            border: `1px solid ${isSelected ? "#39FF14" : "var(--brand-border-hi)"}`,
                            background: isSelected ? "#39FF14" : "transparent",
                            transform: "rotate(45deg)",
                            transition: "all 0.2s"
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 9,
                            letterSpacing: "0.15em",
                            color: "var(--brand-text-mute)",
                            whiteSpace: "nowrap"
                          }}
                        >
                          {ident.comingSoonLabel ?? "敬请期待"}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.3em",
                color: "var(--brand-text-soft)",
                marginBottom: 16,
                display: "flex",
                justifyContent: "space-between"
              }}
            >
              <span>介入节点 / NODES</span>
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--brand-text-mute)" }}>
                {DEMO_NODES.length} / 8
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {DEMO_NODES.map((node, i) => {
                const isAvailable = node.available;
                return (
                  <div
                    key={node.id}
                    className="brand-card"
                    style={{
                      padding: "18px 24px",
                      display: "flex",
                      alignItems: "center",
                      gap: 20,
                      cursor: isAvailable ? "pointer" : "default",
                      opacity: isAvailable ? 1 : 0.65
                    }}
                    onClick={isAvailable ? () => router.push(watchPathNode) : undefined}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 14,
                        color: "#39FF14",
                        letterSpacing: "0.1em",
                        minWidth: 72,
                        textShadow: "0 0 6px rgba(57,255,20,0.6)"
                      }}
                    >
                      {node.time}
                    </div>
                    <div style={{ width: 1, height: 36, background: "var(--brand-border-hi)" }} />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 500,
                          color: "var(--brand-text)",
                          marginBottom: 4
                        }}
                      >
                        {node.title}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--brand-text-mute)",
                          letterSpacing: "0.04em"
                        }}
                      >
                        {node.desc}
                      </div>
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        letterSpacing: "0.2em",
                        padding: "4px 10px",
                        border: "1px solid var(--brand-border-hi)",
                        color: "var(--brand-text-mute)"
                      }}
                    >
                      NODE_{i + 1}
                    </span>
                  </div>
                );
              })}
              {Array.from({ length: Math.max(0, 8 - DEMO_NODES.length) }).map((_, i) => (
                <div
                  key={`locked${i}`}
                  style={{
                    padding: "14px 24px",
                    border: "1px dashed var(--brand-border)",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    fontSize: 12,
                    color: "var(--brand-text-mute)",
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.18em"
                  }}
                >
                  <span style={{ minWidth: 72 }}>--:--</span>
                  <span>· · ·</span>
                  <span>LOCKED · 通关后解锁</span>
                </div>
              ))}
            </div>
          </div>

          <aside style={{ position: "sticky", top: 80, alignSelf: "start" }}>
            <div
              className="brand-card"
              style={{
                background: "#15151B",
                border: "1px solid var(--brand-border)",
                padding: 28,
                marginBottom: 0
              }}
            >
              {(
                [
                  ["累计介入", stats.interventions],
                  ["平均影响力", stats.avgImpact],
                  ["解锁分支", stats.branches],
                  ["加权排名", stats.rank]
                ] as const
              ).map(([label, val], idx, arr) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    padding: "12px 0",
                    borderBottom:
                      idx < arr.length - 1
                        ? "1px dashed var(--brand-border)"
                        : "none"
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      letterSpacing: "0.2em",
                      color: "var(--brand-text-mute)"
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 18,
                      color: "var(--brand-text)",
                      letterSpacing: "0.04em"
                    }}
                  >
                    {val}
                  </span>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-theme"
              style={{
                width: "100%",
                marginTop: 20,
                padding: "18px 16px",
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                letterSpacing: "0.2em"
              }}
              onClick={() => router.push(watchPathNormal)}
            >
              ▶ 进 入 观 看
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              style={{
                width: "100%",
                marginTop: 12,
                padding: "14px 16px",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: "0.15em"
              }}
              onClick={() => router.push("/")}
            >
              ← 返回选剧
            </button>
          </aside>
        </section>
      </div>
      <StepNav currentStep={2} />
    </>
  );
}
