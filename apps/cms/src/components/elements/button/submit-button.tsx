"use client";

import { Button, ButtonProps } from "antd";
import { useEffect } from "react";
import { useFormStatus } from "react-dom";

export default function SubmitBtn(props:ButtonProps) {
  const { pending } = useFormStatus();
  return (
      <Button {...props } loading={props.loading}>
          {pending ? "please wait..." : props.children}
      </Button>
  );
}
