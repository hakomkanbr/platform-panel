import ILanguage from "@/abstracts/language";
import DtLanguage from "./action_language";
import { TableColumnProps, TableProps } from "antd";

export const columnLanguage: TableColumnProps = {
    title: "Language",
    dataIndex: "language",
    align: "right",
    width: 50,
    render(language: ILanguage) {
        return <DtLanguage value={language?.slug} />;
    },
};

export const columnCreatedDate: TableColumnProps = {
    title: "Created",
    dataIndex: "createdAt",
    align: "right",
    width: 75,
    render(value: string) {
        if (!value) return '-';
        const date = new Date(value);
        return (
            <div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                    {date.toLocaleDateString()}
                </div>
                <div style={{ fontSize: '11px', color: '#999' }}>
                    {date.toLocaleTimeString()}
                </div>
            </div>
        );
    },
};

export const columnUpdatedDate: TableColumnProps = {
    title: "Updated",
    dataIndex: "updatedAt",
    align: "right",
    width: 75,
    render(value: string) {
        if (!value) return '-';
        const date = new Date(value);
        return (
            <div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                    {date.toLocaleDateString()}
                </div>
                <div style={{ fontSize: '11px', color: '#999' }}>
                    {date.toLocaleTimeString()}
                </div>
            </div>
        );
    },
};