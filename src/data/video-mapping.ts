export type VideoMappingKey =
  | "santi/yes-button-1971/main"
  | "santi/yes-button-1971/branch-high"
  | "santi/yes-button-1971/branch-medium"
  | "santi/yes-button-1971/branch-low"
  | "santi/yes-button-1971/placeholder-loop";

export interface VideoMappingEntry {
  src: string;
  kind: "main" | "branch" | "placeholder";
  durationHintSec?: number;
  description?: string;
}

export const VIDEO_MAPPING: Record<VideoMappingKey, VideoMappingEntry> = {
  "santi/yes-button-1971/main": {
    src: "/videos/santi/yes-main.mp4",
    kind: "main",
    durationHintSec: 2849
  },
  "santi/yes-button-1971/branch-high": {
    src: "/videos/santi/yes-branch-high.mp4",
    kind: "branch"
  },
  "santi/yes-button-1971/branch-medium": {
    src: "/videos/santi/yes-branch-medium.mp4",
    kind: "branch"
  },
  "santi/yes-button-1971/branch-low": {
    src: "/videos/santi/yes-branch-low.mp4",
    kind: "branch"
  },
  "santi/yes-button-1971/placeholder-loop": {
    src: "/videos/placeholders/scanline-loop.mp4",
    kind: "placeholder"
  }
};
