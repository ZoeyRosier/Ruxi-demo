// 此文件属于主题层
import { useEffect, useRef, useState } from "react";

interface WatchTimelineProps {
  currentTimeSec: number;
  triggerTimestamp: number;
  totalDurationSec: number;
  isNearNode: boolean;
  onSeek?: (sec: number) => void;
}

const TRACK = "rgba(255,255,255,0.12)";
const PROGRESS = "#39FF14";

export function WatchTimeline({
  currentTimeSec,
  triggerTimestamp,
  totalDurationSec,
  isNearNode,
  onSeek
}: WatchTimelineProps) {
  const [hoverRatio, setHoverRatio] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const clampedDuration = Math.max(totalDurationSec, 1);
  const progressRatio = Math.min(Math.max(currentTimeSec / clampedDuration, 0), 1);
  const markerRatio = Math.min(Math.max(triggerTimestamp / clampedDuration, 0), 1);

  const pad2 = (n: number) => n.toString().padStart(2, "0");
  const fmt = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${pad2(m)} : ${pad2(s)}`;
  };

  const getSecFromClientX = (clientX: number): number => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return ratio * clampedDuration;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      onSeek?.(ratio * clampedDuration);
    };
    const handleMouseUp = () => {
      isDragging.current = false;
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [onSeek, clampedDuration]);

  return (
    <div style={{ width: "100%" }}>
      <div
        ref={trackRef}
        style={{
          position: "relative",
          height: 4,
          background: TRACK,
          marginBottom: 14,
          cursor: "col-resize"
        }}
        onMouseDown={(e) => {
          isDragging.current = true;
          onSeek?.(getSecFromClientX(e.clientX));
        }}
        onClick={(e) => {
          if (!isDragging.current) onSeek?.(getSecFromClientX(e.clientX));
        }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const ratio = (e.clientX - rect.left) / rect.width;
          setHoverRatio(Math.min(1, Math.max(0, ratio)));
        }}
        onMouseLeave={() => setHoverRatio(null)}
      >
        {hoverRatio !== null && (
          <div
            style={{
              position: "absolute",
              left: `${hoverRatio * 100}%`,
              bottom: 12,
              transform: "translateX(-50%)",
              padding: "2px 6px",
              border: "1px solid rgba(255,255,255,0.25)",
              background: "rgba(10,12,18,0.9)",
              borderRadius: 4,
              color: "rgba(255,255,255,0.85)",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.05em",
              whiteSpace: "nowrap",
              pointerEvents: "none"
            }}
          >
            {fmt(hoverRatio * clampedDuration)}
          </div>
        )}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${progressRatio * 100}%`,
            background: PROGRESS,
            boxShadow: `0 0 8px ${PROGRESS}`
          }}
        />

        <div
          style={{
            position: "absolute",
            left: `${markerRatio * 100}%`,
            top: "50%",
            width: 10,
            height: 10,
            background: isNearNode ? "#FFB347" : "transparent",
            border: "1px solid #FFB347",
            transform: "translate(-50%, -50%) rotate(45deg)",
            transition: "all 200ms ease"
          }}
          aria-label="node-marker"
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          color: "rgba(255,255,255,0.6)",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          letterSpacing: "0.15em"
        }}
      >
        <span>{fmt(currentTimeSec)}</span>
        <span style={{ color: PROGRESS }}>● 节点 · {triggerTimestamp}s</span>
        <span>{fmt(totalDurationSec)}</span>
      </div>
    </div>
  );
}
