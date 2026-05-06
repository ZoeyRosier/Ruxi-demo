// 此文件属于品牌层
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useTheme } from "@/contexts/ThemeProvider";
import { BrandHeader } from "@/components/shared/BrandHeader";
import { StepNav } from "@/components/shared/StepNav";
import { santiNodes } from "@/themes/santi/nodes";

// ── 未上线剧目静态配置 ──────────────────────────────
const COMING_SOON_DRAMAS = [
  {
    id: "changxiangsi",
    index: 2,
    name: "《长相思》",
    enName: "EVERLASTING",
    container: "游魂幻梦·寄思协议",
    nodeCount: 6,
    primary: "#E8E0F5",
    accent: "#9B8BB5",
    coverGradient:
      "radial-gradient(ellipse at 30% 40%, rgba(232,224,245,.18), transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(155,139,181,.28), transparent 60%), linear-gradient(160deg, #0a0814 0%, #1a1228 50%, #0d0a18 100%)",
    decor: {
      type: "changxiangsi",
      bottomText: "月落清水 · 玉山旧梦",
      overlay: "radial-gradient(circle at 70% 30%, rgba(232,224,245,.15), transparent 40%)"
    }
  },
  {
    id: "qingyunian",
    index: 3,
    name: "《庆余年》",
    enName: "JOY OF LIFE",
    container: "鉴查院·密档介入",
    nodeCount: 7,
    primary: "#C13F3E",
    accent: "#8B6F47",
    coverGradient:
      "radial-gradient(ellipse at 30% 40%, rgba(193,63,62,.30), transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(229,201,125,.18), transparent 60%), linear-gradient(160deg, #0a0604 0%, #2a1108 50%, #1a0a06 100%)",
    decor: {
      type: "qingyunian",
      bottomText: "鉴 查 院 · 密",
      overlay: "radial-gradient(circle at 30% 70%, rgba(193,63,62,.18), transparent 50%)"
    }
  },
  {
    id: "fanhua",
    index: 4,
    name: "《繁花》",
    enName: "BLOSSOMS",
    container: "黄河路·记忆碎片",
    nodeCount: 5,
    primary: "#FF6B9D",
    accent: "#D4A574",
    coverGradient:
      "radial-gradient(ellipse at 30% 40%, rgba(255,107,157,.32), transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(212,165,116,.22), transparent 60%), linear-gradient(160deg, #0a050a 0%, #2a0e1f 50%, #14081a 100%)",
    decor: {
      type: "fanhua",
      bottomText: "黄河路 · 1993",
      overlay: "radial-gradient(circle at 80% 60%, rgba(255,107,157,.22), transparent 45%)"
    }
  }
] as const;

// ── 非当前剧目卡片（不可点击，"敬请期待"态） ────────────────
function ComingSoonCard({ drama }: { drama: typeof COMING_SOON_DRAMAS[number] }) {
  return (
    <div
      className="brand-card"
      style={{
        gridColumn: "span 1",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        cursor: "default",
        opacity: 0.82,
        animation: `fadeUp .8s ${drama.index * 120}ms both cubic-bezier(.2,.7,.2,1)`
      }}
    >
      {/* 封面 */}
      <div
        style={{
          height: 220,
          position: "relative",
          overflow: "hidden",
          borderBottom: "1px solid var(--brand-border)",
          background: drama.coverGradient
        }}
      >
        {/* 主题装饰叠层 */}
        <div style={{ position: "absolute", inset: 0, background: drama.decor.overlay }} />

        {/* 庆余年专属：密字印章 */}
        {drama.decor.type === "qingyunian" && (
          <div
            style={{
              position: "absolute",
              top: "28%",
              right: "18%",
              width: 56,
              height: 56,
              border: `2px solid ${drama.primary}`,
              background: "rgba(193,63,62,.15)",
              transform: "rotate(8deg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-zh-serif)",
              fontSize: 22,
              fontWeight: 900,
              color: drama.primary
            }}
          >
            密
          </div>
        )}

        {/* 繁花专属：大字水印 */}
        {drama.decor.type === "fanhua" && (
          <div
            style={{
              position: "absolute",
              top: "28%",
              right: "12%",
              fontFamily: "var(--font-zh-serif)",
              fontSize: 30,
              fontWeight: 700,
              color: drama.primary,
              opacity: 0.55,
              textShadow: `0 0 18px ${drama.primary}`,
              letterSpacing: "0.2em"
            }}
          >
            繁花
          </div>
        )}

        {/* 底部文字 */}
        <div
          style={{
            position: "absolute",
            bottom: 28,
            left: 26,
            fontFamily: drama.decor.type === "changxiangsi" ? "var(--font-zh-serif)" : "var(--font-zh-serif)",
            fontSize: 13,
            color: drama.primary,
            opacity: 0.85,
            letterSpacing: "0.3em",
            writingMode: drama.decor.type === "changxiangsi" ? "vertical-rl" : "horizontal-tb"
          }}
        >
          {drama.decor.bottomText}
        </div>

        {/* NO. 编号 */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 18,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.55)"
          }}
        >
          NO. 0{drama.index}
        </div>

        {/* 敬请期待 badge */}
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 18,
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            padding: "3px 8px",
            border: `1px solid rgba(255,255,255,0.2)`,
            color: "rgba(255,255,255,0.45)",
            letterSpacing: "0.2em",
            background: "rgba(0,0,0,0.4)"
          }}
        >
          敬请期待
        </div>
      </div>

      {/* 信息区 */}
      <div
        style={{
          padding: "20px 22px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          flex: 1
        }}
      >
        <div>
          <h3
            style={{
              fontFamily: "var(--font-zh-serif)",
              fontSize: 22,
              fontWeight: 700,
              color: "var(--brand-text)",
              letterSpacing: "0.04em",
              margin: "0 0 4px 0"
            }}
          >
            {drama.name}
          </h3>
          <p
            style={{
              fontSize: 12,
              color: "var(--brand-text-mute)",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.18em",
              margin: 0
            }}
          >
            {drama.enName}
          </p>
        </div>

        <p
          style={{
            fontSize: 13,
            color: "var(--brand-text-soft)",
            letterSpacing: "0.05em",
            lineHeight: 1.6,
            margin: 0
          }}
        >
          {drama.container}
        </p>

        <div
          style={{
            marginTop: "auto",
            paddingTop: 14,
            borderTop: "1px dashed var(--brand-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--brand-text-mute)",
              letterSpacing: "0.18em"
            }}
          >
            ✦ {drama.nodeCount} 个待介入节点
          </span>
          <span
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.2)"
            }}
          >
            →
          </span>
        </div>
      </div>
    </div>
  );
}

const SLOGAN = "让你不再是观众，而是故事里的人。";
const SUBLINE = "RUXI · 互动叙事平台 · 内测 v0.4";

export default function Home() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [displaySlogan, setDisplaySlogan] = useState("");
  const [displaySub, setDisplaySub] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const intervalSubRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setTheme("brand");
  }, []);

  useEffect(() => {
    const tSlogan = setTimeout(() => {
      let i = 0;
      intervalRef.current = setInterval(() => {
        i += 1;
        setDisplaySlogan(SLOGAN.slice(0, i));
        if (i >= SLOGAN.length && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }, 70);
    }, 800);

    const tSub = setTimeout(() => {
      let j = 0;
      intervalSubRef.current = setInterval(() => {
        j += 1;
        setDisplaySub(SUBLINE.slice(0, j));
        if (j >= SUBLINE.length && intervalSubRef.current) {
          clearInterval(intervalSubRef.current);
          intervalSubRef.current = null;
        }
      }, 30);
    }, 3500);

    return () => {
      clearTimeout(tSlogan);
      clearTimeout(tSub);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (intervalSubRef.current) clearInterval(intervalSubRef.current);
    };
  }, []);

  return (
    <>
      <BrandHeader />
      <div
        className="page-fade-in tex-grain"
        style={{
          minHeight: "100vh",
          position: "relative",
          overflow: "auto",
          background: "var(--color-bg-primary)",
          color: "var(--brand-text)"
        }}
      >
        <section
          style={{
            padding: "160px 80px 80px",
            maxWidth: 1440,
            margin: "0 auto",
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
              textTransform: "uppercase",
              marginBottom: 28,
              opacity: 0.85
            }}
          >
            ◇&nbsp;&nbsp;RUXI / IMMERSIVE NARRATIVE / 2026
          </div>

          <h1
            style={{
              fontFamily: "var(--font-zh-serif)",
              fontWeight: 900,
              fontSize: 84,
              lineHeight: 1.05,
              letterSpacing: "0.08em",
              marginBottom: 32,
              background:
                "linear-gradient(180deg, #F5F5F5 0%, #E8E8E8 70%, #8B7FB8 130%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent"
            }}
          >
            入&nbsp;&nbsp;戏
          </h1>

          <p
            style={{
              fontSize: 22,
              fontWeight: 300,
              color: "var(--brand-text)",
              letterSpacing: "0.05em",
              lineHeight: 1.7,
              maxWidth: 720,
              marginBottom: 16,
              minHeight: 38
            }}
          >
            {displaySlogan}
            <span
              style={{
                display: "inline-block",
                width: 2,
                height: 24,
                background: "var(--brand-accent)",
                marginLeft: 4,
                verticalAlign: "middle",
                animation: "blink 1s steps(1) infinite"
              }}
            />
          </p>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--brand-text-mute)",
              letterSpacing: "0.2em",
              minHeight: 18
            }}
          >
            {displaySub}
          </p>

          <div
            style={{
              marginTop: 56,
              display: "flex",
              gap: 48,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.18em",
              color: "var(--brand-text-mute)"
            }}
          >
            <span>
              <span style={{ color: "#39FF14" }}>● </span>ARCHIVE&nbsp;&nbsp;ONLINE
            </span>
            <span>4 DRAMAS · 26 NODES</span>
            <span>YOUR MARKS · 03</span>
            <span
              style={{
                marginLeft: "auto",
                color: "var(--brand-text-soft)"
              }}
            >
              2026.05.06
            </span>
          </div>
        </section>

        <section
          style={{
            padding: "40px 80px 120px",
            maxWidth: 1440,
            margin: "0 auto",
            position: "relative",
            zIndex: 2
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 32,
              paddingBottom: 16,
              borderBottom: "1px solid var(--brand-border)"
            }}
          >
            <h2
              style={{
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: "0.3em",
                color: "var(--brand-text-soft)"
              }}
            >
              当 前 在 库 / DRAMAS
            </h2>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--brand-text-mute)",
                letterSpacing: "0.15em"
              }}
            >
              FILTER: ALL&nbsp;&nbsp;·&nbsp;SORT: FEATURED
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 24
            }}
          >
            <div
              className="brand-card"
              role="button"
              tabIndex={0}
              onClick={() => router.push("/drama/santi")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  router.push("/drama/santi");
              }}
              style={{
                gridColumn: "span 2",
                cursor: "pointer",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <div
                style={{
                  height: 320,
                  position: "relative",
                  overflow: "hidden",
                  borderBottom: "1px solid var(--brand-border)",
                  background:
                    "linear-gradient(135deg, #0D1117 0%, #0D2B0D 60%, #1a3d1a 100%)"
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(57,255,20,0.06) 2px, rgba(57,255,20,0.06) 3px)",
                    pointerEvents: "none"
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 32,
                    left: 32,
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "#39FF14",
                    opacity: 0.7,
                    letterSpacing: "0.2em",
                    lineHeight: 1.5
                  }}
                >
                  1379 RX_ ▮
                  <br />
                  <span style={{ color: "#FFB347" }}>FREQ 18.45MHz</span>
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: "40%",
                    right: "15%",
                    width: 80,
                    height: 80,
                    border: "1px solid #39FF14",
                    transform: "rotate(45deg)",
                    opacity: 0.4,
                    boxShadow: "0 0 24px rgba(57,255,20,0.25)",
                    pointerEvents: "none"
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    right: 18,
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    padding: "4px 10px",
                    border: "1px solid #39FF14",
                    color: "#39FF14",
                    letterSpacing: "0.25em",
                    background: "rgba(0,0,0,0.4)"
                  }}
                >
                  ◆ FEATURED
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 18,
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    color: "rgba(255,255,255,0.55)"
                  }}
                >
                  NO. 01
                </div>
              </div>

              <div
                style={{
                  padding: "24px 22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  flex: 1
                }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-zh-serif)",
                      fontSize: 26,
                      fontWeight: 700,
                      color: "var(--brand-text)",
                      letterSpacing: "0.04em",
                      margin: "0 0 4px 0"
                    }}
                  >
                    《三体》
                  </h3>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--brand-text-mute)",
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "0.18em",
                      margin: 0
                    }}
                  >
                    THREE-BODY PROBLEM
                  </p>
                </div>

                <p
                  style={{
                    fontSize: 13,
                    color: "var(--brand-text-soft)",
                    letterSpacing: "0.05em",
                    lineHeight: 1.6,
                    margin: 0
                  }}
                >
                  1971年红岸基地。叶文洁面临人类历史上最孤独的抉择。
                </p>

                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: 14,
                    borderTop: "1px dashed var(--brand-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "#FFB347",
                      letterSpacing: "0.18em"
                    }}
                  >
                    ✦ {santiNodes.length} 个介入节点
                  </span>
                  <span
                    style={{
                      fontSize: 18,
                      color: "#39FF14",
                      transition: "transform 0.3s"
                    }}
                  >
                    →
                  </span>
                </div>
              </div>
            </div>
            {COMING_SOON_DRAMAS.map((drama) => (
              <ComingSoonCard key={drama.id} drama={drama} />
            ))}
          </div>
        </section>

        <footer
          style={{
            padding: "40px 80px",
            borderTop: "1px solid var(--brand-border)",
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.2em",
            color: "var(--brand-text-mute)",
            maxWidth: 1440,
            margin: "0 auto",
            position: "relative",
            zIndex: 2
          }}
        >
          <span>© 2026 RUXI ARCHIVE</span>
          <span>双 层 视 觉 架 构 · BRAND × THEME</span>
          <span>made with ◇</span>
        </footer>
      </div>
      <StepNav currentStep={1} />
    </>
  );
}
