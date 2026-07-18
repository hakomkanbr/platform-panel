"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ColorPicker, Space, TableProps, Tag } from "antd";

import EButton from "@/components/elements/button";
import ECard from "@/components/elements/card";

import route_paths from "@/helper/route_paths";
import ImageRender from "@/components/elements/table/render-image";
import PlacesEnum from "@/abstracts/file.enum";

import { EnFieldType as EnFieldType } from "@/abstracts/modules/module-input";
import { IField, IModule } from "@/types/page";
import ETable from "@/components/elements/table";
import api_points from "@/api/points";
import { cols } from "./columns";
import GallaryRender from "@/components/elements/table/render-gallary";

type Props = {
  fields: IField[];
  model: IModule;
};

export default function ContentsView({ fields, model }: Props) {

  const buildDynamicColumns = (fields: IField[]): TableProps["columns"] => {
    console.info("fields : ", fields);
    const imageColumns: TableProps["columns"] = fields
      .filter((input) => input.fieldType === EnFieldType.image)
      .map((input) => ({
        dataIndex: input.fieldSlug.toLowerCase(),
        title: input.name,
        width: 50,
        render: (value: any) => {
          return <ImageRender value={value} folderName={PlacesEnum.Content} />
        },
      }));

    const otherColumns: TableProps["columns"] = fields
      .filter((input) =>
        input.fieldType != EnFieldType.image &&
        input.fieldType != EnFieldType.editor
      )
      .map((input) => {
        if (input.fieldType === EnFieldType.gallary) {
          return {
            dataIndex: input.fieldSlug.toLowerCase(),
            title: input.name,
            render: (value: string) => {
              try {
                console.info("input => ", input);
                console.info("value => ", value);
                var arr = JSON.parse(value) ?? [];
                return <GallaryRender folderName={PlacesEnum.Content} value={arr} />
              } catch (err) {
                return <GallaryRender folderName={PlacesEnum.Content} value={[]} />
              }
            }
          };
        }
        if (input.fieldType === EnFieldType.color) {
          return {
            dataIndex: input.fieldSlug,
            title: input.name,
            render: (value: string) => {
              return <ColorPicker disabled size="small" value={value} />
            }
          };
        }
        if (input.fieldType === EnFieldType.boolean) {
          return {
            dataIndex: input.fieldSlug,
            title: input.name,
            render: (value: string) => {
              return <Tag color={value ? "green-inverse" : "red-inverse"}>{value ? "Yes" : "No"}</Tag>
            }
          };
        }
        return {
          dataIndex: input.fieldSlug,
          title: input.name,
          render: (value: any) => value,
        }
      });
    if (!cols) return [...imageColumns, ...otherColumns];
    return [...imageColumns, ...otherColumns, ...cols];
  };

  const dynamicColumns = useMemo(() => buildDynamicColumns(fields), [fields]);

  return (
    <ECard
      title="Contents"
      extra={
        <Space>
          <Link href={`/admin/${model.id}${route_paths.categories}`}>
            <EButton type="primary">Categories</EButton>
          </Link>
          <Link href={`/admin/${model.id}${route_paths.contents}/create`}>
            <EButton type="default">Create Content</EButton>
          </Link>
        </Space>
      }
    >
      <ETable
        columns={dynamicColumns}
        url={api_points.content.getAll}
        payload={{ moduleId: model.id }}
      />
    </ECard>
  );
}
