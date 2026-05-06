import type { DramaIdentity } from "@/lib/types";

export const santiIdentities: DramaIdentity[] = [
  {
    id: "listener-1379",
    dramaId: "santi",
    name: "监听员1379",
    codeName: "L-1379",
    faction: "三体觉醒派",
    description:
      "三体文明中的觉醒监听员，拥有一次跨文明警告机会。你将向地球的叶文洁发出最后一封劝阻信。",
    isAvailable: true
  },
  {
    id: "eto-infiltrator",
    dramaId: "santi",
    name: "ETO渗透者",
    codeName: "E-077",
    faction: "地球三体组织",
    description:
      "潜伏于地球科研系统的观察者视角，掌握部分组织内部信息。后续版本开放。",
    isAvailable: false,
    comingSoonLabel: "敬请期待"
  },
  {
    id: "red-coast-technician",
    dramaId: "santi",
    name: "红岸基地技术员",
    codeName: "R-203",
    faction: "红岸基地",
    description:
      "站在设备与信号链路一线的基层角色，能见证发射台前最后的迟疑。后续版本开放。",
    isAvailable: false,
    comingSoonLabel: "敬请期待"
  }
];

/** 大写别名，便于 UI 层语义化引用 */
export const SANTI_IDENTITIES = santiIdentities;
