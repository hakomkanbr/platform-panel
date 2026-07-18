"use client";

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  message, 
  Spin, 
  Modal, 
  Typography, 
  Space, 
  Badge,
  Tooltip,
  Empty,
  Input,
  Row,
  Col
} from 'antd';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { 
  DeleteOutlined, 
  SettingOutlined, 
  DragOutlined,
  PlusOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { getModules } from '@/api/repostories/modules';
import { IModule, IPageBlock, IField } from '@/types/page';
import ModuleFieldsForm from './ModuleFieldsForm';
import { getFieldsByModule } from '@/api/repostories/fields';

const { Text } = Typography;
const { Search } = Input;

interface ModuleSelectorProps {
  selectedModules: IPageBlock[];
  onModulesChange: (modules: IPageBlock[]) => void;
}

const ModuleSelector: React.FC<ModuleSelectorProps> = ({
  selectedModules,
  onModulesChange
}) => {
  const [availableModules, setAvailableModules] = useState<IModule[]>([]);
  const [filteredModules, setFilteredModules] = useState<IModule[]>([]);
  const [loading, setLoading] = useState(false);
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [currentModule, setCurrentModule] = useState<IPageBlock | null>(null);
  const [moduleInputs, setModuleInputs] = useState<IField[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadModules();
  }, []);

  useEffect(() => {
    const filtered = availableModules.filter(module =>
      module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredModules(filtered);
  }, [availableModules, searchTerm]);

  const loadModules = async () => {
    try {
      setLoading(true);
      const modules = await getModules();
      setAvailableModules(modules.data);
    } catch (error) {
      message.error('فشل في تحميل الوحدات');
    } finally {
      setLoading(false);
    }
  };

  const handleAddModule = async (moduleId: number) => {
    const addedModule = availableModules.find(m => m.id === moduleId);
    if (!addedModule) return;

    // التحقق من أن الوحدة singleton لا تُضاف أكثر من مرة
    if (addedModule.isSingleton && selectedModules.some(m => m.moduleId === moduleId)) {
      message.warning('هذه الوحدة يمكن إضافتها مرة واحدة فقط');
      return;
    }

    console.info("module => ", addedModule);

    const newModule: IPageBlock = {
      uid: `${moduleId}-${Date.now()}`,
      moduleId: addedModule.id,
      moduleName: addedModule.name,
      moduleSlug: addedModule.slug,
      isSingleton: addedModule.isSingleton,
      order: selectedModules.length,
      fields : addedModule.fields,
      fieldValues: {}
    };

    // إذا كانت الوحدة singleton، فتح نموذج إدخال القيم
    if (addedModule.isSingleton) {
      try {
        setModuleInputs(addedModule.fields);
        setCurrentModule(newModule);
        setConfigModalVisible(true);
      } catch (error) {
        message.error('فشل في تحميل حقول الوحدة');
      }
    } else {
      // إضافة الوحدة مباشرة بدون قيم
      onModulesChange([...selectedModules, newModule]);
    }
  };

  const handleRemoveModule = (moduleId: string) => {
    const updatedModules = selectedModules.filter(m => m.uid.toString() !== moduleId);
    onModulesChange(updatedModules);
  };

  const handleConfigureModule = async (module: IPageBlock) => {
    try {
      const fields : IField[] = await getFieldsByModule(module.moduleId);
      setModuleInputs(fields.map((item)=>({...item,fieldType: item.fieldType.toLowerCase()})));
      setCurrentModule(module);
      setConfigModalVisible(true);
    } catch (error) {
      message.error('فشل في تحميل حقول الوحدة');
    }
  };

  const handleSaveModuleConfig = (fieldValues: Record<string, any>) => {
    if (!currentModule) return;

    console.info("selectedModules => " , selectedModules);
    console.info("Field Value => " , fieldValues);

    const updatedModules = selectedModules.map(m => 
      m.uid === currentModule.uid 
        ? { ...m, fieldValues }
        : m
    );

    if (!selectedModules.find(m => m.uid === currentModule.uid)) {
      updatedModules.push({ ...currentModule, fieldValues });
    }

    onModulesChange(updatedModules);
    setConfigModalVisible(false);
    setCurrentModule(null);
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    // إذا كان المصدر والوجهة نفس المكان
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // السحب من Available units إلى المختارة
    if (source.droppableId === 'available-modules' && destination.droppableId === 'selected-modules') {
      const moduleId = parseInt(draggableId.replace('available-', ''));
      const m = availableModules.find(m => m.id === moduleId);
      
      if (!m) return;

      // التحقق من Singleton
      if (m.isSingleton && selectedModules.some(m => m.moduleId === m.id)) {
        message.warning('هذه الوحدة يمكن إضافتها مرة واحدة فقط');
        return;
      }

      const newModule: IPageBlock = {
        uid: `${m.id}-${Date.now()}`,
        moduleId: m.id,
        moduleName: m.name,
        moduleSlug: m.slug,
        fields : m.fields || [],
        isSingleton: m.isSingleton,
        order: destination.index,
        fieldValues: {}
      };

      const newSelectedModules = Array.from(selectedModules);
      newSelectedModules.splice(destination.index, 0, newModule);

      // إعادة ترقيم الوحدات
      const reorderedModules = newSelectedModules.map((mod, index) => ({
        ...mod,
        order: index
      }));

      onModulesChange(reorderedModules);

      // إذا كانت الوحدة singleton، فتح نموذج التكوين
      if (m.isSingleton) {
        setTimeout(() => {
          setModuleInputs(m.fields || []);
          setCurrentModule(newModule);
          setConfigModalVisible(true);
        }, 100);
      }
    }
    // إعادة ترتيب Selected units
    else if (source.droppableId === 'selected-modules' && destination.droppableId === 'selected-modules') {
      const reorderedModules = Array.from(selectedModules);
      const [reorderedItem] = reorderedModules.splice(source.index, 1);
      reorderedModules.splice(destination.index, 0, reorderedItem);

      // تحديث ترقيم الوحدات
      const updatedModules = reorderedModules.map((module, index) => ({
        ...module,
        order: index
      }));

      onModulesChange(updatedModules);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">جاري تحميل الوحدات...</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="module-selector-container">
      <DragDropContext onDragEnd={onDragEnd}>
        <Row gutter={24} style={{ height: '70vh' }}>
          {/* Available Modules Panel */}
          <Col span={12}>
            <Card 
              className="available-modules-panel"
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <AppstoreOutlined style={{ color: '#1890ff' }} />
                  <span>Available units</span>
                  <Badge count={filteredModules.length} style={{ backgroundColor: '#1890ff' }} />
                </div>
              }
              style={{ height: '100%' }}
              bodyStyle={{ padding: 0, height: 'calc(100% - 57px)' }}
            >
              <div style={{ padding: '16px 16px 0' }}>
                <Search
                  placeholder="البحث في الوحدات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ marginBottom: 16 }}
                  prefix={<SearchOutlined />}
                />
              </div>
              
              <Droppable droppableId="available-modules" isDropDisabled={true}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="available-modules-list"
                    style={{ 
                      height: 'calc(100% - 80px)', 
                      overflowY: 'auto',
                      padding: '0 16px 16px'
                    }}
                  >
                    {filteredModules.length === 0 ? (
                      <Empty 
                        description="لا توجد وحدات متاحة"
                        style={{ marginTop: 40 }}
                      />
                    ) : (
                      filteredModules.map((module, index) => {
                        const isDisabled = module.isSingleton && selectedModules.some(m => m.moduleId === module.id);
                        return (
                          <Draggable 
                            key={`available-${module.id}`} 
                            draggableId={`available-${module.id}`} 
                            index={index}
                            isDragDisabled={isDisabled}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`available-module-item ${isDisabled ? 'disabled' : ''} ${snapshot.isDragging ? 'dragging' : ''}`}
                                style={{
                                  ...provided.draggableProps.style,
                                  marginBottom: 12,
                                }}
                              >
                                <Card 
                                  size="small"
                                  className="module-card"
                                  style={{
                                    opacity: isDisabled ? 0.5 : 1,
                                    cursor: isDisabled ? 'not-allowed' : 'grab',
                                    border: snapshot.isDragging ? '2px solid #1890ff' : '1px solid #e8e8e8',
                                    transform: snapshot.isDragging ? 'rotate(5deg)' : 'none',
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <DragOutlined style={{ color: '#8c8c8c', fontSize: 16 }} />
                                    <div style={{ flex: 1 }}>
                                      <div style={{ fontWeight: 600, fontSize: 14 }}>
                                        {module.name}
                                      </div>
                                      <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                                        {module.slug}
                                      </div>
                                    </div>
                                    {module.isSingleton && (
                                      <Badge text="Singleton" color="blue" />
                                    )}
                                    <ArrowRightOutlined style={{ color: '#1890ff' }} />
                                  </div>
                                </Card>
                              </div>
                            )}
                          </Draggable>
                        );
                      })
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Card>
          </Col>

          {/* Selected Modules Panel */}
          <Col span={12}>
            <Card 
              className="selected-modules-panel"
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <DragOutlined style={{ color: '#52c41a' }} />
                  <span>Selected units</span>
                  <Badge count={selectedModules.length} style={{ backgroundColor: '#52c41a' }} showZero />
                </div>
              }
              extra={
                selectedModules.length > 0 && (
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    اسحب لإعادة الترتيب
                  </Text>
                )
              }
              style={{ height: '100%' }}
              bodyStyle={{ padding: 0, height: 'calc(100% - 57px)' }}
            >
              <Droppable droppableId="selected-modules">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`selected-modules-list ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
                    style={{ 
                      height: '100%',
                      overflowY: 'auto',
                      padding: '16px',
                      backgroundColor: snapshot.isDraggingOver ? '#f6ffed' : 'transparent',
                      border: snapshot.isDraggingOver ? '2px dashed #52c41a' : '2px dashed transparent',
                      borderRadius: 8,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {selectedModules.length === 0 ? (
                      <div className="empty-drop-zone">
                        <Empty
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          description={
                            <div>
                              <Text type="secondary">اسحب الوحدات هنا</Text>
                              <br />
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                من القائمة اليسرى لإضافتها للصفحة
                              </Text>
                            </div>
                          }
                          style={{ 
                            padding: '60px 20px',
                            border: '2px dashed #d9d9d9',
                            borderRadius: 8,
                            marginTop: 40
                          }}
                        />
                      </div>
                    ) : (
                      selectedModules.map((module, index) => (
                        <Draggable key={module.uid} draggableId={module.uid.toString()} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`selected-module-item ${snapshot.isDragging ? 'dragging' : ''}`}
                              style={{
                                ...provided.draggableProps.style,
                                marginBottom: 12,
                              }}
                            >
                              <Card
                                size="small"
                                className="module-card selected"
                                style={{
                                  backgroundColor: snapshot.isDragging ? '#f6ffed' : 'white',
                                  border: snapshot.isDragging ? '2px solid #52c41a' : '1px solid #e8e8e8',
                                  borderRadius: 8,
                                  boxShadow: snapshot.isDragging 
                                    ? '0 8px 24px rgba(82, 196, 26, 0.3)' 
                                    : '0 2px 8px rgba(0, 0, 0, 0.06)',
                                  transform: snapshot.isDragging ? 'rotate(-3deg)' : 'none',
                                  transition: snapshot.isDragging ? 'none' : 'all 0.3s ease',
                                  cursor: 'grab'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                  <div 
                                    {...provided.dragHandleProps}
                                    style={{ 
                                      display: 'flex', 
                                      alignItems: 'center',
                                      cursor: 'grab',
                                      padding: '6px',
                                      borderRadius: '4px',
                                      backgroundColor: '#f0f0f0'
                                    }}
                                  >
                                    <DragOutlined style={{ color: '#8c8c8c', fontSize: 14 }} />
                                  </div>
                                  
                                  <Badge 
                                    count={index + 1} 
                                    style={{ 
                                      backgroundColor: '#52c41a',
                                      fontSize: '11px',
                                      minWidth: '22px',
                                      height: '22px',
                                      lineHeight: '22px'
                                    }} 
                                  />
                                  
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>
                                      {module.moduleName}
                                    </div>
                                    <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                                      {module.moduleSlug}
                                    </div>
                                    
                                    {module.isSingleton && (
                                      <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 6,
                                        marginTop: 8,
                                        padding: '4px 8px',
                                        backgroundColor: module.fieldValues && Object.keys(module.fieldValues).length > 0 ? '#f6ffed' : '#fff7e6',
                                        borderRadius: '4px',
                                        fontSize: 11
                                      }}>
                                        {module.fieldValues && Object.keys(module.fieldValues).length > 0 ? (
                                          <>
                                            <CheckCircleOutlined style={{ color: '#52c41a' }} />
                                            <span style={{ color: '#52c41a' }}>مُكوّن</span>
                                          </>
                                        ) : (
                                          <>
                                            <ExclamationCircleOutlined style={{ color: '#faad14' }} />
                                            <span style={{ color: '#faad14' }}>يحتاج تكوين</span>
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div style={{ display: 'flex', gap: 4 }}>
                                    {module.isSingleton && (
                                      <Tooltip title="تكوين الحقول">
                                        <Button
                                          type="text"
                                          size="small"
                                          icon={<SettingOutlined />}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleConfigureModule(module);
                                          }}
                                          style={{ 
                                            color: '#1890ff',
                                            borderRadius: '4px'
                                          }}
                                        />
                                      </Tooltip>
                                    )}
                                    <Tooltip title="حذف الوحدة">
                                      <Button
                                        type="text"
                                        size="small"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRemoveModule(module.uid.toString());
                                        }}
                                        style={{ 
                                          borderRadius: '4px'
                                        }}
                                      />
                                    </Tooltip>
                                  </div>
                                </div>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Card>
          </Col>
        </Row>
      </DragDropContext>

      {/* Configuration Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <SettingOutlined style={{ color: '#1890ff' }} />
            <div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>
                تكوين وحدة: {currentModule?.moduleName}
              </div>
              <div style={{ fontSize: '12px', color: '#8c8c8c', fontWeight: 400 }}>
                {currentModule?.moduleSlug}
              </div>
            </div>
          </div>
        }
        open={configModalVisible}
        onCancel={() => {
          setConfigModalVisible(false);
          setCurrentModule(null);
        }}
        footer={null}
        width={900}
        centered
        destroyOnClose
        className="module-config-modal"
        styles={{
          header: {
            borderBottom: '1px solid #f0f0f0',
            paddingBottom: 16,
            marginBottom: 24
          },
          body: {
            padding: '24px'
          }
        }}
      >
        {currentModule && (
          <div>
            <div style={{ 
              marginBottom: 24, 
              padding: '12px 16px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              <Text type="secondary" style={{ fontSize: '13px' }}>
                قم بتكوين الحقول المطلوبة لهذه الوحدة. جميع الحقول المطلوبة يجب ملؤها قبل الحفظ.
              </Text>
            </div>
            
            <ModuleFieldsForm
              inputs={moduleInputs}
              initialValues={currentModule.fieldValues || {}}
              onSave={handleSaveModuleConfig}
              onCancel={() => {
                setConfigModalVisible(false);
                setCurrentModule(null);
              }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ModuleSelector;