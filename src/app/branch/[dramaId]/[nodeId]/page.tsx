// 此文件属于主题层
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { VIDEO_MAPPING, type VideoMappingKey } from "@/data/video-mapping";
import { loadComposeDraft } from "@/services/compose-service";
import {
  buildInterventionRecord,
  SANTI_YES_ENDING_TEXT
} from "@/engines/memory";
import { LocalStorageInterventionStorage } from "@/lib/implementations/local-storage-intervention";
import { useTheme } from "@/contexts/ThemeProvider";
import type { BranchType, JudgmentResult } from "@/lib/types";
import { ThemeHeader } from "@/components/shared/ThemeHeader";
import { StepNav } from "@/components/shared/StepNav";
import { RouteTransition } from "@/components/transitions/RouteTransition";

interface BranchPageProps {
  params: {
    dramaId: string;
    nodeId: string;
  };
}

const PRIMARY = "#39FF14";
const ACCENT = "#FFB347";

/** 与 03_claude-prototypes/themes.js 中 santi.coverGradient 一致 */
const SANTI_COVER_GRADIENT =
  "radial-gradient(ellipse at 30% 40%, rgba(57,255,20,.32), transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(157,78,221,.35), transparent 60%), linear-gradient(135deg, #050a05 0%, #0a0f1a 60%, #1a0a1f 100%)";

const BRANCH_KEY = (dramaId: string, nodeId: string) =>
  `ruxi:v1:judge:${dramaId}:${nodeId}:branch`;

const RESULT_KEY = (dramaId: string, nodeId: string) =>
  `ruxi:v1:judge:${dramaId}:${nodeId}:result`;

const SESSION_USER_KEY = "ruxi:v1:session:userId";
const FALLBACK_USER_ID = "anonymous-user";

function readJudgment(
  dramaId: string,
  nodeId: string
): JudgmentResult | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(RESULT_KEY(dramaId, nodeId));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as JudgmentResult;
  } catch {
    return null;
  }
}

function readUserId(): string {
  if (typeof window === "undefined") return FALLBACK_USER_ID;
  return window.sessionStorage.getItem(SESSION_USER_KEY) ?? FALLBACK_USER_ID;
}

function isBranchType(value: string | null): value is BranchType {
  return value === "high" || value === "medium" || value === "low";
}

function readBranch(dramaId: string, nodeId: string): BranchType | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(BRANCH_KEY(dramaId, nodeId));
  return isBranchType(raw) ? raw : null;
}

function buildVideoKey(branch: BranchType): VideoMappingKey {
  return `santi/yes-button-1971/branch-${branch}` as VideoMappingKey;
}

const BRANCH_LINES: Record<BranchType, string[]> = {
  high: ["她没有按下发送键。", "人类还有时间。", "— 你拯救了一个时间线。"],
  medium: ["叶文洁读完了这条消息。", "她的手缓缓落下。", "— 这一刻，历史仍在流动。"],
  low: ["消息如石沉大海。", "叶文洁按下了 YES。", "— 宇宙沉默，等待三体。"]
};

export default function BranchPage({ params }: BranchPageProps) {
  const { dramaId, nodeId } = params;
  const router = useRouter();
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("santi");
  }, []);

  const [branch, setBranch] = useState<BranchType | null>(null);
  const [phase, setPhase] = useState(0);
  const hasPersistedRef = useRef(false);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const detected = readBranch(dramaId, nodeId);
    setBranch(detected);

    if (!detected || hasPersistedRef.current) return;
    hasPersistedRef.current = true;

    const judgment = readJudgment(dramaId, nodeId);
    if (!judgment) return;

    const userMessage = loadComposeDraft(dramaId, nodeId) ?? "";
    const userId = readUserId();
    const endingText = SANTI_YES_ENDING_TEXT[detected];

    const record = buildInterventionRecord({
      userId,
      dramaId,
      nodeId,
      identityId: "listener-1379",
      userMessage,
      judgment,
      endingText
    });

    const storage = new LocalStorageInterventionStorage();
    void Promise.all([
      storage.save(record),
      storage.upsertLatestByNode(record)
    ]).catch((err) => {
      console.warn("[branch] persist intervention failed", err);
    });
  }, [dramaId, nodeId]);

  useEffect(() => {
    if (!branch || hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;
    const lines = BRANCH_LINES[branch];
    const timers = lines.map((_, i) =>
      window.setTimeout(() => setPhase(i + 1), 2000 + i * 1500)
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [branch]);

  const ready = branch !== null;
  const videoSrc = ready ? VIDEO_MAPPING[buildVideoKey(branch)]?.src ?? "" : "";
  const lines = ready ? BRANCH_LINES[branch] : [];

  return (
    <RouteTransition variant="theme" duration={600}>
      <ThemeHeader label="分支结局 · ENDING" />
      <main
        style={{
          position: "relative",
          width: "100vw",
          minHeight: "calc(100vh - 40px)",
          paddingTop: 48,
          background: "#000",
          overflow: "hidden",
          color: "#fff",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* 与原型 BranchPage：flex:1 视频区 + coverGradient + 扫描线 + 占位/视频 */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: SANTI_COVER_GRADIENT
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "repeating-linear-gradient(0deg, transparent 0, transparent 3px, rgba(57,255,20,.05) 3px, rgba(57,255,20,.05) 4px)",
              animation: "scanmove 4s linear infinite",
              pointerEvents: "none"
            }}
          />
          {ready && videoSrc ? (
            <video
              src={videoSrc}
              autoPlay
              muted
              loop
              playsInline
              style={{
                position: "relative",
                zIndex: 5,
                width: "min(820px, 70vw)",
                aspectRatio: "16/9",
                border: `1px solid ${PRIMARY}55`,
                background: "rgba(0,0,0,.5)",
                objectFit: "cover"
              }}
            />
          ) : (
            <div
              style={{
                position: "relative",
                zIndex: 5,
                width: "min(820px, 70vw)",
                aspectRatio: "16/9",
                border: `1px solid ${PRIMARY}55`,
                background: "rgba(0,0,0,.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 18,
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.2em",
                color: PRIMARY
              }}
            >
              <div style={{ fontSize: 13 }}>
                {"◇ 分 支 视 频" + "  / BRANCH CLIP"}
              </div>
              <div style={{ fontSize: 10, opacity: 0.6 }}>
                5s · 叶文洁 · CLOSE-UP
              </div>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  border: `1px solid ${PRIMARY}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                ▶
              </div>
            </div>
          )}
        </div>

        {/* 结局区：与原型 padding 与逐行动画一致 */}
        <div
          style={{
            padding: "40px 60px 100px",
            textAlign: "center",
            position: "relative",
            zIndex: 5
          }}
        >
          {lines.map((l, i) => (
            <div
              key={i}
              style={{
                /* 与原型 BranchPage 结局行：santi 用 mono，26 / 18，0.15em */
                fontFamily: "var(--font-mono)",
                fontSize: i === 2 ? 18 : 26,
                fontWeight: 400,
                lineHeight: i === 2 ? 1.65 : 1.5,
                color: i === 2 ? ACCENT : PRIMARY,
                letterSpacing: "0.15em",
                marginBottom: 14,
                opacity: phase > i ? 1 : 0,
                transform: phase > i ? "translateY(0)" : "translateY(20px)",
                transition: "all 1s",
                textShadow: `0 0 14px ${
                  (i === 2 ? ACCENT : PRIMARY) + "80"
                }`,
                WebkitFontSmoothing: "antialiased"
              }}
            >
              {l}
            </div>
          ))}

          {!ready && (
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: "0.12em",
                color: "rgba(255,255,255,.45)"
              }}
            >
              ◇ 等待分支数据...
            </div>
          )}

          <button
            type="button"
            onClick={() => router.push("/archive")}
            disabled={!ready}
            className="btn btn-theme-outline"
            style={{
              marginTop: 30,
              padding: "14px 36px",
              opacity: ready && phase >= lines.length ? 1 : 0,
              transition: "opacity .8s",
              cursor: ready ? "pointer" : "not-allowed"
            }}
          >
            ◇ 查 看 我 的 印 记 / VIEW MARK
          </button>
        </div>
      </main>
      <StepNav currentStep={7} />
    </RouteTransition>
  );
}
