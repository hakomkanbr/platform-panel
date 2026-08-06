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
import { useTranslations } from "@repo/localization";
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
import type {
  AttributeDefinitionReadModel as AttributeDefinition,
  AttributeGroupReadModel as AttributeGroup,
  AttributeDefinitionValueReadModel as AttributeValue,
} from "../../../types/catalog";

type GroupRow = AttributeGroup & Record<string, unknown>;

const { Text } = Typography;

export function AttributesPage() {
  const t = useTranslations();
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
      message.success(editingGroup ? t("catalog.attributes.groupUpdated") : t("catalog.attributes.groupCreated"));
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
      message.success(editingDefinition ? t("catalog.attributes.definitionUpdated") : t("catalog.attributes.definitionCreated"));
      setDefDrawerOpen(false);
      setEditingDefinition(null);
    } catch (e) {
      message.error(getApiErrorMessage(e));
    }
  };

  const definitionColumns: TableColumnsType<AttributeDefinition> = [
    { title: t("catalog.attributes.nameColumn"), dataIndex: "name" },
    { title: t("catalog.attributes.keyColumn"), dataIndex: "key", render: (v) => <Text code>{v}</Text> },
    { title: t("catalog.attributes.typeColumn"), dataIndex: "valueType", render: (v) => enumLabel("attributeValueType", v, t) },
    {
      title: t("catalog.attributes.valuesColumn"),
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
            title={t("catalog.attributes.deleteDefinitionConfirm")}
            onConfirm={async () => {
              try {
                await removeDefinition.mutateAsync(record.id as string);
                message.success(t("catalog.attributes.definitionDeleted"));
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
    { title: t("catalog.attributes.nameColumn"), dataIndex: "name", render: (v) => <Text strong>{v}</Text> },
    { title: t("catalog.attributes.keyColumn"), dataIndex: "key", render: (v) => <Text code>{v}</Text> },
    {
      title: t("catalog.attributes.definitionsColumn"),
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
            {t("catalog.attributes.manage")}
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEditGroup(record)} />
          <Popconfirm
            title={t("catalog.attributes.deleteGroupConfirm")}
            onConfirm={async () => {
              try {
                await removeGroup.mutateAsync(record.id);
                message.success(t("catalog.attributes.groupDeleted"));
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
      title={t("catalog.attributes.title")}
      description={t("catalog.attributes.description")}
      breadcrumbs={[{ title: t("catalog.title"), href: "/admin/catalog" }, { title: t("catalog.attributes.title") }]}
      actions={
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateGroup}>
          {t("catalog.attributes.newGroup")}
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
        title={t("catalog.attributes.groupsCount", { count: data?.count ?? groups.length })}
        emptyTitle={t("catalog.attributes.emptyTitle")}
        emptyDescription={t("catalog.attributes.emptyDescription")}
        emptyAction={{ label: t("catalog.attributes.emptyAction"), onClick: openCreateGroup }}
      />

      {/* Group create/edit */}
      <DrawerForm
        open={groupDrawerOpen}
        onClose={() => setGroupDrawerOpen(false)}
        title={editingGroup ? t("catalog.attributes.drawerEditGroup") : t("catalog.attributes.drawerCreateGroup")}
        width={520}
        form={groupForm}
        loading={saveGroup.isPending}
        onFinish={onFinishGroup}
        submitLabel={editingGroup ? t("common.actions.saveChanges") : t("catalog.attributes.submitCreateGroup")}
      >
        <Form form={groupForm} layout="vertical" onFinish={onFinishGroup}>
          <Form.Item name="name" label={t("common.fields.name")} rules={[{ required: true, message: t("common.fields.nameRequired") }]}>
            <Input placeholder={t("catalog.attributes.placeholderName")} />
          </Form.Item>
          <Form.Item name="key" label={t("catalog.attributes.keyColumn")} rules={[{ required: true, message: t("catalog.attributes.keyRequired") }]}>
            <Input placeholder={t("catalog.attributes.placeholderKey")} />
          </Form.Item>
          <Form.Item name="description" label={t("common.fields.description")}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="displayOrder" label={t("catalog.attributes.displayOrder")}>
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
              {groupQuery.data?.name ?? t("catalog.attributes.groupTitle")}
            </Text>
            {groupQuery.data?.key && <Text code>{groupQuery.data.key}</Text>}
          </Space>
        }
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateDefinition}>
            {t("catalog.attributes.newDefinition")}
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
            emptyText: <EmptyState title={t("catalog.attributes.emptyDefinitionsTitle")} description={t("catalog.attributes.emptyDefinitionsDescription")} />,
          }}
        />
      </Drawer>

      {/* Definition create/edit */}
      <DrawerForm
        open={defDrawerOpen}
        onClose={() => setDefDrawerOpen(false)}
        title={editingDefinition ? t("catalog.attributes.drawerEditDefinition") : t("catalog.attributes.drawerCreateDefinition")}
        width={620}
        form={defForm}
        loading={saveDefinition.isPending}
        onFinish={onFinishDefinition}
        submitLabel={editingDefinition ? t("common.actions.saveChanges") : t("catalog.attributes.submitCreateDefinition")}
      >
        <Form form={defForm} layout="vertical" onFinish={onFinishDefinition}>
          <Space direction="vertical" style={{ width: "100%" }} size={0}>
            <Form.Item name="name" label={t("common.fields.name")} rules={[{ required: true, message: t("common.fields.nameRequired") }]}>
              <Input placeholder={t("catalog.attributes.placeholderMaterial")} />
            </Form.Item>
            <Form.Item name="key" label={t("catalog.attributes.keyColumn")} rules={[{ required: true, message: t("catalog.attributes.keyRequired") }]}>
              <Input placeholder={t("catalog.attributes.placeholderMaterialKey")} />
            </Form.Item>
            <Form.Item name="valueType" label={t("catalog.attributes.valueType")} initialValue={1}>
              <Select options={enumOptions("attributeValueType", t)} />
            </Form.Item>
            <Form.Item name="unit" label={t("catalog.attributes.unit")}>
              <Input placeholder={t("catalog.attributes.placeholderUnit")} />
            </Form.Item>
            <Form.Item name="displayOrder" label={t("catalog.attributes.displayOrder")}>
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Space size={16} wrap>
              <Form.Item name="isRequired" label={t("catalog.attributes.required")} valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item name="isSearchable" label={t("catalog.attributes.searchable")} valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item name="isFilterable" label={t("catalog.attributes.filterable")} valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item name="isVisibleOnStorefront" label={t("catalog.attributes.visibleOnStorefront")} valuePropName="checked">
                <Switch />
              </Form.Item>
            </Space>
            <Form.Item label={t("catalog.attributes.presetValues")}>
              <Form.List name="values">
                {(fields, { add, remove }) => (
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {fields.map((field) => (
                      <Space.Compact key={field.key} style={{ width: "100%" }}>
                        <Form.Item name={[field.name, "value"]} noStyle>
                          <Input placeholder={t("catalog.attributes.placeholderValue")} />
                        </Form.Item>
                        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(field.name)} />
                      </Space.Compact>
                    ))}
                    <Button icon={<PlusOutlined />} onClick={() => add({ value: "" })}>
                      {t("catalog.attributes.addValue")}
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
