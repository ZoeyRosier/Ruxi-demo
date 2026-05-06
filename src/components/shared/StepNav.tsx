"use client";

import { useRouter } from "next/navigation";

interface StepNavProps {
  currentStep: number;
}

const STEP_ITEMS = [
  { step: 1, label: "01-首页", route: "/" },
  { step: 2, label: "02-详情", route: "/drama/santi" },
  { step: 3, label: "03-观看", route: "/watch/santi/yes-button-1971" },
  { step: 4, label: "04-唤起", route: "/activate/santi/yes-button-1971" },
  { step: 5, label: "05-撰写", route: "/compose/santi/yes-button-1971" },
  { step: 6, label: "06-评分", route: "/judge/santi/yes-button-1971" },
  { step: 7, label: "07-分支", route: "/branch/santi/yes-button-1971" },
  { step: 8, label: "08-档案", route: "/archive" }
];

function getActiveColor(step: number): string {
  return step <= 2 || step === 8 ? "#8B7FB8" : "#39FF14";
}

export function StepNav({ currentStep }: StepNavProps) {
  const router = useRouter();
  const activeColor = getActiveColor(currentStep);

  return (
    <nav
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        height: "40px",
        zIndex: 50,
        background: "rgba(0,0,0,0.7)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0
      }}
    >
      {STEP_ITEMS.map((item) => {
        const isActive = item.step === currentStep;
        return (
          <button
            key={item.step}
            type="button"
            onClick={() => router.push(item.route)}
            style={{
              padding: "0 18px",
              height: "100%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              letterSpacing: "0.1em",
              color: isActive ? activeColor : "rgba(255,255,255,0.3)",
              background: isActive ? "rgba(255,255,255,0.04)" : "transparent",
              border: "none",
              borderTop: isActive ? `2px solid ${activeColor}` : "2px solid transparent",
              cursor: "pointer"
            }}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
