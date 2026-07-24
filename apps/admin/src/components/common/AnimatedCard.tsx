"use client";

import React from "react";
import { Card } from "antd";
import { motion } from "framer-motion";
import type { CardProps } from "antd";

interface AnimatedCardProps extends CardProps {
  index?: number;
  glass?: boolean;
  hoverable?: boolean;
}

export default function AnimatedCard({
  children,
  index = 0,
  glass = false,
  hoverable = true,
  style,
  ...props
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={hoverable ? { y: -3, transition: { duration: 0.2 } } : undefined}
      whileTap={hoverable ? { scale: 0.995 } : undefined}
      style={{ height: "100%" }}
    >
      <Card
        {...props}
        className={glass ? "glass-card" : undefined}
        style={{
          borderRadius: 16,
          border: "1px solid var(--border-light)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          transition: "all 0.25s ease",
          ...style,
        }}
      >
        {children}
      </Card>
    </motion.div>
  );
}
