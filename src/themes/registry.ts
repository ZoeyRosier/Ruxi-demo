export const REGISTERED_THEME_IDS = [
  "brand",
  "santi",
  "long-xiang-si",
  "qing-yu-nian",
  "fanhua"
] as const;

export type RegisteredThemeId = (typeof REGISTERED_THEME_IDS)[number];
