import { Modal, Button, Space, Typography, message } from "antd";
import { GlobalOutlined, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useTranslations } from "@repo/localization";
import LanguageForm from "./language-form";
import { languageService } from "./service";
import type { LanguageFormData } from "./types";

interface AddLanguageDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  onSuccess: () => void;
  editData?: { id: string; code: string; name: string; nativeName: string; flag: string; rtl: boolean } | null;
}

export default function AddLanguageDialog({ open, onClose, projectId, onSuccess, editData }: AddLanguageDialogProps) {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LanguageFormData>({
    code: "",
    name: "",
    nativeName: "",
    flag: "🏳️",
    rtl: false,
  });

  const isEdit = !!editData;

  const handleChange = <K extends keyof LanguageFormData>(key: K, value: LanguageFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.code) {
      message.warning(t("settings.languages.selectLanguageWarning"));
      return;
    }
    setLoading(true);
    try {
      if (isEdit && editData) {
        await languageService.update(projectId, editData.id, {
          name: formData.name,
          nativeName: formData.nativeName,
          flag: formData.flag,
          rtl: formData.rtl,
        });
        message.success(t("settings.languages.updatedSuccess"));
      } else {
        await languageService.create(projectId, {
          code: formData.code,
          name: formData.name,
          nativeName: formData.nativeName,
          flag: formData.flag,
          rtl: formData.rtl ? 1 : 0,
        });
        message.success(t("settings.languages.addedSuccess"));
      }
      onSuccess();
      handleClose();
    } catch {
      message.error(isEdit ? t("settings.languages.updateFailed") : t("settings.languages.addFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ code: "", name: "", nativeName: "", flag: "🏳️", rtl: false });
    onClose();
  };

  return (
    <Modal
      title={
        <Space>
          <GlobalOutlined style={{ color: "#F7931E" }} />
          {isEdit ? t("settings.languages.editLanguage") : t("settings.languages.addLanguage")}
        </Space>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      width={480}
      destroyOnClose
    >
      <LanguageForm formData={formData} onChange={handleChange} editMode={isEdit} />

      <Space style={{ width: "100%", justifyContent: "flex-end", marginTop: 24 }}>
        <Button onClick={handleClose} style={{ borderRadius: 6 }}>
          {t("common.actions.cancel")}
        </Button>
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={loading}
          icon={isEdit ? undefined : <PlusOutlined />}
          style={{ borderRadius: 6 }}
        >
          {isEdit ? t("settings.languages.update") : t("settings.languages.addLanguage")}
        </Button>
      </Space>
    </Modal>
  );
}
