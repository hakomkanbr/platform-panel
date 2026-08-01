"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Typography,
} from "antd";
import type { TableColumnsType } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { DataTable, DrawerForm, EmptyState } from "@repo/ui";
import { CommerceShell } from "../../../components/CommerceShell";
import { enumLabel, enumOptions } from "../../../types/enums";
import {
  useAttributeGroup,
  useAttributeGroups,
  useDeleteAttributeDefinition,
  useDeleteAttributeGroup,
  useSaveAttributeDefinition,
  useSaveAttributeGroup,
} from "../../../hooks/useAttributeGroups";
import { getApiErrorMessage } from "../../../api/http";
import type { AttributeDefinition, AttributeGroup, AttributeValue } from "../../../types/catalog";

type GroupRow = AttributeGroup & Record<string, unknown>;

const { Text } = Typography;

export function AttributesPage() {
  const { data, isLoading, isError, error, refetch } = useAttributeGroups();
  const saveGroup = useSaveAttributeGroup();
  const removeGroup = useDeleteAttributeGroup();

  const [groupDrawerOpen, setGroupDrawerOpen] = useState(false);
  const [groupDetailOpen, setGroupDetailOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [editingGroup, setEditingGroup] = useState<AttributeGroup | null>(null);
  const [groupForm] = Form.useForm();

  const groupQuery = useAttributeGroup(selectedGroupId);
  const saveDefinition = useSaveAttributeDefinition(selectedGroupId);
  const removeDefinition = useDeleteAttributeDefinition(selectedGroupId);

  const [defDrawerOpen, setDefDrawerOpen] = useState(false);
  const [editingDefinition, setEditingDefinition] = useState<AttributeDefinition | null>(null);
  const [defForm] = Form.useForm();

  const groups = (data?.data ?? []) as GroupRow[];

  const openCreateGroup = () => {
    setEditingGroup(null);
    groupForm.resetFields();
    setGroupDrawerOpen(true);
  };

  const openEditGroup = (group: AttributeGroup) => {
    setEditingGroup(group);
    groupForm.setFieldsValue({
      key: group.key,
      name: group.name,
      description: group.description,
      displayOrder: group.displayOrder,
    });
    setGroupDrawerOpen(true);
  };

  const openGroupDetail = (group: AttributeGroup) => {
    setSelectedGroupId(group.id);
    setGroupDetailOpen(true);
  };

  const onFinishGroup = async (values: Record<string, unknown>) => {
    try {
      await saveGroup.mutateAsync({
        id: editingGroup?.id,
        body: {
          key: values.key as string,
          name: values.name as string,
          description: values.description as string | undefined,
          displayOrder: values.displayOrder as number | undefined,
        },
      });
      message.success(editingGroup ? "Group updated" : "Group created");
      setGroupDrawerOpen(false);
      setEditingGroup(null);
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const openCreateDefinition = () => {
    setEditingDefinition(null);
    defForm.resetFields();
    defForm.setFieldsValue({ isRequired: false, isSearchable: true, isFilterable: true, isVisibleOnStorefront: true });
    setDefDrawerOpen(true);
  };

  const openEditDefinition = (definition: AttributeDefinition) => {
    setEditingDefinition(definition);
    defForm.setFieldsValue({
      key: definition.key,
      name: definition.name,
      valueType: definition.valueType,
      unit: definition.unit,
      isRequired: definition.isRequired,
      isSearchable: definition.isSearchable,
      isFilterable: definition.isFilterable,
      isVisibleOnStorefront: definition.isVisibleOnStorefront,
      displayOrder: definition.displayOrder,
      values: definition.values ?? [],
    });
    setDefDrawerOpen(true);
  };

  const onFinishDefinition = async (values: Record<string, unknown>) => {
    if (!selectedGroupId) return;
    try {
      await saveDefinition.mutateAsync({
        definitionId: editingDefinition?.id,
        body: {
          key: values.key as string,
          name: values.name as string,
          valueType: values.valueType as number,
          unit: values.unit as string | undefined,
          isRequired: values.isRequired as boolean | undefined,
          isSearchable: values.isSearchable as boolean | undefined,
          isFilterable: values.isFilterable as boolean | undefined,
          isVisibleOnStorefront: values.isVisibleOnStorefront as boolean | undefined,
          displayOrder: values.displayOrder as number | undefined,
          values:
            ((values.values as { value?: string }[] | undefined)?.filter((v) => v.value?.trim()) ?? []) as AttributeValue[],
        },
      });
      message.success(editingDefinition ? "Definition updated" : "Definition created");
      setDefDrawerOpen(false);
      setEditingDefinition(null);
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const definitionColumns: TableColumnsType<AttributeDefinition> = [
    { title: "Name", dataIndex: "name" },
    { title: "Key", dataIndex: "key", render: (v) => <Text code>{v}</Text> },
    { title: "Type", dataIndex: "valueType", render: (v) => enumLabel("attributeValueType", v) },
    {
      title: "Values",
      dataIndex: "values",
      render: (values: unknown[] | undefined) => values?.length ?? 0,
    },
    {
      title: "",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEditDefinition(record)} />
          <Popconfirm
            title="Delete definition?"
            onConfirm={async () => {
              try {
                await removeDefinition.mutateAsync(record.id as string);
                message.success("Definition deleted");
              } catch (e) {
                message.error(getApiErrorMessage(e));
              }
            }}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const groupColumns: TableColumnsType<GroupRow> = [
    { title: "Name", dataIndex: "name", render: (v) => <Text strong>{v}</Text> },
    { title: "Key", dataIndex: "key", render: (v) => <Text code>{v}</Text> },
    {
      title: "Definitions",
      dataIndex: "definitions",
      width: 110,
      render: (d: AttributeDefinition[] | undefined) => d?.length ?? 0,
    },
    {
      title: "",
      key: "actions",
      width: 220,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => openGroupDetail(record)}>
            Manage
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEditGroup(record)} />
          <Popconfirm
            title="Delete group?"
            onConfirm={async () => {
              try {
                await removeGroup.mutateAsync(record.id);
                message.success("Group deleted");
              } catch (e) {
                message.error(getApiErrorMessage(e));
              }
            }}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <CommerceShell
      title="Attributes"
      description="Define reusable attribute groups and fields to enrich product information."
      breadcrumbs={[{ title: "Catalog", href: "/admin/catalog" }, { title: "Attributes" }]}
      actions={
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateGroup}>
          New attribute group
        </Button>
      }
    >
      <DataTable<GroupRow>
        columns={groupColumns}
        dataSource={groups}
        rowKey="id"
        loading={isLoading}
        error={error ? new Error(getApiErrorMessage(error)) : undefined}
        onRefresh={refetch}
        total={data?.count ?? groups.length}
        onRowClick={(record) => openGroupDetail(record)}
        title={`${data?.count ?? groups.length} groups`}
        emptyTitle="No attribute groups"
        emptyDescription="Create groups to organize attribute definitions."
        emptyAction={{ label: "New group", onClick: openCreateGroup }}
      />

      {/* Group create/edit */}
      <DrawerForm
        open={groupDrawerOpen}
        onClose={() => setGroupDrawerOpen(false)}
        title={editingGroup ? "Edit attribute group" : "New attribute group"}
        width={520}
        form={groupForm}
        loading={saveGroup.isPending}
        onFinish={onFinishGroup}
        submitLabel={editingGroup ? "Save changes" : "Create group"}
      >
        <Form form={groupForm} layout="vertical" onFinish={onFinishGroup}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Name is required" }]}>
            <Input placeholder="e.g. Fabric" />
          </Form.Item>
          <Form.Item name="key" label="Key" rules={[{ required: true, message: "Key is required" }]}>
            <Input placeholder="fabric" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="displayOrder" label="Display order">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </DrawerForm>

      {/* Group detail drawer */}
      <Drawer
        open={groupDetailOpen}
        onClose={() => setGroupDetailOpen(false)}
        width={760}
        destroyOnClose
        title={
          <Space>
            <Text strong style={{ fontSize: 18 }}>
              {groupQuery.data?.name ?? "Attribute group"}
            </Text>
            {groupQuery.data?.key && <Text code>{groupQuery.data.key}</Text>}
          </Space>
        }
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateDefinition}>
            New definition
          </Button>
        }
      >
        <Table<AttributeDefinition>
          rowKey={(r) => r.id ?? r.key}
          columns={definitionColumns}
          dataSource={groupQuery.data?.definitions ?? []}
          loading={groupQuery.isLoading}
          pagination={false}
          size="middle"
          locale={{
            emptyText: <EmptyState title="No definitions" description="Add attribute definitions." />,
          }}
        />
      </Drawer>

      {/* Definition create/edit */}
      <DrawerForm
        open={defDrawerOpen}
        onClose={() => setDefDrawerOpen(false)}
        title={editingDefinition ? "Edit definition" : "New definition"}
        width={620}
        form={defForm}
        loading={saveDefinition.isPending}
        onFinish={onFinishDefinition}
        submitLabel={editingDefinition ? "Save changes" : "Create definition"}
      >
        <Form form={defForm} layout="vertical" onFinish={onFinishDefinition}>
          <Space direction="vertical" style={{ width: "100%" }} size={0}>
            <Form.Item name="name" label="Name" rules={[{ required: true, message: "Name is required" }]}>
              <Input placeholder="e.g. Material" />
            </Form.Item>
            <Form.Item name="key" label="Key" rules={[{ required: true, message: "Key is required" }]}>
              <Input placeholder="material" />
            </Form.Item>
            <Form.Item name="valueType" label="Value type" initialValue={1}>
              <Select options={enumOptions("attributeValueType")} />
            </Form.Item>
            <Form.Item name="unit" label="Unit">
              <Input placeholder="e.g. kg, cm" />
            </Form.Item>
            <Form.Item name="displayOrder" label="Display order">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Space size={16} wrap>
              <Form.Item name="isRequired" label="Required" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item name="isSearchable" label="Searchable" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item name="isFilterable" label="Filterable" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item name="isVisibleOnStorefront" label="Visible on storefront" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Space>
            <Form.Item label="Preset values">
              <Form.List name="values">
                {(fields, { add, remove }) => (
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {fields.map((field) => (
                      <Space.Compact key={field.key} style={{ width: "100%" }}>
                        <Form.Item name={[field.name, "value"]} noStyle>
                          <Input placeholder="Value" />
                        </Form.Item>
                        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(field.name)} />
                      </Space.Compact>
                    ))}
                    <Button icon={<PlusOutlined />} onClick={() => add({ value: "" })}>
                      Add value
                    </Button>
                  </Space>
                )}
              </Form.List>
            </Form.Item>
          </Space>
        </Form>
      </DrawerForm>
    </CommerceShell>
  );
}
