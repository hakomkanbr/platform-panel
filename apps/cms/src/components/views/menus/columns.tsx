"use client";
import api_points from "@/api/points";
import DtDelete from "@/components/elements/table/actions_container";
import DtActionContainer from "@/components/elements/table/actions_delete";
import DtEdit from "@/components/elements/table/actions_edit";
import route_paths from "@/helper/route_paths";
import { Badge, TableProps, Tag, Tooltip, Button, Space } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import Link from "next/link";
import { deleteMenu } from "@/api/repostories/menus";

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
    title: "Slug",
    dataIndex: "slug",
    render(value: any, record: any) {
      const slug = value || record.Slug;
      return slug ? (
        <Tag style={{ fontFamily: "monospace", fontSize: 12 }}>{slug}</Tag>
      ) : null;
    },
  },
  {
    title: "Location",
    dataIndex: "location",
    render(value: any, record: any) {
      const loc = value || record.Location;
      const colors: Record<string, string> = {
        header: "blue",
        footer: "green",
        sidebar: "purple",
        main: "orange",
      };
      return <Tag color={colors[loc] || "default"}>{loc}</Tag>;
    },
  },
  {
    title: "Items",
    dataIndex: "items",
    align: "center",
    render(value: any, record: any) {
      const items = value || record.Items || [];
      return <Badge count={items.length} showZero />;
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
          <Tooltip title="Manage Items">
            <Link href={`${route_paths.menus}/detail/${id}`}>
              <Button type="text" icon={<EyeOutlined />} size="small" />
            </Link>
          </Tooltip>
          <DtActionContainer>
            <DtDelete url={`${api_points.menu.delete}/${id}`} data={record} customDelete={() => deleteMenu(id)} />
            <DtEdit data={record} url={`${route_paths.menus}/edit`} />
          </DtActionContainer>
        </Space>
      );
    },
  },
];

export default columns;
