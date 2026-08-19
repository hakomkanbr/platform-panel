import type { CdnFile } from "../types";

export type MediaKind =
  | "image"
  | "video"
  | "audio"
  | "pdf"
  | "document"
  | "archive"
  | "other";

const IMAGE_MIME = /^image\//;
const VIDEO_MIME = /^video\//;
const AUDIO_MIME = /^audio\//;
const PDF_MIME = /^application\/pdf$/;
const ZIP_MIME = /(zip|compressed|rar|7z|tar|gzip)/;

/** Maps a file's mime type to a coarse, UI-friendly category. */
export function getMediaKind(mimeType: string): MediaKind {
  if (!mimeType) return "other";
  if (IMAGE_MIME.test(mimeType)) return "image";
  if (VIDEO_MIME.test(mimeType)) return "video";
  if (AUDIO_MIME.test(mimeType)) return "audio";
  if (PDF_MIME.test(mimeType)) return "pdf";
  if (ZIP_MIME.test(mimeType)) return "archive";
  if (mimeType.startsWith("text/") || mimeType.includes("document") || mimeType.includes("sheet")) {
    return "document";
  }
  return "other";
}

export function isImageFile(file: Pick<CdnFile, "mimeType">): boolean {
  return IMAGE_MIME.test(file.mimeType);
}

/** Prefers a generated thumbnail variant, falling back to the raw URL. */
export function getThumbnailUrl(file: Pick<CdnFile, "url" | "variants">): string | null {
  const thumb =
    file.variants?.find((v) => v.name === "thumb") ??
    file.variants?.find((v) => v.name === "sm");
  return thumb?.url ?? file.url ?? null;
}

export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, index);
  return `${value >= 100 || index === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[index]}`;
}

export function formatDate(date: string): string {
  try {
    return new Date(date).toLocaleString();
  } catch {
    return date;
  }
}