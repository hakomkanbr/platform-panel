"use client";

import React, { useMemo, useState } from "react";
import {
  Modal, Button, Space, Typography, Tag, Tabs, Select, Input,
  message, Card, List, Divider,
} from "antd";
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  LeftOutlined,
  RightOutlined,
  DownloadOutlined,
  FileTextOutlined,
  CopyOutlined,
  LinkOutlined,
  LockOutlined,
  UnlockOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useTranslations } from "@repo/localization";
import type { CdnFile, CdnVisibility } from "../types";
import { getMediaKind, formatBytes, formatDate, getThumbnailUrl } from "../utils/media";
import {
  useMediaSignedUrl,
  useMediaVariantSignedUrls,
} from "../hooks/useMediaData";
import { useUpdateVisibility } from "../hooks/useMediaMutations";

const { Text } = Typography;

export interface MediaPreviewProps {
  file: CdnFile | null;
  files?: CdnFile[];
  onClose: () => void;
  onNavigate?: (file: CdnFile) => void;
}

function resolvePreviewUrl(file: CdnFile, signedUrl?: string | null): string | null {
  if (signedUrl) return signedUrl;
  return file.url ?? null;
}

/** Full media preview with zoom, navigation, metadata, and Access Control. */
export const MediaPreview: React.FC<MediaPreviewProps> = ({
  file,
  files,
  onClose,
  onNavigate,
}) => {
  const t = useTranslations();
  const [zoom, setZoom] = useState(1);
  const [expiresIn, setExpiresIn] = useState(3600);

  const signed = useMediaSignedUrl(
    file?.id ?? null,
    expiresIn,
    !!file,
  );

  const variantUrls = useMediaVariantSignedUrls(
    file?.id ?? null,
    expiresIn,
    !!file,
  );

  const updateVisibility = useUpdateVisibility();

  const kind = file ? getMediaKind(file.mimeType) : "other";
  const previewUrl = file ? resolvePreviewUrl(file, signed.data?.url) : null;

  const index = file && files ? files.findIndex((f) => f.id === file.id) : -1;
  const canPrev = file && files ? index > 0 : false;
  const canNext = file && files ? index >= 0 && index < files!.length - 1 : false;

  const navigate = (delta: number) => {
    if (!files || !file) return;
    const nextIndex = index + delta;
    const target = files[nextIndex];
    if (target) {
      setZoom(1);
      onNavigate?.(target);
    }
  };

  const copyToClipboard = (text?: string | null) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    message.success(t("media.urlCopied") || "URL copied to clipboard");
  };

  const handleVisibilityChange = async (visibility: CdnVisibility) => {
    if (!file) return;
    try {
      await updateVisibility.mutateAsync({ id: file.id, visibility });
      message.success(t("media.toasts.visibilityUpdated") || "Visibility updated");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to update visibility");
    }
  };

  const metadata = useMemo(() => {
    if (!file) return [];
    const rows: [string, string][] = [
      [t("media.preview.name") || "Name", file.originalName || file.name],
      [t("media.preview.type") || "Type", file.mimeType],
      [t("media.preview.size") || "Size", formatBytes(file.size)],
      [t("media.preview.visibility") || "Visibility", file.visibility],
      [t("media.preview.uploaded") || "Uploaded", formatDate(file.createdAt)],
    ];
    if (file.width) rows.push([t("media.preview.dimensions") || "Dimensions", `${file.width} × ${file.height}`]);
    return rows;
  }, [file, t]);

  const renderBody = () => {
    if (!file) return null;

    if (kind === "image" && previewUrl) {
      const url = signed.data?.url ?? getThumbnailUrl(file) ?? previewUrl;
      return (
        <div style={{ position: "relative", textAlign: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={file.originalName || file.name}
            style={{
              maxWidth: "100%",
              maxHeight: "50vh",
              transform: `scale(${zoom})`,
              transition: "transform .2s ease",
              transformOrigin: "center top",
              borderRadius: 8,
            }}
          />
          <Space style={{ position: "absolute", top: 8, right: 8 }}>
            <Button size="small" icon={<ZoomInOutlined />} onClick={() => setZoom((z) => Math.min(3, z + 0.25))} />
            <Button size="small" icon={<ZoomOutOutlined />} onClick={() => setZoom((z) => Math.max(0.25, z - 0.25))} />
          </Space>
        </div>
      );
    }

    if (kind === "video" && previewUrl) {
      return (
        <video
          src={previewUrl}
          controls
          style={{ maxWidth: "100%", maxHeight: "50vh", borderRadius: 8, background: "#000" }}
        />
      );
    }

    if (kind === "audio" && previewUrl) {
      return (
        <audio src={previewUrl} controls style={{ width: "100%" }} />
      );
    }

    if (kind === "pdf" && previewUrl) {
      return (
        <iframe
          src={previewUrl}
          title={file.originalName}
          style={{ width: "100%", height: "55vh", border: "none", borderRadius: 8 }}
        />
      );
    }

    return (
      <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-secondary)" }}>
        <FileTextOutlined style={{ fontSize: 64, marginBottom: 12 }} />
        <div>{t("media.preview.noPreview") || "No preview"}</div>
        {previewUrl && (
          <a href={previewUrl} target="_blank" rel="noreferrer" download>
            <Button icon={<DownloadOutlined />} style={{ marginTop: 12 }}>
              {t("media.actions.download") || "Download"}
            </Button>
          </a>
        )}
      </div>
    );
  };

  return (
    <Modal
      open={!!file}
      onCancel={() => {
        setZoom(1);
        onClose();
      }}
      footer={null}
      width={800}
      title={
        <Space>
          <Text strong>{file?.originalName ?? file?.name}</Text>
          {file && <Tag color="blue">{kind}</Tag>}
          {file?.visibility === "PUBLIC" ? (
            <Tag icon={<UnlockOutlined />} color="green">PUBLIC</Tag>
          ) : (
            <Tag icon={<LockOutlined />} color="orange">{file?.visibility}</Tag>
          )}
        </Space>
      }
    >
      {file && (
        <Tabs
          defaultActiveKey="preview"
          items={[
            {
              key: "preview",
              label: t("media.actions.preview") || "Preview & Info",
              children: (
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 8 }}>
                  <div style={{ flex: "1 1 58%" }}>{renderBody()}</div>
                  <div
                    style={{
                      flex: "1 1 38%",
                      minWidth: 200,
                      background: "var(--fill-secondary, #fafafa)",
                      borderRadius: 10,
                      padding: 14,
                    }}
                  >
                    {metadata.map(([label, value]) => (
                      <div key={label} style={{ marginBottom: 8 }}>
                        <Text type="secondary" style={{ fontSize: 12, display: "block" }}>
                          {label}
                        </Text>
                        <Text style={{ fontSize: 13, wordBreak: "break-all" }}>{value}</Text>
                      </div>
                    ))}
                    {file.url && (
                      <div style={{ marginTop: 12 }}>
                        <Button
                          size="small"
                          icon={<CopyOutlined />}
                          onClick={() => copyToClipboard(file.url)}
                          block
                        >
                          {t("media.copyUrl") || "Copy Full URL"}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ),
            },
            {
              key: "access",
              label: t("media.accessControl") || "Access & Signed URLs",
              children: (
                <div style={{ padding: "8px 0" }}>
                  {/* Visibility Setting */}
                  <Card size="small" style={{ marginBottom: 16, borderRadius: 8 }}>
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <Text strong>{t("media.preview.visibility") || "File Visibility"}</Text>
                      <Select
                        value={file.visibility}
                        onChange={handleVisibilityChange}
                        style={{ width: "100%" }}
                        loading={updateVisibility.isPending}
                        options={[
                          { value: "PUBLIC", label: "🟢 PUBLIC (Accessible to anyone directly)" },
                          { value: "PRIVATE", label: "🔒 PRIVATE (Requires Signed URL or API Key)" },
                          { value: "RESTRICTED", label: "🛡️ RESTRICTED (Admin / Scoped Access)" },
                        ]}
                      />
                    </Space>
                  </Card>

                  {/* Temporary Signed URL */}
                  <Card size="small" style={{ marginBottom: 16, borderRadius: 8 }}>
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Text strong>{t("media.signedUrl") || "Temporary Signed URL"}</Text>
                        <Select
                          size="small"
                          value={expiresIn}
                          onChange={setExpiresIn}
                          style={{ width: 130 }}
                          options={[
                            { value: 3600, label: t("media.expiry1h") || "1 Hour" },
                            { value: 21600, label: "6 Hours" },
                            { value: 86400, label: t("media.expiry24h") || "24 Hours" },
                            { value: 604800, label: t("media.expiry7d") || "7 Days" },
                          ]}
                        />
                      </div>
                      <Input
                        value={signed.data?.url || file.url || ""}
                        readOnly
                        addonAfter={
                          <Button
                            type="text"
                            size="small"
                            icon={<CopyOutlined />}
                            onClick={() => copyToClipboard(signed.data?.url || file.url)}
                          />
                        }
                      />
                      {signed.data?.expiresAt && (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Expires: {new Date(signed.data.expiresAt).toLocaleString()}
                        </Text>
                      )}
                    </Space>
                  </Card>

                  {/* Image Variants Signed URLs */}
                  {variantUrls.data?.urls && Object.keys(variantUrls.data.urls).length > 0 && (
                    <Card size="small" style={{ borderRadius: 8 }}>
                      <Text strong style={{ display: "block", marginBottom: 8 }}>
                        {t("media.variants") || "Image Variants Signed URLs"}
                      </Text>
                      <List
                        size="small"
                        dataSource={Object.entries(variantUrls.data.urls)}
                        renderItem={([name, url]) => (
                          <List.Item
                            actions={[
                              <Button
                                key="copy"
                                size="small"
                                icon={<CopyOutlined />}
                                onClick={() => copyToClipboard(url)}
                              >
                                {t("media.copyUrl") || "Copy"}
                              </Button>,
                              <Button
                                key="open"
                                size="small"
                                icon={<LinkOutlined />}
                                href={url}
                                target="_blank"
                              />,
                            ]}
                          >
                            <List.Item.Meta
                              title={<Tag color="blue">{name.toUpperCase()}</Tag>}
                              description={
                                <Text ellipsis style={{ maxWidth: 380, fontSize: 12 }}>
                                  {url}
                                </Text>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    </Card>
                  )}
                </div>
              ),
            },
          ]}
        />
      )}

      {(canPrev || canNext) && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
          <Button
            icon={<LeftOutlined />}
            disabled={!canPrev}
            onClick={() => navigate(-1)}
          >
            {t("media.preview.prev") || "Previous"}
          </Button>
          <Button icon={<RightOutlined />} disabled={!canNext} onClick={() => navigate(1)}>
            {t("media.preview.next") || "Next"}
          </Button>
        </div>
      )}
    </Modal>
  );
};