import type { DramaMeta } from "@/lib/types";

export const santiDramaMeta: DramaMeta = {
  id: "santi",
  name: "《三体》",
  title: "《三体》",
  description:
    "1971 年红岸基地，叶文洁正面对一封来自三体世界的警告。她将做出改变人类命运的决定——而你，可能是最后一道劝阻的声音。",
  containerName: "三体游戏·拓展协议",
  themeId: "santi",
  status: "active"
};

/** 大写别名，便于 UI 层语义化引用 */
export const SANTI_DRAMA_META = santiDramaMeta;
