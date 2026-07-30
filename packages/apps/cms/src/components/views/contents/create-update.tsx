"use client";;
import enumCreateUpdate from "@/abstracts/create-update";
import SelectDataType from "@/abstracts/label-value";
import api from "@/api/api-context";
import api_points from "@/api/points";
import EButton from "@/components/elements/button";
import ECard from "@/components/elements/card";
import DebounceSelectCategory from "@/components/elements/select/select-xhr-category";
import RelationSelect from "@/components/elements/select/select-xhr-relations";
import RelatedContentSelect from "@/components/elements/select/select-xhr-related-content";
import route_paths from "@/helper/route_paths";
import {
    Col,
    Collapse,
    DatePicker,
    Form,
    Input,
    Row,
    Select,
    Spin,
    Typography,
    Space,
    Divider,
    Alert
} from "antd";
import {
    SaveOutlined,
    ArrowLeftOutlined,
    SettingOutlined,
    TagsOutlined,
    CalendarOutlined,
    EyeOutlined,
    FileTextOutlined,
    SearchOutlined,
    GlobalOutlined,
    LinkOutlined
} from "@ant-design/icons";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import FeedInputs from "./inputs";
import moment from "moment";
import UploadImage from "@/components/elements/upload/upload-single";
import PlacesEnum from "@/abstracts/file.enum";
import { useRouter } from "next/navigation";
import { checkOutError } from "@/helper/checkout-error";
import { IError } from "@/abstracts/error-types";
import WriteError from "@/components/elements/error-message/error-message";
import LanguageSelect from "@/components/elements/language-select";
import ILanguage from "@/abstracts/language";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedLang } from "@/lib/redux-toolkit/slice/language-slice";
import { RootState } from "@/lib/redux-toolkit/store";
import TextArea from "antd/es/input/TextArea";
import { IField, IModule } from "@/types/page";
import { EnFieldType } from "@/abstracts/modules/module-input";
import './create-update.css';
import ICategory from "@/abstracts/categories";
const { Title, Text } = Typography;

export default function CreateUpdateContentView({
    params,
    model
}: {
    params: { slug: string, "create-update": string, id: number },
    model: IModule
}) {
    const [form] = Form.useForm();
    const watchPublished = Form.useWatch("published", form);
    const [categoryId, setCategoryId] = useState<SelectDataType[]>();
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const [fields, setFields] = useState<IField[]>([]);
    const isCreate = params["create-update"] === enumCreateUpdate.create;
    const title = isCreate ? "Create New Content" : "Edit Content";
    const [errors, setErrors] = useState<IError[]>([]);
    const dispatch = useDispatch();
    const { languages } = useSelector((state: RootState) => state);

    // Relations state
    const [selectedRelation, setSelectedRelation] = useState<any>(null);
    const [relatedContent, setRelatedContent] = useState<any[]>([]);


    const onFinish = useCallback(async (values: any) => {
        try {
            console.info("values => ", values);
            values.languageId = languages.selectedLang?.id ?? 0;
            values.moduleId = model.id;
            setLoading(true);

            if (!values.languageId) {
                alert("No language selected");
                return;
            }

            if (Array.isArray(values.categoryIds)) {
                values.categoryIds = values.categoryIds.map((i: any) => i.value);
            };

            // Handle relations
            if (values.relationId && values.relatedContentIds) {
                values.relations = [{
                    relationId: values.relationId.value,
                    relatedContentIds: Array.isArray(values.relatedContentIds)
                        ? values.relatedContentIds.map((item: any) => item.value)
                        : [values.relatedContentIds.value]
                }];
                delete values.relationId;
                delete values.relatedContentIds;
            }

            values["id"] = params["id"];
            values.fieldValues = [];

            values.seo = {
                bookmarks: values.seo_bookmarks,
                description: values.seo_description,
                keywords: values.seo_keywords,
                title: values.seo_title
            };

            // values.seo = JSON.stringify(values.seo);

            Object.keys(values).map((keyName: string) => {
                const input = fields?.find(i => i.fieldSlug == keyName);
                console.info(`key is ${keyName} and his value is ${values[keyName]}`);
                console.info("input => ", input);
                if (input) {
                    values.fieldValues.push({
                        fieldId: input.id,
                        fieldType: input.fieldType,
                        value: Array.isArray(values[keyName])
                            ? JSON.stringify(values[keyName])
                            : values[keyName] ? `${values[keyName]}` : null
                    });
                    delete values[keyName];
                }
            });

            if (values.id) {
                await api.put(api_points.content.update, values);
            } else {
                await api.post(api_points.content.create, values);
            }

            dispatch(setSelectedLang(null));
            router.push(`/admin/${params["slug"]}/${route_paths.contents}`);
        } catch (err: any) {
            setErrors(checkOutError(err));
        } finally {
            setLoading(false);
        }
    }, [categoryId, fields, languages]);

    async function fetchCategoryList(): Promise<SelectDataType[]> {
        let res = await (
            await api.post(api_points.category.getList, {
                pageSize: 50,
                currentPage: 1,
                moduleId: model.id,
                languageId: languages.selectedLang?.id ?? 0
            })
        ).data;
        return res.data;
    }

    async function getModuleInputs() {
        return model.fields;
    }

    const getContent = async (fields: IField[]) => {
        const data = (await api.get(`${api_points.content.getOne}?moduleId=${model.id}&id=${params["id"]}`)).data;

        (data.language as ILanguage) && dispatch(setSelectedLang(data.language));

        data.fieldValues.map((input: {
            fieldId: number;
            value: string | any
        }) => {
            const field = fields.find(i => i.id == input.fieldId);
            if (field?.fieldSlug) {
                if (
                    field.fieldType == EnFieldType.date ||
                    field.fieldType == EnFieldType.dateTime ||
                    field.fieldType == EnFieldType.time) {
                    data[field.fieldSlug] = moment(input.value);
                } else if (field.fieldType == EnFieldType.color) {
                    // Use the actual saved color value instead of hardcoded red
                    console.info(`Color field ${field.fieldSlug} value:`, input.value);
                    data[field.fieldSlug] = input.value || "#D1BBB7";
                } else {
                    data[field.fieldSlug] = input.value;
                }
            }
        });

        data.seo_bookmarks = data.seo?.bookmarks ?? "";
        data.seo_description = data.seo?.description ?? "";
        data.seo_keywords = data.seo?.keywords ?? "";
        data.seo_title = data.seo?.title ?? "";

        data["categoryIds"] = data.categories.map((c: ICategory) => ({ label: c.name, value: c.id }));
        setCategoryId(data.categories.map((c: ICategory) => ({ label: c.name, value: c.id })));

        // Handle relations data
        if (data.relations && data.relations.length > 0) {
            const relation = data.relations[0]; // Assuming one relation per content for now
            data["relationId"] = { label: relation.relationName, value: relation.relationId };
            data["relatedContentIds"] = relation.relatedContent.map((content: any) => ({
                label: content.title,
                value: content.id
            }));
            setSelectedRelation({
                relationType: relation.relationType,
                relatedModuleSlug: relation.relatedModuleSlug,
                relatedModuleName: relation.relatedModuleName
            });
        }
        form.setFieldsValue(data);
    };

    useEffect(() => {
        getModuleInputs().then((moduleInputs: IField[]) => {
            const fields = moduleInputs.map((field: IField) => ({
                ...field,
                fieldType: field.fieldType.toLowerCase(),
            }));
            setFields(fields);
            if (params["create-update"] == enumCreateUpdate.edit) {
                getContent(fields);
            }
            setLoading(false);
        });

        console.info("languages => ", languages.list);
    }, []);

    useEffect(() => {
        console.info("languages => ", languages.list);
    }, [languages.list]);

    // Handle relation selection
    const handleRelationSelect = (relation: any) => {
        setSelectedRelation(relation);
        // Clear related content when relation changes
        form.setFieldValue("relatedContentIds", null);
        setRelatedContent([]);
    };

    // Handle related content selection
    const handleRelatedContentChange = (values: any) => {
        setRelatedContent(values);
    };


    // Separate fields by type for better organization
    const regularFields = fields.filter(field =>
        ![EnFieldType.image, EnFieldType.gallary].includes(field.fieldType as EnFieldType)
    );
    const mediaFields = fields.filter(field =>
        [EnFieldType.image, EnFieldType.gallary].includes(field.fieldType as EnFieldType)
    );

    return (
        <div className="content-editor-container">
            <Spin spinning={loading} size="large">
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        published: true,
                        date: moment(new Date())
                    }}
                    onFinish={onFinish}
                    className="content-form"
                >
                    <Row gutter={[32, 32]} className="content-editor-row">
                        {/* Main Content Area */}
                        <Col xs={24} lg={16} className="main-content-col">
                            {/* Header Section */}
                            <div className="content-header">
                                <div className="header-content">
                                    <Title level={2} className="content-title">
                                        <FileTextOutlined className="title-icon" />
                                        {title}
                                    </Title>
                                    <Text className="content-subtitle">
                                        {isCreate
                                            ? "Create engaging content for your audience"
                                            : "Update and refine your content"
                                        }
                                    </Text>
                                </div>
                                <div className="header-actions">
                                    <LanguageSelect
                                        singleItem={null}
                                        onClick={(e) => {
                                            form.setFieldValue("categoryIds", null);
                                        }}
                                        title="Choose Language"
                                        size="default"
                                        variant="default"
                                    />
                                </div>
                            </div>

                            {/* Error Messages */}
                            {errors.length > 0 && (
                                <Alert
                                    message="Please fix the following errors:"
                                    type="error"
                                    showIcon
                                    style={{ marginBottom: 24 }}
                                />
                            )}
                            <WriteError errors={errors} />

                            {/* Dynamic Fields Section */}
                            <ECard
                                className="fields-card"
                                title={
                                    <Space>
                                        <SettingOutlined />
                                        Content Fields
                                    </Space>
                                }
                                extra={
                                    <Text type="secondary">
                                        {regularFields.length} field{regularFields.length !== 1 ? 's' : ''}
                                    </Text>
                                }
                            >
                                <FeedInputs fields={regularFields} />
                            </ECard>

                            {/* Media Fields Section */}
                            {mediaFields.length > 0 && (
                                <ECard
                                    className="media-card"
                                    title={
                                        <Space>
                                            <EyeOutlined />
                                            Media Content
                                        </Space>
                                    }
                                    extra={
                                        <Text type="secondary">
                                            {mediaFields.length} media field{mediaFields.length !== 1 ? 's' : ''}
                                        </Text>
                                    }
                                >
                                    <Row gutter={[24, 24]}>
                                        {mediaFields.map((field: IField, index: number) => (
                                            <Col xs={24} sm={12} lg={8} key={field.id || index}>
                                                <div className="media-field-container">
                                                    <Title level={5} className="media-field-title">
                                                        {field.name}
                                                    </Title>
                                                    <Form.Item name={field.fieldSlug} className="media-form-item">
                                                        <UploadImage
                                                            multiple={field.fieldType === EnFieldType.gallary}
                                                            name={field.fieldSlug}
                                                            form={form}
                                                            module={PlacesEnum.Content}
                                                        />
                                                    </Form.Item>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                </ECard>
                            )}

                            {/* SEO Section */}
                            <ECard className="seo-card">
                                <Collapse
                                    ghost
                                    items={[{
                                        key: 'seo',
                                        label: (
                                            <Space>
                                                <SearchOutlined />
                                                <span>SEO & Meta Information</span>
                                            </Space>
                                        ),
                                        children: (
                                            <div className="seo-content">
                                                <Row gutter={[24, 24]}>
                                                    <Col xs={24} md={12}>
                                                        <Form.Item name="seo_title" label="Page Title">
                                                            <Input
                                                                placeholder="Enter SEO title"
                                                                prefix={<FileTextOutlined />}
                                                                showCount
                                                                maxLength={60}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={24} md={12}>
                                                        <Form.Item name="seo_bookmarks" label="Bookmarks">
                                                            <Input
                                                                placeholder="Enter bookmarks"
                                                                prefix={<TagsOutlined />}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={24} md={12}>
                                                        <Form.Item name="seo_description" label="Meta Description">
                                                            <TextArea
                                                                placeholder="Enter meta description"
                                                                rows={3}
                                                                showCount
                                                                maxLength={160}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={24} md={12}>
                                                        <Form.Item name="seo_keywords" label="Keywords">
                                                            <TextArea
                                                                placeholder="Enter keywords (comma separated)"
                                                                rows={3}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            </div>
                                        )
                                    }]}
                                />
                            </ECard>
                        </Col>

                        {/* Sidebar */}
                        <Col xs={24} lg={8} className="sidebar-col">
                            {/* Publish Settings */}
                            <ECard
                                className="publish-card"
                                title={
                                    <Space>
                                        <GlobalOutlined />
                                        Publish Settings
                                    </Space>
                                }
                            >
                                <Form.Item name="published" label="Status" style={{ marginBottom: '24px' }}>
                                    <Select size="large">
                                        <Select.Option value={true}>
                                            <Space>
                                                <div className="status-indicator published"></div>
                                                Published
                                            </Space>
                                        </Select.Option>
                                        <Select.Option value={false}>
                                            <Space>
                                                <div className="status-indicator draft"></div>
                                                Draft
                                            </Space>
                                        </Select.Option>
                                    </Select>
                                </Form.Item>

                                {watchPublished === false && (
                                    <Form.Item name="date" label="Publish Date" style={{ marginBottom: '24px' }}>
                                        <DatePicker
                                            style={{ width: "100%" }}
                                            size="large"
                                        />
                                    </Form.Item>
                                )}

                                <Divider style={{ margin: '24px 0' }} />

                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                    <EButton
                                        htmlType="submit"
                                        loading={loading}
                                        type="primary"
                                        size="large"
                                        icon={<SaveOutlined />}
                                        className="save-button"
                                        style={{ flex: 1, minWidth: '140px' }}
                                    >
                                        {isCreate ? 'Create Content' : 'Update Content'}
                                    </EButton>
                                    <Link href={`/admin/${params["slug"]}${route_paths.contents}`}>
                                        <EButton
                                            type="default"
                                            size="large"
                                            icon={<ArrowLeftOutlined />}
                                            style={{ minWidth: '100px' }}
                                        >
                                            Back
                                        </EButton>
                                    </Link>
                                </div>
                            </ECard>

                            {/* Categories */}
                            <ECard
                                className="categories-card"
                                title={
                                    <Space>
                                        <TagsOutlined />
                                        Categories
                                    </Space>
                                }
                            >
                                <Form.Item name="categoryIds" style={{ marginBottom: 0 }}>
                                    <DebounceSelectCategory
                                        style={{ width: "100%" }}
                                        size="large"
                                        value={categoryId}
                                        // onChange={(newValue) => {
                                        //     setCategoryId(newValue as SelectDataType[]);
                                        // }}
                                        fetchOptions={fetchCategoryList}
                                        placeholder="Select category..."
                                    />
                                </Form.Item>
                            </ECard>

                            {/* Relations */}
                            {/* <ECard
                                className="relations-card"
                                title={
                                    <Space>
                                        <LinkOutlined />
                                        Relations
                                    </Space>
                                }
                            >
                                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                    <Form.Item
                                        name="relationId"
                                        label="Select Relation"
                                        style={{ marginBottom: 12 }}
                                    >
                                        <RelationSelect
                                            moduleSlug={model.slug}
                                            onRelationSelect={handleRelationSelect}
                                            style={{ width: "100%" }}
                                            size="large"
                                            placeholder="Choose relation..."
                                        />
                                    </Form.Item>

                                    {selectedRelation && (
                                        <Form.Item
                                            name="relatedContentIds"
                                            label={`Select Content from ${selectedRelation.relatedModuleName}`}
                                            style={{ marginBottom: 0 }}
                                        >
                                            <RelatedContentSelect
                                                relatedModuleSlug={selectedRelation.relatedModuleSlug}
                                                relationType={selectedRelation.relationType}
                                                languageSlug={languages.selectedLang?.slug}
                                                onChange={handleRelatedContentChange}
                                                style={{ width: "100%" }}
                                                size="large"
                                            />
                                        </Form.Item>
                                    )}
                                </Space>
                            </ECard> */}
                        </Col>
                    </Row>
                </Form>
            </Spin>
        </div>
    );
}