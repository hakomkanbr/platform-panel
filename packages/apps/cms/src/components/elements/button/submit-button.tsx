"use client";

import { Button, ButtonProps } from "antd";

export default function SubmitBtn(props:ButtonProps) {
  return (
      <Button {...props} loading={props.loading}>
          {props.loading ? "please wait..." : props.children}
      </Button>
  );
}
