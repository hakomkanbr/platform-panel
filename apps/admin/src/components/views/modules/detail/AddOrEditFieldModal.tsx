"use client";;
import { useEffect, useState } from "react";
import { Modal, Form, Input, Select, message, Row, Col, Card, Divider, Typography, Switch, Space, Alert, Tabs } from "antd";
import { SettingOutlined, EyeOutlined, InfoCircleOutlined, CheckCircleOutlined, FieldStringOutlined } from "@ant-design/icons";
import api from "@/api/api-context";
import { createField, updateField } from "@/api/repostories/fields";
import { EnFieldType } from "@/abstracts/modules/module-input";
import { FieldOptionsRenderer, FieldPreview, getModuleFieldTypes } from "@/components/fields";

const { Option } = Select;
const { Title, Text } = Typography;

export default function AddOrEditFieldModal({
    open,
    onClose,
    moduleId,
    field,
    onSaved,
}: any) {
    const [form] = Form.useForm();
    const [fieldType, setFieldType] = useState(field?.type || "Text");
    const [fieldName, setFieldName] = useState(field?.name || "");
    const [formValues, setFormValues] = useState({});

    useEffect(() => {
        if (field) {
            const options = field.settings ? JSON.parse(field.settings) : {}
            const pay = {
                ...field,
                ...options
            };
            console.info("pay => " , field);
            form.setFieldsValue(pay);
            setFieldType(field.fieldType || "Text");
        } else {
            form.resetFields();
            setFieldType("Text");
        }
    }, [field, form]);


    const onFinish = async (values: any) => {
        try {
            // Extract field basic info
            const { name, fieldSlug, fieldType, ...optionsData } = values;

            const payload = {
                name,
                fieldSlug,
                fieldType,
                moduleId,
                settings: JSON.stringify(optionsData), // All other form values become options
            };

            if (field) {
                await updateField(field.id, payload)
                message.success("Field updated successfully!");
            } else {
                await createField(payload)
                message.success("Field created successfully!");
            }

            onSaved();
            onClose(false);
        } catch {
            message.error("Failed to save field. Please try again.");
        }
    };

    return (
        <Modal
            title={
                <Space>
                    <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        background: "linear-gradient(135deg, #F7931E 0%, #E67E00 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <FieldStringOutlined style={{ color: "white", fontSize: 18 }} />
                    </div>
                    <div>
                        <Text strong style={{ fontSize: 16 }}>
                            {field ? "Edit Field" : "Create New Field"}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Configure field properties and validation
                        </Text>
                    </div>
                </Space>
            }
            open={open}
            onCancel={() => onClose()}
            onOk={() => form.submit()}
            okText={
                <Space>
                    <CheckCircleOutlined />
                    Save Field
                </Space>
            }
            cancelText="Cancel"
            width={800}
            style={{ top: 20 }}
            bodyStyle={{ padding: 0 }}
            className="modern-modal"
        >
            <Tabs
                defaultActiveKey="1"
                style={{ padding: "24px" }}
                items={[
                    {
                        key: "1",
                        label: (
                            <Space>
                                <InfoCircleOutlined />
                                Basic Info
                            </Space>
                        ),
                        children: (
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={onFinish}
                                onValuesChange={(changedValues, allValues) => {
                                    if (changedValues.name) setFieldName(changedValues.name);
                                    setFormValues(allValues);
                                }}
                                className="modern-form"
                            >
                                <Alert
                                    message="Field Configuration"
                                    description="Configure the basic properties of your field. The field name will be used to identify this field in your content."
                                    type="info"
                                    showIcon
                                    style={{ marginBottom: 24 }}
                                />

                                <Card 
                                    title={
                                        <Space>
                                            <SettingOutlined style={{ color: "#F7931E" }} />
                                            <Text strong>Basic Information</Text>
                                        </Space>
                                    }
                                    className="modern-card"
                                    style={{ marginBottom: 24 }}
                                >

                                    <Row gutter={[16, 16]}>
                                        <Col span={24}>
                                            <Form.Item
                                                name="name"
                                                label={<Text strong>Field Name</Text>}
                                                rules={[{ required: true, message: 'Please enter field name' }]}
                                            >
                                                <Input
                                                    placeholder="Enter field name (e.g., Title, Description)"
                                                    className="modern-input"
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={[16, 16]}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="fieldSlug"
                                                label={<Text strong>Field Slug</Text>}
                                                rules={[{ required: true, message: 'Please enter field slug' }]}
                                            >
                                                <Input
                                                    placeholder="field_slug"
                                                    className="modern-input"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="fieldType"
                                                label={<Text strong>Field Type</Text>}
                                                rules={[{ required: true, message: 'Please select field type' }]}
                                            >
                                                <Select
                                                    onChange={(value) => setFieldType(value)}
                                                    placeholder="Select field type"
                                                    showSearch
                                                    optionFilterProp="children"
                                                    className="modern-input"
                                                >
                                                    {getModuleFieldTypes().map((config:any) => (
                                                        <Option key={config.value} value={config.value}>
                                                            <Space>
                                                                <span style={{
                                                                    display: 'inline-block',
                                                                    width: 8,
                                                                    height: 8,
                                                                    borderRadius: '50%',
                                                                    backgroundColor: config.color === 'default' ? '#d9d9d9' : config.color
                                                                }} />
                                                                <span>{config.label}</span>
                                                            </Space>
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Card>

                                <Card 
                                    title={
                                        <Space>
                                            <SettingOutlined style={{ color: "#52c41a" }} />
                                            <Text strong>Field Configuration</Text>
                                        </Space>
                                    }
                                    className="modern-card"
                                >
                                    <FieldOptionsRenderer fieldType={fieldType} form={form} />
                                </Card>
                            </Form>
                        )
                    },
                    {
                        key: "2",
                        label: (
                            <Space>
                                <EyeOutlined />
                                Preview
                            </Space>
                        ),
                        children: (
                            <div>
                                <Alert
                                    message="Field Preview"
                                    description="This is how your field will appear in the content editor."
                                    type="success"
                                    showIcon
                                    style={{ marginBottom: 24 }}
                                />
                                
                                <Card 
                                    title={
                                        <Space>
                                            <EyeOutlined style={{ color: "#722ed1" }} />
                                            <Text strong>Live Preview</Text>
                                        </Space>
                                    }
                                    className="modern-card"
                                >
                                    <div style={{
                                        background: '#f8fafc',
                                        borderRadius: 8,
                                        padding: 24,
                                        border: '2px dashed #e2e8f0'
                                    }}>
                                        <FieldPreview 
                                            fieldType={fieldType} 
                                            fieldName={fieldName || "Sample Field"} 
                                        />
                                    </div>
                                </Card>
                            </div>
                        )
                    }
                ]}
            />
        </Modal>
    );
}
