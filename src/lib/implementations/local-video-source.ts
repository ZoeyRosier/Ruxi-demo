import type { VideoSource } from "@/lib/abstractions";

type VideoKeyToSrcResolver = (videoKey: string) => string;

export class LocalVideoSource implements VideoSource {
  private readonly videoEl: HTMLVideoElement;
  private readonly resolveSrc: VideoKeyToSrcResolver;

  constructor(videoEl: HTMLVideoElement, resolveSrc: VideoKeyToSrcResolver) {
    this.videoEl = videoEl;
    this.resolveSrc = resolveSrc;
  }

  async load(videoKey: string): Promise<void> {
    const src = this.resolveSrc(videoKey);
    this.videoEl.src = src;
    this.videoEl.load();
  }

  async play(): Promise<void> {
    await this.videoEl.play();
  }

  pause(): void {
    this.videoEl.pause();
  }

  seek(seconds: number): void {
    this.videoEl.currentTime = seconds;
  }

  getCurrentTime(): number {
    return this.videoEl.currentTime;
  }

  onTimeUpdate(callback: (seconds: number) => void): () => void {
    const handler = () => callback(this.getCurrentTime());
    this.videoEl.addEventListener("timeupdate", handler);

    return () => {
      this.videoEl.removeEventListener("timeupdate", handler);
    };
  }
}
