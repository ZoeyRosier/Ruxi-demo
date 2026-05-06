// 此文件属于主题层
"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useTheme } from "@/contexts/ThemeProvider";
import { ThemeHeader } from "@/components/shared/ThemeHeader";
import { StepNav } from "@/components/shared/StepNav";

interface ActivatePageProps {
  params: {
    dramaId: string;
    nodeId: string;
  };
}

const PRIMARY = "#39FF14";
const ACCENT = "#FFB347";
const BG = "var(--theme-bg)";

const METAPHOR_IDENTITY = "三体监听员  1379  号";
const METAPHOR_CIPHER = "TRINISOLAN-CIPHER-7E2F";
const TASK_LINES =
  "目标:阻止叶文洁按下发送键。\n你只有一次发送机会。";

function CornerHUD() {
  const corner = (extra: CSSProperties) => (
    <div
      style={{
        position: "absolute",
        width: 28,
        height: 28,
        border: `1px solid ${PRIMARY}`,
        pointerEvents: "none",
        ...extra
      }}
    />
  );
  return (
    <>
      {corner({
        top: 24,
        left: 24,
        borderRight: "none",
        borderBottom: "none"
      })}
      {corner({
        top: 24,
        right: 24,
        borderLeft: "none",
        borderBottom: "none"
      })}
      {corner({
        bottom: 24,
        left: 24,
        borderRight: "none",
        borderTop: "none"
      })}
      {corner({
        bottom: 24,
        right: 24,
        borderLeft: "none",
        borderTop: "none"
      })}
    </>
  );
}

function AwakeningParticles() {
  const items = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: 2 + Math.random() * 2,
        opacity: Math.random() * 0.4,
        duration: 8 + Math.random() * 12,
        delay: Math.random() * 5
      })),
    []
  );

  return (
    <>
      {items.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: PRIMARY,
            opacity: p.opacity,
            animation: `activateParticleFloat ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
            pointerEvents: "none",
            zIndex: 1
          }}
        />
      ))}
    </>
  );
}

export default function ActivatePage({ params }: ActivatePageProps) {
  const { dramaId, nodeId } = params;
  const router = useRouter();
  const { setTheme } = useTheme();

  const [phase, setPhase] = useState(0);
  const [identityText, setIdentityText] = useState("");
  const [taskText, setTaskText] = useState("");
  const hasStartedRef = useRef(false);

  useEffect(() => {
    setTheme("santi");
  }, []);

  /** 与 AwakeningPage 相同 phase 时刻：800 / 1500 / 3000 / 5000 ms */
  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    let cancelled = false;
    const t1 = window.setTimeout(() => {
      if (!cancelled) setPhase(1);
    }, 800);
    const t2 = window.setTimeout(() => {
      if (!cancelled) setPhase(2);
    }, 1500);
    const t3 = window.setTimeout(() => {
      if (!cancelled) setPhase(3);
    }, 3000);
    const t4 = window.setTimeout(() => {
      if (!cancelled) setPhase(4);
    }, 5000);

    return () => {
      cancelled = true;
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
      hasStartedRef.current = false;
    };
  }, []);

  /** 身份打字机：与 useTypewriter(identity, 80, 1500) 一致 */
  useEffect(() => {
    let cancelled = false;
    let intervalId: number | null = null;
    const startT = window.setTimeout(() => {
      if (cancelled) return;
      let ch = 0;
      intervalId = window.setInterval(() => {
        if (cancelled) return;
        ch += 1;
        setIdentityText(METAPHOR_IDENTITY.slice(0, ch));
        if (ch >= METAPHOR_IDENTITY.length && intervalId !== null) {
          window.clearInterval(intervalId);
          intervalId = null;
        }
      }, 80);
    }, 1500);

    return () => {
      cancelled = true;
      window.clearTimeout(startT);
      if (intervalId !== null) window.clearInterval(intervalId);
    };
  }, []);

  /** 任务打字机：与 useTypewriter(task, 50, 3000) 一致 */
  useEffect(() => {
    let cancelled = false;
    let intervalId: number | null = null;
    const startT = window.setTimeout(() => {
      if (cancelled) return;
      let ch = 0;
      intervalId = window.setInterval(() => {
        if (cancelled) return;
        ch += 1;
        setTaskText(TASK_LINES.slice(0, ch));
        if (ch >= TASK_LINES.length && intervalId !== null) {
          window.clearInterval(intervalId);
          intervalId = null;
        }
      }, 50);
    }, 3000);

    return () => {
      cancelled = true;
      window.clearTimeout(startT);
      if (intervalId !== null) window.clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <ThemeHeader label="身份唤起 · ACTIVATION" />
      <div
        className="tex-grain"
        style={{
          position: "relative",
          width: "100vw",
          minHeight: "100vh",
          background: BG,
          overflow: "hidden",
          color: "#fff"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(57,255,20,.07) 2px, rgba(57,255,20,.07) 3px)",
            animation: "scanmove 0.8s linear infinite",
            pointerEvents: "none",
            zIndex: 0
          }}
        />

        <AwakeningParticles />
        <CornerHUD />

        {phase < 1 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(90deg, transparent, ${PRIMARY}33, transparent)`,
              mixBlendMode: "screen",
              animation: "glitchOverlay 0.8s",
              pointerEvents: "none",
              zIndex: 3
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            inset: "48px 0 40px 0",
            zIndex: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              textAlign: "center",
              width: "min(760px, 88vw)",
              padding: "32px 40px 16px"
            }}
          >
          <div
            style={{
              width: 128,
              height: 128,
              margin: "0 auto 26px",
              opacity: phase >= 1 ? 1 : 0,
              transform: phase >= 1 ? "scale(1)" : "scale(.85)",
              transition: "all 1s cubic-bezier(.2,.7,.2,1)",
              position: "relative"
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                border: `1px solid ${PRIMARY}`,
                transform: "rotate(45deg)",
                boxShadow: `0 0 30px ${PRIMARY}80, inset 0 0 30px ${PRIMARY}40`,
                animation: "pulseBadge 2s ease-in-out infinite"
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 14,
                border: `1px solid ${PRIMARY}66`,
                transform: "rotate(45deg)"
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-display)",
                fontSize: 26,
                fontWeight: 900,
                color: PRIMARY,
                textShadow: `0 0 14px ${PRIMARY}`
              }}
            >
              1379
            </div>
          </div>

          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.35em",
              color: ACCENT,
              marginBottom: 12,
              opacity: phase >= 2 ? 1 : 0,
              transition: "opacity .6s"
            }}
          >
            ◆ {METAPHOR_CIPHER} ◆
          </div>

          <h1
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 36,
              fontWeight: 700,
              color: PRIMARY,
              letterSpacing: "0.12em",
              margin: "0 0 28px 0",
              textShadow: `0 0 14px ${PRIMARY}80`,
              minHeight: 72
            }}
          >
            {identityText}
            <span
              style={{
                display: "inline-block",
                width: 2,
                height: 28,
                background: PRIMARY,
                marginLeft: 6,
                verticalAlign: "middle",
                animation: "blink 1s steps(1) infinite"
              }}
            />
          </h1>

          <div
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,.85)",
              letterSpacing: "0.04em",
              lineHeight: 1.75,
              minHeight: 60,
              marginBottom: 34,
              fontFamily: "var(--font-mono)",
              whiteSpace: "pre-line",
              opacity: phase >= 3 ? 1 : 0,
              transition: "opacity .6s"
            }}
          >
            {taskText}
          </div>

          <div
            style={{
              opacity: phase >= 4 ? 1 : 0,
              transform: phase >= 4 ? "translateY(0)" : "translateY(20px)",
              transition: "all .8s",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10
            }}
          >
            <button
              type="button"
              className="btn btn-theme"
              style={{ padding: "16px 44px", fontSize: 12, minWidth: 300 }}
              onClick={() => router.push(`/compose/${dramaId}/${nodeId}`)}
            >
              ◆ 接 受 介 入 / ACCEPT
            </button>
            <div
              style={{
                marginTop: 6,
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.24em",
                color: "rgba(255,255,255,.32)"
              }}
            >
              ⚠ 你 只 有 一 次 介 入 机 会 · ONE-SHOT
            </div>
          </div>
        </div>
        </div>
      </div>
      <StepNav currentStep={4} />
    </>
  );
}
