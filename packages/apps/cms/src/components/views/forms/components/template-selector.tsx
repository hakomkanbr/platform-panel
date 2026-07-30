"use client";

import { useState } from "react";
import { 
  Modal, 
  Card, 
  Row, 
  Col, 
  Typography, 
  Input, 
  Tabs, 
  Button,
  Space,
  Tag,
  Empty
} from "antd";
import { 
  SearchOutlined, 
  FormOutlined,
  CheckOutlined
} from "@ant-design/icons";
import { formTemplates, getTemplatesByCategory, searchTemplates, FormTemplate } from "../utils/form-templates";

const { Title, Text } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;

interface TemplateSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (template: FormTemplate) => void;
}

export default function TemplateSelector({ visible, onClose, onSelect }: TemplateSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null);

  const categorizedTemplates = getTemplatesByCategory();
  const filteredTemplates = searchQuery ? searchTemplates(searchQuery) : formTemplates;

  const handleTemplateSelect = (template: FormTemplate) => {
    setSelectedTemplate(template);
  };

  const handleConfirmSelection = () => {
    if (selectedTemplate) {
      onSelect(selectedTemplate);
      onClose();
      setSelectedTemplate(null);
      setSearchQuery('');
    }
  };

  const handleCancel = () => {
    onClose();
    setSelectedTemplate(null);
    setSearchQuery('');
  };

  const renderTemplateCard = (template: FormTemplate) => (
    <Card
      key={template.id}
      hoverable
      style={{ 
        height: '100%',
        border: selectedTemplate?.id === template.id ? '2px solid #52c41a' : '1px solid #d9d9d9',
        cursor: 'pointer'
      }}
      onClick={() => handleTemplateSelect(template)}
      bodyStyle={{ padding: '16px' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>
          {template.icon || '📝'}
        </div>
        <Title level={5} style={{ margin: 0 }}>
          {template.name}
        </Title>
      </div>
      
      <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
        {template.description}
      </Text>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tag color="blue" style={{ fontSize: '10px' }}>
          {template.category}
        </Tag>
        <Text type="secondary" style={{ fontSize: '10px' }}>
          {template.fields.length} fields
        </Text>
      </div>
      
      {selectedTemplate?.id === template.id && (
        <div style={{ 
          position: 'absolute', 
          top: '8px', 
          right: '8px',
          background: '#52c41a',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <CheckOutlined style={{ color: 'white', fontSize: '12px' }} />
        </div>
      )}
    </Card>
  );

  return (
    <Modal
      title={
        <Space>
          <FormOutlined />
          <span>Choose a Form Template</span>
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      width={900}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="blank" onClick={() => onSelect({ 
          id: 'blank', 
          name: 'Blank Form', 
          description: 'Start with a blank form',
          category: 'Custom',
          fields: [] 
        })}>
          Start Blank
        </Button>,
        <Button 
          key="select" 
          type="primary" 
          disabled={!selectedTemplate}
          onClick={handleConfirmSelection}
        >
          Use This Template
        </Button>
      ]}
    >
      <div style={{ marginBottom: '16px' }}>
        <Search
          placeholder="Search templates..."
          allowClear
          enterButton={<SearchOutlined />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {searchQuery ? (
        // Show search results
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {filteredTemplates.length > 0 ? (
            <Row gutter={[16, 16]}>
              {filteredTemplates.map(template => (
                <Col xs={24} sm={12} md={8} key={template.id}>
                  {renderTemplateCard(template)}
                </Col>
              ))}
            </Row>
          ) : (
            <Empty 
              description="No templates found"
              style={{ padding: '40px' }}
            />
          )}
        </div>
      ) : (
        // Show categorized templates
        <Tabs defaultActiveKey="General" style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {Object.entries(categorizedTemplates).map(([category, templates]) => (
            <TabPane tab={`${category} (${templates.length})`} key={category}>
              <Row gutter={[16, 16]}>
                {templates.map(template => (
                  <Col xs={24} sm={12} md={8} key={template.id}>
                    {renderTemplateCard(template)}
                  </Col>
                ))}
              </Row>
            </TabPane>
          ))}
        </Tabs>
      )}

      {selectedTemplate && (
        <div style={{ 
          marginTop: '16px', 
          padding: '12px', 
          background: '#f6ffed', 
          border: '1px solid #b7eb8f',
          borderRadius: '6px'
        }}>
          <Text strong style={{ color: '#52c41a' }}>
            Selected: {selectedTemplate.name}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {selectedTemplate.description}
          </Text>
        </div>
      )}
    </Modal>
  );
}