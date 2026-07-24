import { Alert, Flex } from "antd";
import React, { CSSProperties } from "react";

interface IError {
  title?: string;
  description?: string;
  key?: string;
}

export const WriteError: React.FC<{ errors: IError[] | IError | null, style?: CSSProperties }> = ({ errors, style }) => {
  if (errors == null) return null;
  return (
    <Flex gap={10} justify="center" style={{ flexDirection: "column", margin: "10px 0", ...style }} align="center">
      {Array.isArray(errors) ? errors?.map((item, i) => (
        <Alert style={{ width: "100%" }} showIcon banner key={i} description={item.description} message={item.title} type={"error"} />
      )) : <Alert style={{ width: "100%" }} showIcon banner description={(errors as IError)?.description} message={(errors as IError)?.title} type="error" />}
    </Flex>
  );
};
