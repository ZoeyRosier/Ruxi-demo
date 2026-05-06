import type { AiredEventsManifest } from "@/lib/types";

export const airedEventsBeforeYes: AiredEventsManifest = {
  dramaId: "santi",
  nodeId: "yes-button-1971",
  upToEpisode: 6,
  upToTimestamp: 120,
  events: [
    {
      id: "ep02-father-incident",
      episode: 2,
      timecode: "15:30",
      description: "叶文洁童年阶段经历关键家庭创伤事件（剧中已呈现）。"
    },
    {
      id: "ep03-inner-mongolia-relocation",
      episode: 3,
      timecode: "23:10",
      description: "叶文洁被下放并在高压环境中长期劳动，价值观进一步转变（剧中已呈现）。"
    },
    {
      id: "ep05-red-coast-entry",
      episode: 5,
      timecode: "31:40",
      description: "叶文洁进入红岸体系并接触对外信号任务核心链路（剧中已呈现）。"
    },
    {
      id: "ep06-warning-signal-received",
      episode: 6,
      timecode: "01:50",
      description: "关键警告信息已出现，YES按钮决策窗口临近（剧中已呈现）。"
    }
  ]
};
