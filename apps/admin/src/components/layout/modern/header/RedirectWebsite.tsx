"use client";
import React, { useEffect, useState } from "react";
import { Button, Tooltip, Modal, Typography, Space, Avatar, Tag } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux-toolkit/store";
import { RiExternalLinkFill } from "react-icons/ri";
import { getCookie } from "@/app/actions/set-cookie";

const { Text } = Typography;

const RedirectWebsite: React.FC = () => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [link, setLink] = useState<string | null>(null);

  const sites = useSelector((state: RootState) => state.site);

  // ✅ تحميل الرابط من الكوكي
  useEffect(() => {
    const loadLink = async () => {
      const value = await getCookie("link");
      setLink(value ?? null);
    };
    loadLink();
  }, []);

  // ⚠️ قد يكون undefined
  const currentSite = sites.list.find(
    (site) => site.slug === sites.slug
  );

  // ✅ اشتقاق URL آمن مرة واحدة
  const resolvedUrl =
    currentSite?.link ??
    (currentSite
      ? `${window.location.origin}/${currentSite.slug}`
      : link);

  // ✅ اسم آمن
  const siteName = currentSite?.name ?? "Website";

  const handleVisitWebsite = () => {
    if (!resolvedUrl) return;
    window.open(resolvedUrl, "_blank");
  };

  // ❌ لا يوجد موقع لا من Redux ولا من Cookie
  if (!resolvedUrl) {
    return (
      <Tooltip title="Select a website first">
        <Button
          type="text"
          icon={<GlobalOutlined />}
          disabled
          className="action-button"
        />
      </Tooltip>
    );
  }

  return (
    <>
      <Tooltip title={`Visit ${siteName}`}>
        <Button
          type="text"
          icon={<GlobalOutlined />}
          onClick={handleVisitWebsite}
          className="action-button"
        />
      </Tooltip>

      {/* Preview Modal */}
      <Modal
        title={
          <div className="preview-modal-header">
            <Avatar size={24} icon={<GlobalOutlined />} />
            <span style={{ marginLeft: 8 }}>
              Website Preview – {siteName}
            </span>

            {currentSite && (
              <Tag
                color={currentSite.published ? "success" : "warning"}
                style={{ marginLeft: 8 }}
              >
                {currentSite.published ? "Live" : "Draft"}
              </Tag>
            )}
          </div>
        }
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        width="90%"
        style={{ top: 20 }}
        footer={[
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            Close Preview
          </Button>,
          <Button
            key="visit"
            type="primary"
            icon={<RiExternalLinkFill />}
            onClick={handleVisitWebsite}
          >
            Open in New Tab
          </Button>,
        ]}
      >
        <div className="website-preview">
          <div className="preview-toolbar">
            <Space>
              <Text type="secondary">URL:</Text>
              <Text code>{resolvedUrl}</Text>
              <Button
                size="small"
                icon={<RiExternalLinkFill />}
                onClick={handleVisitWebsite}
              >
                Open
              </Button>
            </Space>
          </div>

          <div className="preview-frame">
            <iframe
              src={resolvedUrl}
              style={{
                width: "100%",
                height: "70vh",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
              }}
              title={`Preview of ${siteName}`}
            />
          </div>
        </div>
      </Modal>

      <style jsx>{`
        .preview-modal-header {
          display: flex;
          align-items: center;
        }

        .website-preview {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .preview-toolbar {
          padding: 12px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .preview-frame {
          background: #f8fafc;
          border-radius: 8px;
          padding: 8px;
        }

        :global(.action-button) {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        :global(.action-button:hover) {
          background: #f1f5f9;
          color: #F7931E;
        }

        :global(.action-button:disabled) {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
};

export default RedirectWebsite;
