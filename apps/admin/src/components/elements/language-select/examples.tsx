// Language Select Component Usage Examples

import React from 'react';
import { Card, Space, Typography, Divider } from 'antd';
import LanguageSelect from './index';

const { Title, Text } = Typography;

export default function LanguageSelectExamples() {
  const handleLanguageChange = (e: any) => {
    console.log('Language changed to:', e.key);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2}>Language Select Component Examples</Title>
      
      {/* Default Variant */}
      <Card title="Default Variant" style={{ marginBottom: '24px' }}>
        <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
          Full-featured variant with label, value, and language counter badge.
        </Text>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text strong>Small Size:</Text>
            <div style={{ width: '300px', marginTop: '8px' }}>
              <LanguageSelect
                title="Choose Language"
                size="small"
                variant="default"
                onClick={handleLanguageChange}
                singleItem={null}
              />
            </div>
          </div>
          
          <div>
            <Text strong>Default Size:</Text>
            <div style={{ width: '300px', marginTop: '8px' }}>
              <LanguageSelect
                title="Choose Language"
                size="default"
                variant="default"
                onClick={handleLanguageChange}
                singleItem={null}
              />
            </div>
          </div>
          
          <div>
            <Text strong>Large Size:</Text>
            <div style={{ width: '300px', marginTop: '8px' }}>
              <LanguageSelect
                title="Choose Language"
                size="large"
                variant="default"
                onClick={handleLanguageChange}
                singleItem={null}
              />
            </div>
          </div>
        </Space>
      </Card>

      {/* Compact Variant */}
      <Card title="Compact Variant" style={{ marginBottom: '24px' }}>
        <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
          Streamlined design perfect for toolbars and headers.
        </Text>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text strong>Small Compact:</Text>
            <div style={{ width: '200px', marginTop: '8px' }}>
              <LanguageSelect
                title="Language"
                size="small"
                variant="compact"
                onClick={handleLanguageChange}
                singleItem={null}
              />
            </div>
          </div>
          
          <div>
            <Text strong>Default Compact:</Text>
            <div style={{ width: '200px', marginTop: '8px' }}>
              <LanguageSelect
                title="Language"
                size="default"
                variant="compact"
                onClick={handleLanguageChange}
                singleItem={null}
              />
            </div>
          </div>
          
          <div>
            <Text strong>Large Compact:</Text>
            <div style={{ width: '200px', marginTop: '8px' }}>
              <LanguageSelect
                title="Language"
                size="large"
                variant="compact"
                onClick={handleLanguageChange}
                singleItem={null}
              />
            </div>
          </div>
        </Space>
      </Card>

      {/* Minimal Variant */}
      <Card title="Minimal Variant" style={{ marginBottom: '24px' }}>
        <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
          Text-only button for subtle integration in navigation bars.
        </Text>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text strong>Small Minimal:</Text>
            <div style={{ marginTop: '8px' }}>
              <LanguageSelect
                title="EN"
                size="small"
                variant="minimal"
                onClick={handleLanguageChange}
                singleItem={null}
              />
            </div>
          </div>
          
          <div>
            <Text strong>Default Minimal:</Text>
            <div style={{ marginTop: '8px' }}>
              <LanguageSelect
                title="English"
                size="default"
                variant="minimal"
                onClick={handleLanguageChange}
                singleItem={null}
              />
            </div>
          </div>
          
          <div>
            <Text strong>Large Minimal:</Text>
            <div style={{ marginTop: '8px' }}>
              <LanguageSelect
                title="English"
                size="large"
                variant="minimal"
                onClick={handleLanguageChange}
                singleItem={null}
              />
            </div>
          </div>
        </Space>
      </Card>

      {/* Usage in Different Contexts */}
      <Card title="Usage in Different Contexts">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          
          {/* Header Context */}
          <div>
            <Text strong>In Page Header:</Text>
            <div style={{ 
              background: '#f8fafc', 
              padding: '16px', 
              borderRadius: '8px',
              marginTop: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Title level={4} style={{ margin: 0 }}>Content Management</Title>
              <LanguageSelect
                title="Language"
                size="small"
                variant="compact"
                onClick={handleLanguageChange}
                singleItem={null}
              />
            </div>
          </div>

          {/* Sidebar Context */}
          <div>
            <Text strong>In Sidebar:</Text>
            <div style={{ 
              background: '#ffffff', 
              border: '1px solid #e2e8f0',
              padding: '20px', 
              borderRadius: '8px',
              marginTop: '8px',
              width: '280px'
            }}>
              <Title level={5}>Settings</Title>
              <LanguageSelect
                title="Choose Language"
                size="default"
                variant="default"
                onClick={handleLanguageChange}
                singleItem={null}
              />
            </div>
          </div>

          {/* Navigation Context */}
          <div>
            <Text strong>In Navigation Bar:</Text>
            <div style={{ 
              background: '#1f2937', 
              padding: '12px 20px', 
              borderRadius: '8px',
              marginTop: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Text style={{ color: 'white', fontWeight: 600 }}>Admin Panel</Text>
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '6px', padding: '4px' }}>
                <LanguageSelect
                  title="EN"
                  size="small"
                  variant="minimal"
                  onClick={handleLanguageChange}
                  singleItem={null}
                />
              </div>
            </div>
          </div>

        </Space>
      </Card>
    </div>
  );
}

// Example of custom single item display
export const CustomSingleItemExample = () => {
  const customSingleItem = (
    <div style={{ 
      padding: '8px 12px', 
      background: '#f0f9ff', 
      border: '1px solid #0ea5e9',
      borderRadius: '6px',
      color: '#0c4a6e',
      fontWeight: 500
    }}>
      🌐 Only English Available
    </div>
  );

  return (
    <LanguageSelect
      title="Language"
      singleItem={customSingleItem}
      onClick={() => {}}
    />
  );
};

// Example with loading state
export const LoadingStateExample = () => {
  return (
    <div className="language-select-loading">
      <LanguageSelect
        title="Loading..."
        size="default"
        variant="default"
        onClick={() => {}}
        singleItem={null}
      />
    </div>
  );
};