import { Card } from "antd";
import { CardProps } from "antd/es/card";

export default function ECard(props: CardProps) {
    return (
        <Card {...props}>
            {props.children}
        </Card>
    );
}
