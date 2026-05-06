"use client";

import { useRouter } from "next/navigation";

interface ThemeHeaderProps {
  label: string;
  onExit?: () => void;
}

export function ThemeHeader({ label, onExit }: ThemeHeaderProps) {
  const router = useRouter();

  const handleExit = () => {
    if (onExit) {
      onExit();
      return;
    }
    router.back();
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "48px",
        zIndex: 50,
        background: "rgba(0,0,0,0.7)",
        borderTop: "1px solid rgba(57,255,20,0.5)",
        borderBottom: "1px solid rgba(57,255,20,0.2)",
        backdropFilter: "blur(4px)",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "#39FF14",
            letterSpacing: "0.3em"
          }}
        >
          ● REC
        </span>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>|</span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "rgba(255,255,255,0.7)",
            letterSpacing: "0.08em"
          }}
        >
          {label}
        </span>
      </div>

      <button
        type="button"
        onClick={handleExit}
        style={{
          border: "none",
          background: "transparent",
          padding: 0,
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          color: "rgba(255,255,255,0.5)",
          letterSpacing: "0.08em",
          cursor: "pointer"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#39FF14";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgba(255,255,255,0.5)";
        }}
      >
        ← EXIT
      </button>
    </header>
  );
}
