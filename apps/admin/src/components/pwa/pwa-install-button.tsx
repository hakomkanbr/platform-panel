"use client";

import { useCallback, useEffect, useState } from "react";
import { Modal, Steps } from "antd";
import {
  AppleOutlined,
  ChromeOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  HomeOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import "./pwa-install-button.css";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const INSTALLED_FLAG = "s2s-panel-pwa-installed";

const IOS_STEPS = [
  {
    title: "افتح المتصفح",
    description: "استخدم Safari لفتح لوحة المنصة",
    icon: <ChromeOutlined />,
  },
  {
    title: "اضغط زر المشاركة",
    description: "زر Share الموجود أسفل الشاشة في Safari",
    icon: <ShareAltOutlined />,
  },
  {
    title: "أضف إلى الشاشة الرئيسية",
    description: "اختر «Add to Home Screen» ثم اضغط Add",
    icon: <HomeOutlined />,
  },
];

export default function PwaInstallButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSHelp, setShowIOSHelp] = useState(false);

  /* Register the service worker once (production only) */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const onLoad = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch(() => {});
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  /* Detect installability + listen for the install prompt */
  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone ===
        true;

    if (isStandalone || localStorage.getItem(INSTALLED_FLAG) === "1") {
      setIsInstalled(true);
      return;
    }

    setIsIOS(/iPad|iPhone|iPod/.test(window.navigator.userAgent));

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const onAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      try {
        localStorage.setItem(INSTALLED_FLAG, "1");
      } catch {
        /* ignore storage errors */
      }
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (deferredPrompt) {
      const prompt = deferredPrompt;
      await prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome === "accepted") {
        setIsInstalled(true);
        setDeferredPrompt(null);
        try {
          localStorage.setItem(INSTALLED_FLAG, "1");
        } catch {
          /* ignore storage errors */
        }
      }
      return;
    }
    if (isIOS) {
      setShowIOSHelp(true);
    }
  }, [deferredPrompt, isIOS]);

  if (isInstalled) return null;

  const canShow = Boolean(deferredPrompt) || isIOS;
  if (!canShow) return null;

  return (
    <>
      <button
        type="button"
        className="pwa-install-fab"
        onClick={handleInstall}
        aria-label="تثبيت التطبيق"
      >
        <span className="pwa-install-icon">
          <DownloadOutlined />
        </span>
        <span className="pwa-install-text">
          {isIOS ? "إضافة إلى الشاشة الرئيسية" : "تثبيت التطبيق"}
        </span>
      </button>

      <Modal
        open={showIOSHelp}
        onCancel={() => setShowIOSHelp(false)}
        footer={null}
        centered
        width={420}
        title={
          <div
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            <AppleOutlined style={{ color: "#F27A00", fontSize: 20 }} />
            <span style={{ fontWeight: 700 }}>تثبيت التطبيق على iPhone</span>
          </div>
        }
      >
        <div style={{ marginTop: 12 }}>
          <Steps
            direction="vertical"
            size="small"
            current={-1}
            items={IOS_STEPS}
          />
          <div
            style={{
              marginTop: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 14px",
              borderRadius: 10,
              background: "#FFF7ED",
              border: "1px solid #FED7AA",
              color: "#C2410C",
              fontSize: 13,
            }}
          >
            <CheckCircleFilled style={{ color: "#F27A00" }} />
            <span>بعد الإضافة سيظهر التطبيق كأيقونة على شاشتك الرئيسية.</span>
          </div>
        </div>
      </Modal>
    </>
  );
}