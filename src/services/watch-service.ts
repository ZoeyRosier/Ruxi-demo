import type { InterventionNode } from "@/lib/types";

export type WatchState =
  | "idle"
  | "playing"
  | "near-node"
  | "paused-at-node"
  | "navigating-activate"
  | "resumed-after-decline";

export interface WatchRuntime {
  state: WatchState;
  hasTriggeredNode: boolean;
  pausedAtSec: number | null;
}

export interface WatchTickInput {
  currentTimeSec: number;
  node: Pick<InterventionNode, "triggerTimestamp">;
  runtime: WatchRuntime;
  nearWindowSec?: number;
}

export interface WatchTickOutput {
  nextRuntime: WatchRuntime;
  shouldShowNearHint: boolean;
  shouldPause: boolean;
  shouldTriggerNode: boolean;
}

const DEFAULT_NEAR_WINDOW_SEC = 8;

/**
 * 纯逻辑 tick 计算：根据当前播放时间判断是否需要提示临近节点、暂停并触发节点。
 */
export function evaluateWatchTick(input: WatchTickInput): WatchTickOutput {
  const { currentTimeSec, node, runtime } = input;
  const nearWindowSec = input.nearWindowSec ?? DEFAULT_NEAR_WINDOW_SEC;
  const triggerSec = node.triggerTimestamp;

  if (runtime.hasTriggeredNode) {
    return {
      nextRuntime: runtime,
      shouldShowNearHint: false,
      shouldPause: false,
      shouldTriggerNode: false
    };
  }

  const isNearNode = currentTimeSec >= triggerSec - nearWindowSec && currentTimeSec < triggerSec;
  const shouldTrigger = currentTimeSec >= triggerSec;

  if (shouldTrigger) {
    return {
      nextRuntime: {
        state: "paused-at-node",
        hasTriggeredNode: true,
        pausedAtSec: currentTimeSec
      },
      shouldShowNearHint: false,
      shouldPause: true,
      shouldTriggerNode: true
    };
  }

  if (isNearNode) {
    return {
      nextRuntime: {
        ...runtime,
        state: "near-node"
      },
      shouldShowNearHint: true,
      shouldPause: false,
      shouldTriggerNode: false
    };
  }

  return {
    nextRuntime: {
      ...runtime,
      state: runtime.state === "idle" ? "playing" : runtime.state
    },
    shouldShowNearHint: false,
    shouldPause: false,
    shouldTriggerNode: false
  };
}

/**
 * 纯逻辑事件：用户在 activate 页选择“继续旁观”后，watch 恢复为 resumed-after-decline。
 */
export function resumeAfterDecline(runtime: WatchRuntime, resumeAtSec: number): WatchRuntime {
  return {
    state: "resumed-after-decline",
    hasTriggeredNode: runtime.hasTriggeredNode,
    pausedAtSec: resumeAtSec
  };
}

export function createInitialWatchRuntime(): WatchRuntime {
  return {
    state: "idle",
    hasTriggeredNode: false,
    pausedAtSec: null
  };
}
