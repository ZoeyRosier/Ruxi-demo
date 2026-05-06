"use client";

import { useRouter } from "next/navigation";

export function BrandHeader() {
  const router = useRouter();

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "56px",
        zIndex: 50,
        background: "rgba(10,10,15,0.85)",
        borderBottom: "1px solid rgba(232,232,232,0.06)",
        backdropFilter: "blur(8px)",
        padding: "0 48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span
          style={{
            width: "6px",
            height: "6px",
            background: "#8B7FB8",
            borderRadius: "50%",
            boxShadow: "0 0 12px #8B7FB8",
            animation: "pulseDot 2.4s ease-in-out infinite"
          }}
        />
        <span
          style={{
            fontFamily: '"Noto Serif SC", serif',
            fontWeight: 900,
            fontSize: "20px",
            letterSpacing: "0.2em",
            background: "linear-gradient(135deg, #E8E8E8 0%, #8B7FB8 100%)",
            WebkitBackgroundClip: "text",
            color: "transparent"
          }}
        >
          入 戏
        </span>
      </div>

      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: "32px",
          fontSize: "13px",
          color: "rgba(232,232,232,0.6)"
        }}
      >
        <button
          type="button"
          onClick={() => router.push("/")}
          style={{
            background: "transparent",
            border: "none",
            padding: 0,
            fontSize: "13px",
            color: "rgba(232,232,232,0.6)",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#E8E8E8";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(232,232,232,0.6)";
          }}
        >
          剧目
        </button>
        <button
          type="button"
          onClick={() => router.push("/archive")}
          style={{
            background: "transparent",
            border: "none",
            padding: 0,
            fontSize: "13px",
            color: "rgba(232,232,232,0.6)",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#E8E8E8";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(232,232,232,0.6)";
          }}
        >
          我的印记
        </button>
      </nav>
    </header>
  );
}
