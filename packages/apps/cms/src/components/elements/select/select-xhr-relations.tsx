"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Select, Spin, Form, Space, Typography, Alert } from "antd";
import type { SelectProps } from "antd/es/select";
import debounce from "lodash/debounce";
import api from "@/api/api-context";
import api_points from "@/api/points";
import { DatabaseOutlined, LinkOutlined } from "@ant-design/icons";
import { RelationType } from "@/components/views/relations/create-update";

const { Text } = Typography;

export interface RelationSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, "options" | "children"> {
  moduleSlug: string;
  onRelationSelect?: (relation: any) => void;
  debounceTimeout?: number;
}

export interface RelationOption {
  key?: string;
  label: React.ReactNode;
  value: string | number;
  relationType: number;
  relatedModuleSlug: string;
  relatedModuleName: string;
}

function RelationSelect<ValueType extends RelationOption = RelationOption>({
  moduleSlug,
  onRelationSelect,
  debounceTimeout = 800,
  ...props
}: RelationSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const [selectedRelation, setSelectedRelation] = useState<any>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const fetchRef = useRef(0);

  const fetchRelations = useCallback(async (): Promise<ValueType[]> => {
    try {
      const response = await api.get(`${api_points.relation.getAll}?moduleSlug=${moduleSlug}`);
      const relations = response.data?.data || [];
      
      return relations.map((relation: any) => ({
        key: relation.id,
        label: `${relation.name} (${getRelationTypeText(relation.relationType)} → ${relation.relatedModuleName})`,
        value: relation.id,
        relationType: relation.relationType,
        relatedModuleSlug: relation.relatedModuleSlug,
        relatedModuleName: relation.relatedModuleName,
        name: relation.name,
        ...relation
      })) as ValueType[];
    } catch (error) {
      console.error('Failed to fetch relations:', error);
      return [];
    }
  }, [moduleSlug]);

  const getRelationTypeText = (type: number | string): string => {
    // Handle both string and number types
    if (typeof type === 'number') {
      switch (type) {
        case 1: return "One-to-One";
        case 2: return "One-to-Many";
        case 3: return "Many-to-Many";
        default: return "Unknown";
      }
    } else {
      switch (type) {
        case "OneToOne": return "One-to-One";
        case "OneToMany": return "One-to-Many";
        case "ManyToMany": return "Many-to-Many";
        default: return "Unknown";
      }
    }
  };

  const debounceFetcher = useMemo(() => {
    const loadOptions = () => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchRelations().then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          return;
        }
        setOptions(newOptions);
        setFetching(false);
        setHasLoaded(true);
      });
    };
    return debounce(loadOptions, debounceTimeout);
  }, [moduleSlug, debounceTimeout, fetchRelations]);

  useEffect(() => {
    if (moduleSlug && !hasLoaded && !fetching) {
      debounceFetcher();
    }
  }, [moduleSlug, hasLoaded, fetching, debounceFetcher]);

  // Reset when moduleSlug changes
  useEffect(() => {
    setHasLoaded(false);
    setOptions([]);
    setSelectedRelation(null);
  }, [moduleSlug]);

  const handleChange = (value: any, option: any) => {
    setSelectedRelation(option);
    if (onRelationSelect && option) {
      onRelationSelect(option);
    }
    if (props.onChange) {
      props.onChange(value, option);
    }
  };

  return (
    <div>
      <Select
        labelInValue
        filterOption={false}
        placeholder="Select a relation..."
        notFoundContent={fetching ? <Spin size="small" /> : "No relations found"}
        {...props}
        onChange={handleChange}
        suffixIcon={<DatabaseOutlined />}
        optionRender={(option) => (
          <Space>
            <LinkOutlined style={{ color: '#3b82f6' }} />
            <div>
              <Text strong style={{ fontSize: '14px' }}>{option.data.label}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {getRelationTypeText(option.data.relationType)} → {option.data.relatedModuleName}
              </Text>
            </div>
          </Space>
        )}
        options={options}
      />
      
      {selectedRelation && (
        <Alert
          message={`Selected: ${getRelationTypeText(selectedRelation.relationType)} relation`}
          description={`This will load content from "${selectedRelation.relatedModuleName}" module`}
          type="info"
          showIcon
          style={{ marginTop: 8 }}
        />
      )}
    </div>
  );
}

export default RelationSelect;