"use client";

import { useState } from "react";
import { Card, Input, Button, Typography } from "antd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";
import { IModule, IPageBlock } from "@/types/page";

const { Text } = Typography;

export default function BlocksForm({pageId}:{pageId : number}) {
  const [modules] = useState<IModule[]>([]);
  const [pageBlocks, setPageBlocks] = useState<IPageBlock[]>([]);

  const addBlock = (module: IModule) => {
    // اذا Singleton موجود مسبقًا تمنع الإضافة
    if (module.isSingleton && pageBlocks.some(b => b.moduleId === module.id)) return;

    const newBlock: IPageBlock = {
      uid: uuidv4(),
      moduleId: module.id,
      moduleSlug: module.slug,
      fields: module.fields,
      moduleName: module.name,
      isSingleton: module.isSingleton,
      order: pageBlocks.length + 1,
      fieldValues: {} // احتفظ بالقيم الحالية
    };

    setPageBlocks(prev => [...prev, newBlock]);
  };

  const removeBlock = (uid: string) => {
    setPageBlocks(prev => prev.filter(b => b.uid !== uid));
  };

  const updateValue = (uid: string, fieldSlug: string, value: string) => {
    setPageBlocks(prev =>
      prev.map(b => (b.uid === uid ? { ...b, fieldValues: { ...b.fieldValues, [fieldSlug]: value } } : b))
    );
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    setPageBlocks(prev => {
      const updated = Array.from(prev);
      const [moved] = updated.splice(result.source.index, 1);
      updated.splice(result.destination.index, 0, moved);
      return updated;
    });
  };

  const onSave = () => {
    console.log("Saved Blocks:", pageBlocks);
  };

  return (
    <div style={{ display: "flex", gap: 24, padding: 16 }}>
      {/* Left: Modules */}
      <div style={{ width: "30%", backgroundColor: "#f0f2f5", padding: 16, borderRadius: 8 }}>
        <Text strong>Available Modules</Text>
        {modules.map(m => (
          <Card
            key={m.id}
            hoverable
            style={{ marginTop: 12, cursor: "pointer", borderRadius: 8, backgroundColor: "#e6f7ff" }}
            onClick={() => addBlock(m)}
          >
            <Text>{m.name}</Text>
          </Card>
        ))}
      </div>

      {/* Right: Page Blocks */}
      <div style={{ width: "70%" }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="pageBlocks">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  minHeight: "80vh",
                  background: snapshot.isDraggingOver ? "#f0f7ff" : "#fafafa",
                  padding: 8,
                  borderRadius: 8
                }}
              >
                {pageBlocks.map((block, index) => (
                  <Draggable key={block.uid} draggableId={block.uid} index={index}>
                    {(dragProvided, dragSnapshot) => (
                      <Card
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                        title={<Text strong>{block.moduleSlug}</Text>}
                        extra={<Button danger size="small" onClick={() => removeBlock(block.uid)}>Remove</Button>}
                        style={{
                          marginBottom: 16,
                          borderRadius: 12,
                          backgroundColor: "#fffbe6",
                          boxShadow: dragSnapshot.isDragging ? "0 8px 16px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.1)",
                          transition: "box-shadow 0.2s ease"
                        }}
                      >
                        {block.fields.map(f => (
                          <Input
                            key={f.fieldSlug}
                            placeholder={f.name}
                            value={block.fieldValues[f.fieldSlug] || ""}
                            onChange={e => updateValue(block.uid, f.fieldSlug, e.target.value)}
                            style={{ marginBottom: 8, borderRadius: 6 }}
                          />
                        ))}
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
