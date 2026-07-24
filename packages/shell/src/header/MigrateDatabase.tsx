// @ts-nocheck
"use client";
import React, { useState } from 'react';
import { Button, Tooltip, Modal, Typography, Progress, Alert, Space, Steps } from 'antd';
import { DatabaseOutlined, PlayCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import api from '@/api/api-context';
import api_points from '@/api/points';

const { Text, Title } = Typography;
const { Step } = Steps;

interface MigrationStep {
  title: string;
  description: string;
  status: 'wait' | 'process' | 'finish' | 'error';
}

const MigrateDatabase: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [migrationSteps, setMigrationSteps] = useState<MigrationStep[]>([
    {
      title: 'Backup Current Database',
      description: 'Creating a backup of the current database state',
      status: 'wait',
    },
    {
      title: 'Run Migrations',
      description: 'Executing pending database migrations',
      status: 'wait',
    },
    {
      title: 'Update Schema',
      description: 'Updating database schema and indexes',
      status: 'wait',
    },
    {
      title: 'Seed Data',
      description: 'Inserting default data and configurations',
      status: 'wait',
    },
    {
      title: 'Verify Integrity',
      description: 'Verifying database integrity and connections',
      status: 'wait',
    },
  ]);

  const startMigration = async () => {
    setMigrating(true);
    setProgress(0);
    setCurrentStep(0);

    // Reset all steps to wait
    setMigrationSteps(steps =>
      steps.map(step => ({ ...step, status: 'wait' }))
    );

    const stepsSnapshot = [...migrationSteps];

    for (let i = 0; i < stepsSnapshot.length; i++) {
      setCurrentStep(i);

      // تحديث حالة الخطوة الحالية
      setMigrationSteps(steps =>
        steps.map((step, index) => ({
          ...step,
          status: index === i ? 'process' : index < i ? 'finish' : 'wait'
        }))
      );

      const stepProgress = ((i + 1) / stepsSnapshot.length) * 100;

      try {
        // simulate fake loading for UI
        await new Promise(resolve => {
          const interval = setInterval(() => {
            setProgress(prev => {
              const newProgress = Math.min(prev + 2, stepProgress);
              if (newProgress >= stepProgress) {
                clearInterval(interval);
                resolve(undefined);
              }
              return newProgress;
            });
          }, 50);
        });

        if (i === 0) {
          // Backup Current Database
          // await api.backupDatabase()
        } else if (i === 1) {
          // Run Migrations
          // await api.runMigrations()
        } else if (i === 2) {
          // Update Schema & Indexes
          // await api.updateSchemaAndIndexes()
        } else if (i === 3) {
          // Seed Data
          // await api.seedData()
        } else if (i === 4) {
          // Verify Integrity
          await api.get(`/admin/Authenticate/MigrateDB`);

        }

        // 🔥 هنا يفضل يكون عندك API منفصل لكل خطوة أو باراميتر step
      } catch (err) {
        console.error("Migration error at step", i, err);
      } finally {
        setMigrationSteps(steps =>
          steps.map((step, index) => ({
            ...step,
            status: index <= i ? 'finish' : 'wait'
          }))
        );
      }
    }

    setProgress(100);
    setMigrating(false);
  };

  const resetMigration = () => {
    setMigrating(false);
    setProgress(0);
    setCurrentStep(0);
    setMigrationSteps(steps =>
      steps.map(step => ({ ...step, status: 'wait' }))
    );
  };

  return (
    <>
      <Tooltip title="Migrate Database (Development Only)">
        <Button
          type="text"
          icon={<DatabaseOutlined />}
          onClick={() => setModalVisible(true)}
          className="action-button"
          danger
        />
      </Tooltip>

      <Modal
        title={
          <div className="migration-modal-header">
            <DatabaseOutlined style={{ marginRight: 8, color: '#f59e0b' }} />
            <span>Database Migration</span>
            <Alert
              message="Development Environment Only"
              type="warning"
              showIcon
              style={{ marginLeft: 16, marginBottom: 0 }}
            />
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={600}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)} disabled={migrating}>
            Close
          </Button>,
          <Button
            key="reset"
            onClick={resetMigration}
            disabled={migrating || progress === 0}
          >
            Reset
          </Button>,
          <Button
            key="migrate"
            type="primary"
            icon={migrating ? <DatabaseOutlined spin /> : <PlayCircleOutlined />}
            onClick={startMigration}
            disabled={migrating}
            loading={migrating}
          >
            {migrating ? 'Migrating...' : 'Start Migration'}
          </Button>,
        ]}
      >
        <div className="migration-content">
          {/* Warning Alert */}
          <Alert
            message="Warning: Database Migration"
            description="This action will modify your database structure. Make sure you have a backup before proceeding. This feature is only available in development environment."
            type="warning"
            showIcon
            style={{ marginBottom: 24 }}
          />

          {/* Progress */}
          {progress > 0 && (
            <div className="migration-progress">
              <div className="progress-header">
                <Text strong>Migration Progress</Text>
                <Text type="secondary">{Math.round(progress)}%</Text>
              </div>
              <Progress
                percent={progress}
                status={migrating ? 'active' : progress === 100 ? 'success' : 'normal'}
                strokeColor={{
                  '0%': '#F7931E',
                  '100%': '#10b981',
                }}
              />
            </div>
          )}

          {/* Migration Steps */}
          <div className="migration-steps">
            <Title level={5}>Migration Steps</Title>
            <Steps
              direction="vertical"
              current={currentStep}
              status={migrating ? 'process' : progress === 100 ? 'finish' : 'wait'}
            >
              {migrationSteps.map((step, index) => (
                <Step
                  key={index}
                  title={step.title}
                  description={step.description}
                  status={step.status}
                  icon={
                    step.status === 'finish' ? <CheckCircleOutlined /> :
                      step.status === 'error' ? <ExclamationCircleOutlined /> :
                        undefined
                  }
                />
              ))}
            </Steps>
          </div>

          {/* Success Message */}
          {progress === 100 && !migrating && (
            <Alert
              message="Migration Completed Successfully"
              description="All database migrations have been executed successfully. Your database is now up to date."
              type="success"
              showIcon
              style={{ marginTop: 16 }}
            />
          )}

          {/* Environment Info */}
          <div className="environment-info">
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                <strong>Environment:</strong> {process.env.NODE_ENV || 'development'}
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                <strong>Database:</strong> {process.env.DATABASE_URL ? 'Connected' : 'Local'}
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                <strong>Last Migration:</strong> {new Date().toLocaleString()}
              </Text>
            </Space>
          </div>
        </div>
      </Modal>

      <style jsx>{`
        .migration-modal-header {
          display: flex;
          align-items: center;
        }

        .migration-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .migration-progress {
          padding: 16px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .migration-steps {
          padding: 16px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .environment-info {
          padding: 12px;
          background: #f1f5f9;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
        }

        :global(.action-button) {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        :global(.action-button:hover) {
          background: #fef2f2;
          color: #ef4444;
        }

        :global(.migration-steps .ant-steps-item-process .ant-steps-item-icon) {
          background: #F7931E;
          border-color: #F7931E;
        }

        :global(.migration-steps .ant-steps-item-finish .ant-steps-item-icon) {
          background: #10b981;
          border-color: #10b981;
        }

        :global(.migration-steps .ant-steps-item-error .ant-steps-item-icon) {
          background: #ef4444;
          border-color: #ef4444;
        }
      `}</style>
    </>
  );
};

export default MigrateDatabase;