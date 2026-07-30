import { Button, ButtonProps } from "antd";

export default function EButton(props:ButtonProps) {
    return (
        <Button {...props }>
            {props.children}
        </Button>
    );
}
