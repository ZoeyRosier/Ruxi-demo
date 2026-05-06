// 此文件属于主题层（转场组件，仅用于 activate 页面）
"use client";

import { useEffect, useRef } from "react";

export type AnimPhase = "glitch" | "badge" | "name" | "task" | "cta";

interface ActivateTransitionProps {
  onPhaseChange: (phase: AnimPhase) => void;
}

/**
 * 入场动画时序控制器。
 * 使用 useRef hasStarted 护栏保证动画只触发一次，防止严格模式双调用或状态更新引发循环。
 * 所有 setTimeout 在 cleanup 中清理，GSAP 仅在此组件内使用。
 * 动画本身由调用方通过 phase 驱动 CSS（非此组件直接操控 DOM 样式）。
 */
export function ActivateTransition({ onPhaseChange }: ActivateTransitionProps) {
  const hasStarted = useRef(false);

  useEffect(() => {
    // 护栏：严格模式下 effect 会被调用两次，hasStarted 确保动画只启动一次
    if (hasStarted.current) return;
    hasStarted.current = true;

    const t1 = window.setTimeout(() => onPhaseChange("badge"), 800);
    const t2 = window.setTimeout(() => onPhaseChange("name"), 1600);
    const t3 = window.setTimeout(() => onPhaseChange("task"), 3000);
    const t4 = window.setTimeout(() => onPhaseChange("cta"), 5000);

    return () => {
      hasStarted.current = false; // 允许 Strict Mode 第二次 mount 正常启动
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, []); // 空依赖：仅在挂载时执行一次

  return null; // 纯逻辑组件，不渲染任何 DOM 节点
}
