"use client";
import React, { useState, useEffect } from "react";
import { Card, Descriptions, Tag, Typography, Space, Button, Spin, message, Rate } from "antd";
import { ArrowLeftOutlined, DeleteOutlined } from "@ant-design/icons";
import { useParams, useRouter } from "next/navigation";
import dayjs from "dayjs";
import { commentsApi } from "@/lib/api/comments";
import type { Comment } from "@/types";

const { Title, Text } = Typography;

export default function CommentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [comment, setComment] = useState<Comment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    commentsApi.list({ skip: 0, pageSize: 1000 })
      .then((res) => {
        const found = res.data.find((c) => c.id === id);
        if (found) setComment(found);
      })
      .catch(() => message.error("Failed to load comment"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    try {
      await commentsApi.delete(id);
      message.success("Comment deleted");
      router.push("/panel/comments");
    } catch { message.error("Failed to delete comment"); }
  };

  if (loading) return <div style={{ textAlign: "center", padding: 80 }}><Spin size="large" /></div>;
  if (!comment) return <div style={{ textAlign: "center", padding: 80, color: "var(--text-tertiary)" }}>Comment not found</div>;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/panel/comments")} />
        <div>
          <Title level={4} style={{ margin: 0 }}>Comment Details</Title>
        </div>
        <Tag color={comment.isApproved ? "green" : "orange"}>{comment.isApproved ? "Approved" : "Pending"}</Tag>
      </div>
      <Card style={{ maxWidth: 700 }}>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Customer Name">{comment.customerName}</Descriptions.Item>
          <Descriptions.Item label="Rating">
            <Rate disabled value={comment.rating} allowHalf />
          </Descriptions.Item>
          <Descriptions.Item label="Content">
            <Text>{comment.content}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Date">
            {comment.date ? dayjs(comment.date).format("YYYY-MM-DD HH:mm") : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={comment.isApproved ? "green" : "orange"}>{comment.isApproved ? "Approved" : "Pending"}</Tag>
          </Descriptions.Item>
        </Descriptions>
        <div style={{ marginTop: 24, display: "flex", gap: 8 }}>
          <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>Delete Comment</Button>
          <Button onClick={() => router.push("/panel/comments")}>Back to List</Button>
        </div>
      </Card>
    </div>
  );
}
