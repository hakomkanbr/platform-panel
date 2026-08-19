"use client";

import React from "react";
import {
  FileImageOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileZipOutlined,
  AudioOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import type { CdnFile } from "../types";
import { getMediaKind, getThumbnailUrl } from "../utils/media";

const KIND_ICON: Record<string, React.ReactNode> = {
  image: <FileImageOutlined />,
  video: <PlayCircleOutlined />,
  audio: <AudioOutlined />,
  pdf: <FilePdfOutlined />,
  document: <FileWordOutlined />,
  archive: <FileZipOutlined />,
  other: <FileTextOutlined />,
};

export interface MediaThumbProps {
  file: CdnFile;
  size?: number;
  radius?: number;
  /** Show a type icon instead of attempting a raster/image preview. */
  forceIcon?: boolean;
}

/** Smart thumbnail: image → variant preview, everything else → type icon. */
export const MediaThumb = React.memo(function MediaThumb({
  file,
  size = 64,
  radius = 8,
  forceIcon = false,
}: MediaThumbProps) {
  const kind = getMediaKind(file.mimeType);
  const thumbUrl = !forceIcon && kind === "image" ? getThumbnailUrl(file) : null;

  if (kind !== "image" || forceIcon || !thumbUrl) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          background: "var(--fill-quaternary, #f1f5f9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-tertiary, #94a3b8)",
          fontSize: Math.round(size * 0.42),
        }}
      >
        {KIND_ICON[kind]}
      </div>
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        overflow: "hidden",
        background: "var(--fill-quaternary, #f1f5f9)",
        flexShrink: 0,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumbUrl}
        alt={file.originalName || file.name}
        loading="lazy"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        onError={(e) => {
          const el = e.currentTarget;
          el.style.visibility = "hidden";
          const parent = el.parentElement as HTMLElement | null;
          if (parent) parent.style.display = "none";
        }}
      />
    </div>
  );
});