import type { InterventionNode } from "@/lib/types";

export const santiNodes: InterventionNode[] = [
  {
    id: "yes-button-1971",
    dramaId: "santi",
    title: "叶文洁·按下回答键",
    desc: "那是人类历史上最孤独的选择——你只有一次机会，在她按下那个键之前发出警告。",
    location: "红岸基地 · 第25集",
    episodeNumber: 25,
    triggerTimestamp: 725,
    triggerTimecode: "12:05",
    videoMappingKey: "santi/yes-button-1971/main",
    identityId: "listener-1379",
    promptKey: "santi:yes-button-1971",
    branchVideoKeys: {
      high: "santi/yes-button-1971/branch-high",
      medium: "santi/yes-button-1971/branch-medium",
      low: "santi/yes-button-1971/branch-low"
    }
  }
];
