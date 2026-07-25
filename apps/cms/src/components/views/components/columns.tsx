"use client";
import api_points from "@/api/points";
import DtDelete from "@/components/elements/table/actions_container";
import DtActionContainer from "@/components/elements/table/actions_delete";
import DtEdit from "@/components/elements/table/actions_edit";
import route_paths from "@/helper/route_paths";
import { Badge, TableProps, Tag, Tooltip, Button, Space } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import Link from "next/link";
import { deleteComponent } from "@/api/repostories/components";

const columns: TableProps["columns"] = [
  {
    title: "Name",
    dataIndex: "name",
    render(value: any, record: any) {
      return (
        <Space>
          <span style={{ fontWeight: 500 }}>{value || record.Name}</span>
        </Space>
      );
    },
  },
  {
    title: "Display Name",
    dataIndex: "displayName",
    render(value: any, record: any) {
      return value || record.DisplayName || "-";
    },
  },
  {
    title: "Category",
    dataIndex: "category",
    render(value: any, record: any) {
      const cat = value || record.Category || "block";
      const colors: Record<string, string> = {
        block: "blue",
        section: "purple",
        layout: "geekblue",
        feature: "cyan",
      };
      return (
        <Tag color={colors[cat] || "default"} style={{ textTransform: "capitalize" }}>
          {cat}
        </Tag>
      );
    },
  },
  {
    title: "Repeatable",
    dataIndex: "isRepeatable",
    align: "center",
    render(value: any, record: any) {
      const val = value ?? record.IsRepeatable ?? true;
      return val ? (
        <Badge status="success" text="Yes" />
      ) : (
        <Badge status="default" text="No" />
      );
    },
  },
  {
    title: "Version",
    dataIndex: "version",
    width: 80,
    render(value: any, record: any) {
      return <Tag>{value || record.Version || "v1"}</Tag>;
    },
  },
  {
    title: "Fields",
    dataIndex: "fields",
    align: "center",
    render(value: any, record: any) {
      const fields = value || record.Fields || [];
      return <Badge count={fields.length} showZero />;
    },
  },
  {
    title: "Actions",
    width: 180,
    dataIndex: "id",
    align: "right",
    render(value: any, record: any) {
      const id = value || record.Id;
      return (
        <Space size={4}>
          <Tooltip title="Manage Fields">
            <Link href={`${route_paths.components}/detail/${id}`}>
              <Button type="text" icon={<EyeOutlined />} size="small" />
            </Link>
          </Tooltip>
          <DtActionContainer>
            <DtDelete url={`${api_points.component.delete}/${id}`} data={record} customDelete={() => deleteComponent(id)} />
            <DtEdit data={record} url={`${route_paths.components}/edit`} />
          </DtActionContainer>
        </Space>
      );
    },
  },
];

export default columns;
