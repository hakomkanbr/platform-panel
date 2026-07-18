import ILanguage from "@/abstracts/language";
import { GlobalOutlined } from "@ant-design/icons";
import { Tag } from "antd";

const DtLanguage: React.FC<{ value: string }> = ({ value }) => {
    if (!value) return "";
    return <Tag
        icon={<GlobalOutlined />}
        style={{
            borderRadius: 12,
            padding: "2px 12px",
            background: "#eff6ff",
            color: "#2563eb",
            border: "1px solid #bfdbfe"
        }}
    >
        {value?.toUpperCase() || 'EN'}
    </Tag>
};

export default DtLanguage;