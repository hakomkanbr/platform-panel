"use client";

import React, { useState } from "react";
import { Card, Space, Typography, Divider } from "antd";
import RelationSelect from "./select-xhr-relations";
import RelatedContentSelect from "./select-xhr-related-content";

const { Title, Text } = Typography;

// Test component to verify relations functionality
export default function TestRelations() {
  const [selectedRelation, setSelectedRelation] = useState<any>(null);
  const [relatedContent, setRelatedContent] = useState<any[]>([]);

  const handleRelationSelect = (relation: any) => {
    console.log("Selected relation:", relation);
    setSelectedRelation(relation);
    setRelatedContent([]);
  };

  const handleRelatedContentChange = (values: any) => {
    console.log("Selected content:", values);
    setRelatedContent(values);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <Title level={3}>Relations Test Component</Title>
        <Text type="secondary">
          This component tests the relations functionality
        </Text>
        
        <Divider />
        
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Title level={5}>1. Select Relation</Title>
            <RelationSelect
              moduleSlug="test-module" // Replace with actual module slug
              onRelationSelect={handleRelationSelect}
              style={{ width: "100%" }}
              size="large"
              placeholder="Choose relation..."
            />
          </div>

          {selectedRelation && (
            <div>
              <Title level={5}>2. Select Related Content</Title>
              <RelatedContentSelect
                relatedModuleSlug={selectedRelation.relatedModuleSlug}
                relationType={selectedRelation.relationType}
                languageSlug="en" // Replace with actual language
                onChange={handleRelatedContentChange}
                style={{ width: "100%" }}
                size="large"
              />
            </div>
          )}

          {relatedContent.length > 0 && (
            <div>
              <Title level={5}>Selected Content:</Title>
              <pre>{JSON.stringify(relatedContent, null, 2)}</pre>
            </div>
          )}
        </Space>
      </Card>
    </div>
  );
}