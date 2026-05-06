// 此文件属于主题层
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

import { evaluateWatchTick, type WatchRuntime, createInitialWatchRuntime } from "@/services/watch-service";
import { savePausedAt, saveWatchResume, loadWatchResume } from "@/lib/watch-runtime";
import type { VideoSource } from "@/lib/abstractions";
import { LocalVideoSource } from "@/lib/implementations/local-video-source";
import { VIDEO_MAPPING, type VideoMappingKey } from "@/data/video-mapping";
import { santiNodes } from "@/themes/santi/nodes";
import { WatchTimeline } from "@/components/theme/santi/WatchTimeline";
import { useTheme } from "@/contexts/ThemeProvider";
import { ThemeHeader } from "@/components/shared/ThemeHeader";
import { StepNav } from "@/components/shared/StepNav";
import { RouteTransition } from "@/components/transitions/RouteTransition";

interface WatchPageProps {
  params: {
    dramaId: string;
    nodeId: string;
  };
}

const PRIMARY = "#39FF14";

/** 与 themes.js santi.coverGradient 一致 */
const SANTI_COVER_GRADIENT =
  "radial-gradient(ellipse at 30% 40%, rgba(57,255,20,.32), transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(157,78,221,.35), transparent 60%), linear-gradient(135deg, #050a05 0%, #0a0f1a 60%, #1a0a1f 100%)";

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

function formatTimecode(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${pad2(m)}:${pad2(s)}`;
}

function WatchPageContent({ params }: WatchPageProps) {
  const { dramaId, nodeId } = params;
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") ?? "node";
  const router = useRouter();
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("santi");
  }, []);

  const mainVideoKey = `${dramaId}/${nodeId}/main` as VideoMappingKey;
  const videoSrc = VIDEO_MAPPING[mainVideoKey]?.src ?? "";
  const durationSec = VIDEO_MAPPING[mainVideoKey]?.durationHintSec ?? 180;
  const [totalDurationSec, setTotalDurationSec] = useState(durationSec);
  const currentNode = santiNodes.find((n) => n.id === nodeId) ?? santiNodes[0];
  const triggerTimestampSec = currentNode?.triggerTimestamp ?? 120;
  // mode=node：从节点前 10 秒开始；mode=normal：从 0 开始
  const startSec = mode === "normal" ? 0 : Math.max(0, triggerTimestampSec - 10);
  const hasVideoFile = Boolean(videoSrc?.trim());

  const [currentTimeSec, setCurrentTimeSec] = useState(startSec);
  const [showNearHint, setShowNearHint] = useState(false);
  const [awaitingActivate, setAwaitingActivate] = useState(false);
  const [isResumed, setIsResumed] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const runtimeRef = useRef<WatchRuntime>(createInitialWatchRuntime());
  const pausedAtTriggerRef = useRef(false);
  const isPlayingRef = useRef(true);
  const tickRef = useRef(startSec);
  const videoSourceRef = useRef<VideoSource | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isVideoLoadedRef = useRef(false);

  useEffect(() => {
    // mode=normal：从上次退出位置续播
    if (mode === "normal") {
      const savedResume = loadWatchResume(dramaId, nodeId);
      if (savedResume !== null) {
        tickRef.current = savedResume;
        setCurrentTimeSec(savedResume);
        setIsResumed(true);
      }
    }

    const resolveVideoSrc = (videoKey: string): string => {
      const key = videoKey as VideoMappingKey;
      return VIDEO_MAPPING[key]?.src ?? "";
    };

    const el = videoRef.current;
    if (hasVideoFile && el) {
      const source = new LocalVideoSource(el, resolveVideoSrc);
      videoSourceRef.current = source;
      void source.load(mainVideoKey).then(() => {
        // 优先使用真实视频时长驱动时间轴，回退到 mapping 的 durationHintSec
        const metaDuration = Number.isFinite(el.duration) ? Math.floor(el.duration) : 0;
        if (metaDuration > 0) setTotalDurationSec(metaDuration);
        source.seek(tickRef.current);
        isVideoLoadedRef.current = true;
        if (isPlayingRef.current) {
          void source.play().catch(() => undefined);
        }
      });
      el.onloadedmetadata = () => {
        const d = Number.isFinite(el.duration) ? Math.floor(el.duration) : 0;
        if (d > 0) setTotalDurationSec(d);
      };
    } else {
      setTotalDurationSec(durationSec);
    }

    let saveTickCount = 0;
    const timer = window.setInterval(() => {
      if (!isPlayingRef.current) return;
      const activeSource = videoSourceRef.current;

      let nextSec: number;
      if (hasVideoFile && activeSource) {
        if (isVideoLoadedRef.current) {
          // 视频已就绪：读取实际播放位置驱动进度条
          nextSec = Math.floor(activeSource.getCurrentTime());
          tickRef.current = nextSec;
        } else {
          // 视频加载中：保持 startSec，防止进度条被 getCurrentTime()=0 覆盖
          nextSec = tickRef.current;
        }
      } else {
        // 无视频：用计时器模拟播放进度
        tickRef.current += 1;
        nextSec = tickRef.current;
      }
      setCurrentTimeSec(nextSec);

      // mode=normal：每 5 秒自动保存续播位置
      if (mode === "normal" && isVideoLoadedRef.current) {
        saveTickCount++;
        if (saveTickCount % 5 === 0) {
          saveWatchResume(dramaId, nodeId, nextSec);
        }
      }

      const tick = evaluateWatchTick({
        currentTimeSec: nextSec,
        node: { triggerTimestamp: triggerTimestampSec },
        runtime: runtimeRef.current
      });

      runtimeRef.current = tick.nextRuntime;
      setShowNearHint(tick.shouldShowNearHint);

      if (tick.shouldPause) {
        activeSource?.pause();
        isPlayingRef.current = false;
        setIsPlaying(false);
      }

      if (tick.shouldTriggerNode && !pausedAtTriggerRef.current) {
        pausedAtTriggerRef.current = true;
        savePausedAt(dramaId, nodeId, nextSec);
        setAwaitingActivate(true);
      }
    }, 1000);

    return () => {
      window.clearInterval(timer);
      // 退出时保存最终进度，供下次"进入观看"续播
      if (mode === "normal" && tickRef.current > 0) {
        saveWatchResume(dramaId, nodeId, tickRef.current);
      }
      videoSourceRef.current?.pause();
      videoSourceRef.current = null;
      isVideoLoadedRef.current = false;
    };
  }, [dramaId, nodeId, hasVideoFile, mainVideoKey, triggerTimestampSec, durationSec, mode]);

  const handleSeek = (sec: number) => {
    const clamped = Math.max(0, Math.min(sec, totalDurationSec));
    tickRef.current = clamped;
    setCurrentTimeSec(clamped);
    if (videoSourceRef.current) {
      videoSourceRef.current.seek(clamped);
      if (isPlayingRef.current) {
        void videoSourceRef.current.play().catch(() => undefined);
      }
    }
  };

  const handleTogglePlay = () => {
    const newPlaying = !isPlayingRef.current;
    isPlayingRef.current = newPlaying;
    setIsPlaying(newPlaying);
    if (newPlaying) {
      void videoSourceRef.current?.play().catch(() => undefined);
    } else {
      videoSourceRef.current?.pause();
    }
  };

  const handleToggleMute = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setIsMuted(el.muted);
  };

  const SPEED_OPTIONS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  const handleSetSpeed = (rate: number) => {
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const [isPanelDismissed, setIsPanelDismissed] = useState(false);
  const showRightPanel = (showNearHint || awaitingActivate) && !isPanelDismissed;

  const nodeTitle = currentNode?.title ?? "YES按钮节点";
  const triggerLabel = currentNode?.triggerTimecode ?? formatTimecode(triggerTimestampSec);

  return (
    <div style={{ transition: "opacity 0.2s", opacity: isExiting ? 0 : 1 }}>
      <RouteTransition variant="theme">
        <ThemeHeader label={`《三体》 · ${currentNode?.location ?? "红岸基地"}`} />
        <main
          style={{
            position: "relative",
            width: "100vw",
            minHeight: "calc(100vh - 40px)",
            background: "var(--theme-bg)",
            overflow: "hidden",
            color: "#fff"
          }}
        >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: SANTI_COVER_GRADIENT,
            opacity: 0.9,
            pointerEvents: "none"
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(0deg, transparent 0, transparent 3px, rgba(57,255,20,.04) 3px, rgba(57,255,20,.04) 4px)",
            animation: "scanmove 6s linear infinite",
            pointerEvents: "none"
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 48,
            left: 0,
            right: 0,
            bottom: 110,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 24px",
            zIndex: 2
          }}
        >
          {hasVideoFile ? (
            <div
              style={{
                width: "min(900px, 70vw)",
                aspectRatio: "16/9",
                border: `1px solid ${PRIMARY}55`,
                background: "rgba(0,0,0,0.35)",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: `0 0 24px ${PRIMARY}22`
              }}
            >
              <video
                ref={videoRef}
                playsInline
                muted
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block"
                }}
              />
            </div>
          ) : (
            <div
              style={{
                width: "min(900px, 70vw)",
                aspectRatio: "16/9",
                border: "1px solid rgba(57,255,20,0.35)",
                background: "rgba(0,0,0,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 14,
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.25em",
                color: PRIMARY,
                backdropFilter: "blur(2px)",
                textShadow: `0 0 8px ${PRIMARY}`
              }}
            >
              <div style={{ fontSize: 14, opacity: 0.85 }}>◇ 剧 集 视 频 占 位</div>
              <div style={{ fontSize: 11, opacity: 0.6, letterSpacing: "0.18em" }}>
                《三体》· {nodeTitle}
              </div>
              <div
                style={{
                  marginTop: 14,
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  border: `1px solid ${PRIMARY}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20
                }}
              >
                ▶
              </div>
            </div>
          )}
        </div>

        {showRightPanel && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: 40,
              transform: "translateY(-50%)",
              padding: "14px 20px",
              border: `1px solid ${PRIMARY}`,
              background: "rgba(13,17,23,0.85)",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: PRIMARY,
              letterSpacing: "0.2em",
              animation: "fadeUp 0.6s both",
              textShadow: `0 0 8px ${PRIMARY}`,
              maxWidth: 260,
              zIndex: 15
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ opacity: 0.7 }}>◆ NODE INCOMING</div>
              <button
                type="button"
                onClick={() => setIsPanelDismissed(true)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "rgba(255,255,255,0.4)",
                  cursor: "pointer",
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  lineHeight: 1,
                  padding: "0 0 0 12px",
                  letterSpacing: 0
                }}
                title="暂不介入"
              >
                ×
              </button>
            </div>
            <div style={{ fontSize: 12, color: "#fff", marginBottom: 10 }}>
              {nodeTitle}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.6,
                marginBottom: 8,
                letterSpacing: "0.05em"
              }}
            >
              {currentNode?.desc ?? ""}
            </div>
            <div style={{ fontSize: 10, opacity: 0.65 }}>触发于 {triggerLabel}</div>
            <button
              type="button"
              onClick={() => {
                setIsExiting(true);
                window.setTimeout(() => router.push(`/activate/${dramaId}/${nodeId}`), 220);
              }}
              style={{
                marginTop: 14,
                width: "100%",
                padding: "10px",
                background: PRIMARY,
                color: "#000",
                fontWeight: 700,
                letterSpacing: "0.2em",
                fontSize: 11,
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-mono)"
              }}
            >
              立 即 介 入 ▶
            </button>
          </div>
        )}

        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 0,
            right: 0,
            padding: "14px 32px 8px",
            background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
            zIndex: 20
          }}
        >
          {isResumed && (
            <p
              style={{
                margin: "0 0 10px 0",
                fontSize: 11,
                fontFamily: "var(--font-mono)",
                color: "rgba(255,255,255,0.55)",
                letterSpacing: "0.12em"
              }}
            >
              已从暂停点恢复播放
            </p>
          )}
          <WatchTimeline
            currentTimeSec={currentTimeSec}
            triggerTimestamp={triggerTimestampSec}
            totalDurationSec={totalDurationSec}
            isNearNode={showNearHint}
            onSeek={handleSeek}
          />

          <div
            style={{
              marginTop: 4,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={handleTogglePlay}
                style={{
                  background: "transparent",
                  border: `1px solid ${PRIMARY}66`,
                  color: PRIMARY,
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  padding: "4px 10px",
                  cursor: "pointer"
                }}
              >
                {isPlaying ? "暂 停 ▌▌" : "播 放 ▶"}
              </button>
              <button
                type="button"
                onClick={handleToggleMute}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.25)",
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  padding: "4px 10px",
                  cursor: "pointer"
                }}
              >
                {isMuted ? "静 音 ×" : "已 开 声 ♪"}
              </button>
            </div>
            <div style={{ position: "relative" }}>
              {showSpeedMenu && (
                <>
                  <div
                    style={{ position: "fixed", inset: 0, zIndex: 18 }}
                    onClick={() => setShowSpeedMenu(false)}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "calc(100% + 6px)",
                      right: 0,
                      background: "rgba(13,17,23,0.97)",
                      border: `1px solid ${PRIMARY}44`,
                      zIndex: 19,
                      minWidth: 80
                    }}
                  >
                    {SPEED_OPTIONS.map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => handleSetSpeed(rate)}
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "6px 14px",
                          background: rate === playbackRate ? `${PRIMARY}22` : "transparent",
                          border: "none",
                          borderBottom: `1px solid rgba(57,255,20,0.08)`,
                          color: rate === playbackRate ? PRIMARY : "rgba(255,255,255,0.55)",
                          cursor: "pointer",
                          fontFamily: "var(--font-mono)",
                          fontSize: 10,
                          letterSpacing: "0.12em",
                          textAlign: "right"
                        }}
                      >
                        {rate === 1.0 ? "1.0x" : `${rate}x`}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <button
                type="button"
                onClick={() => setShowSpeedMenu((v) => !v)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  color: showSpeedMenu ? PRIMARY : "rgba(255,255,255,0.55)",
                  cursor: "pointer",
                  padding: 0
                }}
              >
                1080p · {playbackRate === 1.0 ? "1.0x" : `${playbackRate}x`}
              </button>
            </div>
          </div>
        </div>
        </main>
        <StepNav currentStep={3} />
      </RouteTransition>
    </div>
  );
}

export default function WatchPage({ params }: WatchPageProps) {
  return (
    <Suspense fallback={null}>
      <WatchPageContent params={params} />
    </Suspense>
  );
}
