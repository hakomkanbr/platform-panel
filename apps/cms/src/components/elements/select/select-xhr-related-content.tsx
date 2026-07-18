"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Select, Spin, Typography, Tag, Space } from "antd";
import type { SelectProps } from "antd/es/select";
import debounce from "lodash/debounce";
import api from "@/api/api-context";
import api_points from "@/api/points";
import { FileTextOutlined, CalendarOutlined } from "@ant-design/icons";
import moment from "moment";

const { Text } = Typography;

export interface RelatedContentSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, "options" | "children"> {
  relatedModuleSlug: string;
  relationType: number;
  languageSlug?: string;
  debounceTimeout?: number;
}

export interface ContentOption {
  key?: string;
  label: React.ReactNode;
  value: string | number;
  title: string;
  published: boolean;
  createdAt: string;
}

function RelatedContentSelect<ValueType extends ContentOption = ContentOption>({
  relatedModuleSlug,
  relationType,
  languageSlug,
  debounceTimeout = 800,
  ...props
}: RelatedContentSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const fetchRef = useRef(0);

  const fetchContent = useCallback(async (): Promise<ValueType[]> => {
    try {
      const response = await api.post(api_points.content.getAll, {
        pageSize: 100,
        currentPage: 1,
        moduleSlug: relatedModuleSlug,
        lang: languageSlug || ""
      });
      
      const contents = response.data?.data || [];
      
      return contents.map((content: any) => ({
        key: content.id,
        label: `${content.title} (${content.published ? 'Published' : 'Draft'})`,
        value: content.id,
        title: content.title,
        published: content.published,
        createdAt: content.createdAt,
        ...content
      })) as ValueType[];
    } catch (error) {
      console.error('Failed to fetch related content:', error);
      return [];
    }
  }, [relatedModuleSlug, languageSlug]);

  const debounceFetcher = useMemo(() => {
    const loadOptions = () => {
      if (!relatedModuleSlug) return;
      
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchContent().then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          return;
        }
        setOptions(newOptions);
        setFetching(false);
      });
    };
    return debounce(loadOptions, debounceTimeout);
  }, [relatedModuleSlug, languageSlug, debounceTimeout, fetchContent]);

  useEffect(() => {
    if (relatedModuleSlug) {
      // Reset options when module changes
      setOptions([]);
      if (!fetching) {
        debounceFetcher();
      }
    }
  }, [relatedModuleSlug, languageSlug, debounceFetcher, fetching]);

  // Determine if multiple selection is allowed based on relation type
  const isMultiple = relationType === 2 || relationType === 3; // OneToMany or ManyToMany

  return (
    <Select
      labelInValue
      filterOption={(input, option) => {
        const content = options.find(opt => opt.value === option?.value);
        return content?.title?.toLowerCase().includes(input.toLowerCase()) || false;
      }}
      placeholder={`Select ${isMultiple ? 'content items' : 'content item'}...`}
      notFoundContent={fetching ? <Spin size="small" /> : "No content found"}
      mode={isMultiple ? "multiple" : undefined}
      maxTagCount={isMultiple ? 3 : undefined}
      maxTagPlaceholder={(omittedValues) => `+${omittedValues.length} more`}
      {...props}
      options={options}
      suffixIcon={<FileTextOutlined />}
      disabled={!relatedModuleSlug || fetching}
      optionRender={(option) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong style={{ fontSize: '14px' }}>{option.data.title}</Text>
            <Tag color={option.data.published ? 'green' : 'orange'}>
              {option.data.published ? 'Published' : 'Draft'}
            </Tag>
          </div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            <CalendarOutlined style={{ marginRight: 4 }} />
            {moment(option.data.createdAt).format('MMM DD, YYYY')}
          </Text>
        </Space>
      )}
    />
  );
}

export default RelatedContentSelect;