// 此文件属于主题层
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  loadComposeDraft,
  saveComposeDraft,
  validateMessage
} from "@/services/compose-service";
import { useTheme } from "@/contexts/ThemeProvider";
import { ThemeHeader } from "@/components/shared/ThemeHeader";
import { StepNav } from "@/components/shared/StepNav";

const MAX_CHARS = 300;
const RECIPIENT = "叶文洁";

interface ComposePageProps {
  params: {
    dramaId: string;
    nodeId: string;
  };
}

export default function ComposePage({ params }: ComposePageProps) {
  const { dramaId, nodeId } = params;
  const router = useRouter();
  const { setTheme } = useTheme();
  const [text, setText] = useState("");
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    setTheme("santi");
  }, []);

  useEffect(() => {
    const draft = loadComposeDraft(dramaId, nodeId);
    if (draft) {
      setText(draft.slice(0, MAX_CHARS));
    }
  }, [dramaId, nodeId]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (locked) return;
      const next = e.target.value.slice(0, MAX_CHARS);
      const validation = validateMessage(next);
      if (!validation.valid) return;
      setText(next);
    },
    [locked]
  );

  const sendDisabled = !text.trim() || locked;

  const handleSend = useCallback(() => {
    if (sendDisabled) return;
    saveComposeDraft(dramaId, nodeId, text);
    setLocked(true);
    window.setTimeout(() => {
      router.push(`/judge/${dramaId}/${nodeId}`);
    }, 1400);
  }, [sendDisabled, dramaId, nodeId, text, router]);

  return (
    <>
      <ThemeHeader label="TRINISOLAN-CIPHER-7E2F · 介入终端" />
      <main
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          background: "var(--theme-bg)",
          color: "#fff",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            background:
              "repeating-linear-gradient(0deg, transparent 0, transparent 3px, rgba(57,255,20,0.04) 3px, rgba(57,255,20,0.04) 4px)",
            animation: "scanmove 6s linear infinite"
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 70,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 20,
            padding: "10px 24px",
            border: "1px solid #FFB347",
            background: "rgba(0,0,0,0.5)",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "#FFB347",
            letterSpacing: "0.3em",
            textShadow: "0 0 8px #FFB347"
          }}
        >
          ⚠  ONE-SHOT  ·  你 只 有 一 次 发 送 机 会
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            paddingTop: 130,
            paddingBottom: 110,
            display: "grid",
            gridTemplateColumns: "1fr 80px 1fr",
            gap: 0,
            zIndex: 5
          }}
        >
          <div
            style={{
              margin: "0 0 0 32px",
              border: "1px solid #39FF14",
              background: "rgba(0,0,0,0.55)",
              boxShadow:
                "inset 0 0 40px #39FF1415, 0 0 30px #39FF1425",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <div
              style={{
                padding: "12px 18px",
                borderBottom: "1px solid rgba(57,255,20,0.35)",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "#39FF14",
                letterSpacing: "0.2em",
                display: "flex",
                justifyContent: "space-between"
              }}
            >
              <span>SENDER · 三体监听员 1379 号</span>
              <span>TX 18.45 MHz</span>
            </div>

            <div
              style={{
                flex: 1,
                padding: "24px 22px",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "#39FF14",
                  letterSpacing: "0.2em",
                  marginBottom: 14,
                  opacity: 0.7
                }}
              >
                &gt; {new Date().toISOString().slice(0, 19)} · CONNECTING TO{" "}
                {RECIPIENT.toUpperCase()}...
              </div>

              <textarea
                value={text}
                onChange={handleChange}
                disabled={locked}
                placeholder="> 输入跨越光年的讯息..."
                style={{
                  flex: 1,
                  width: "100%",
                  background: "transparent",
                  color: locked ? "rgba(57,255,20,0.5)" : "#39FF14",
                  fontFamily: "var(--font-mono)",
                  fontSize: 15,
                  lineHeight: 1.8,
                  letterSpacing: "0.05em",
                  resize: "none",
                  border: "none",
                  outline: "none",
                  textShadow: "0 0 6px rgba(57,255,20,0.5)"
                }}
              />

              <div
                style={{
                  marginTop: 14,
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.15em"
                }}
              >
                <span style={{ color: "#39FF14", opacity: 0.7 }}>▮ INPUT_ACTIVE</span>
                <span>{text.length} / 300</span>
              </div>
            </div>
          </div>

          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <DataFlow active={text.length > 0} />

            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) rotate(-90deg)",
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: "#00D4FF",
                letterSpacing: "0.4em",
                whiteSpace: "nowrap",
                opacity: 0.7
              }}
            >
              1.27 LIGHT YEARS
            </div>
          </div>

          <div
            style={{
              margin: "0 32px 0 0",
              border: "1px solid #FFB347",
              background: "rgba(0,0,0,0.55)",
              boxShadow: "inset 0 0 40px #FFB34715",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div
              style={{
                padding: "12px 18px",
                borderBottom: "1px solid rgba(255,179,71,0.35)",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "#FFB347",
                letterSpacing: "0.2em",
                display: "flex",
                justifyContent: "space-between"
              }}
            >
              <span>RECEIVER · {RECIPIENT.toUpperCase()}</span>
              <span>红岸基地</span>
            </div>

            <div style={{ flex: 1, position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(ellipse at 30% 60%, rgba(57,255,20,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(157,78,221,0.1) 0%, transparent 60%)",
                  opacity: 0.5
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  fontFamily: "var(--font-mono)",
                  color: "#FFB347",
                  fontSize: 14,
                  lineHeight: 1.8
                }}
              >
                {text ? (
                  <div
                    style={{
                      padding: "14px 18px",
                      background: "rgba(0,0,0,0.65)",
                      border: "1px solid rgba(255,179,71,0.35)",
                      color: "#FFB347",
                      fontFamily: "var(--font-mono)",
                      fontSize: 14,
                      lineHeight: 1.8,
                      textShadow: "0 0 6px rgba(255,179,71,0.5)",
                      whiteSpace: "pre-wrap",
                      animation: "fadeUp .3s",
                      borderRadius: 2
                    }}
                  >
                    {text}
                    <span
                      style={{
                        display: "inline-block",
                        width: 8,
                        height: 14,
                        background: "#FFB347",
                        marginLeft: 4,
                        animation: "blink 1s steps(1) infinite"
                      }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "rgba(255,255,255,.4)",
                      letterSpacing: "0.2em",
                      textAlign: "center",
                      padding: 30
                    }}
                  >
                    · · ·  WAITING FOR SIGNAL  · · ·
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: 0,
            right: 0,
            padding: "20px 32px",
            borderTop: "1px solid rgba(57,255,20,0.2)",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 10
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "rgba(255,255,255,.5)",
              letterSpacing: "0.18em",
              display: "flex",
              gap: 24
            }}
          >
            <span>
              <span style={{ color: "#39FF14" }}>●</span> CHANNEL OPEN
            </span>
            <span>ENCRYPTION: TRINISOLAN-CIPHER-7E2F</span>
            <span>LATENCY: 0.0042s</span>
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={sendDisabled}
            style={{
              padding: "14px 36px",
              fontSize: 13,
              fontFamily: "var(--font-mono)",
              textTransform: "uppercase",
              fontWeight: 700,
              letterSpacing: "0.15em",
              background: "#39FF14",
              color: "#000",
              border: "none",
              boxShadow: "0 0 0 1px #39FF14, 0 0 20px rgba(57,255,20,0.4)",
              opacity: sendDisabled ? 0.4 : 1,
              cursor: sendDisabled ? "not-allowed" : "pointer",
              transform: "translateY(0)",
              transition: "all .25s ease",
              whiteSpace: "nowrap"
            }}
            onMouseEnter={(e) => {
              if (sendDisabled) return;
              e.currentTarget.style.boxShadow =
                "0 0 0 1px #39FF14, 0 0 32px rgba(57,255,20,0.7)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                "0 0 0 1px #39FF14, 0 0 20px rgba(57,255,20,0.4)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {locked ? "◇ TRANSMITTING ..." : "▶ 发送 / TRANSMIT"}
          </button>
        </div>
      </main>
      <StepNav currentStep={5} />

      <style jsx global>{`
        .ruxi-compose textarea::placeholder {
          color: rgba(57, 255, 20, 0.55);
        }
        @keyframes flowRight {
          from {
            left: 0;
          }
          to {
            left: 100%;
          }
        }
      `}</style>
    </>
  );
}

function DataFlow({ active }: { active: boolean }) {
  return (
    <div
      style={{
        width: "100%",
        height: "60%",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, #39FF14, #FFB347, transparent)",
          opacity: active ? 0.8 : 0.25,
          transition: "opacity .3s"
        }}
      />
      {active &&
        Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: i % 2 ? "#39FF14" : "#00D4FF",
              boxShadow: `0 0 8px ${i % 2 ? "#39FF14" : "#00D4FF"}`,
              animation: `flowRight ${1.2 + (i % 4) * 0.3}s ${i * 0.15}s linear infinite`,
              transform: "translateY(-50%)"
            }}
          />
        ))}
    </div>
  );
}
