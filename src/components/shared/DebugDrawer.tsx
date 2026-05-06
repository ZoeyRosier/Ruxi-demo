// 此文件属于品牌层（共享调试组件，仅开发环境可见）
"use client";

import { useState } from "react";

import type { KnowledgeSourceCheck } from "@/lib/types";

interface DebugDrawerProps {
  knowledgeSourceCheck?: KnowledgeSourceCheck;
  isFallback?: boolean;
  extra?: Record<string, unknown>;
}

export function DebugDrawer({
  knowledgeSourceCheck,
  isFallback,
  extra
}: DebugDrawerProps) {
  // 生产环境直接不渲染（在 hooks 之前判断会破坏 hooks 顺序，故先 hooks 再 return）
  const [open, setOpen] = useState(false);

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const hasExtra = extra && Object.keys(extra).length > 0;

  return (
    <div
      style={{
        position: "fixed",
        right: "16px",
        bottom: "56px",
        zIndex: 50,
        fontFamily: "monospace",
        fontSize: "11px",
        color: "#cfd2d6",
        background: "rgba(10,10,15,0.85)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "6px",
        padding: open ? "10px 12px" : "6px 10px",
        maxWidth: open ? "320px" : "auto",
        backdropFilter: "blur(4px)"
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          background: "transparent",
          border: "none",
          color: "inherit",
          cursor: "pointer",
          fontFamily: "inherit",
          fontSize: "11px",
          letterSpacing: "0.15em",
          padding: 0
        }}
      >
        [DEBUG] {open ? "▾" : "▸"}
      </button>

      {open && (
        <div style={{ marginTop: "8px", lineHeight: 1.7 }}>
          <div>
            knowledgeSourceCheck:{" "}
            {knowledgeSourceCheck
              ? `aired=${knowledgeSourceCheck.usedAiredContent} dossier=${knowledgeSourceCheck.usedCharacterDossier} spoiler=${knowledgeSourceCheck.spoilerDetected}`
              : "—"}
          </div>
          <div>isFallback: {String(Boolean(isFallback))}</div>
          {hasExtra && (
            <pre
              style={{
                margin: "8px 0 0 0",
                padding: "6px 8px",
                background: "rgba(0,0,0,0.4)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "4px",
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
                fontSize: "10px"
              }}
            >
              {JSON.stringify(extra, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
