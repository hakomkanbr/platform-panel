"use client";
import api_points from "@/api/points";
import DtDelete from "@/components/elements/table/actions_container";
import DtActionContainer from "@/components/elements/table/actions_delete";
import { Badge, TableProps, Tag, Space } from "antd";

const columns: TableProps["columns"] = [
  {
    title: "Name",
    dataIndex: "name",
    render(value: any, record: any) {
      return (
        <Space>
          <Badge color="#6366f1" />
          <span style={{ fontWeight: 500 }}>{value || record.Name}</span>
        </Space>
      );
    },
  },
  {
    title: "Slug",
    dataIndex: "slug",
    render(value: any, record: any) {
      const slug = value || record.Slug;
      return slug ? (
        <Tag style={{ fontFamily: "monospace", fontSize: 12, background: "#f3f4f6" }}>
          {slug}
        </Tag>
      ) : (
        <Tag style={{ fontFamily: "monospace", fontSize: 12 }}>-</Tag>
      );
    },
  },
  {
    title: "Actions",
    width: 90,
    dataIndex: "id",
    align: "right",
    render(value: any, record: any) {
      return (
        <DtActionContainer>
          <DtDelete url={`${api_points.tag.delete}/${value || record.Id}`} data={record} />
        </DtActionContainer>
      );
    },
  },
];

export default columns;
