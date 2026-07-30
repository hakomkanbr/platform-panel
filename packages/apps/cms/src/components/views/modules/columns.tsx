"use client";;
import api_points from "@/api/points";
import DtDelete from "@/components/elements/table/actions_container";
import DtActionContainer from "@/components/elements/table/actions_delete";
import DtEdit from "@/components/elements/table/actions_edit";
import DtSwitch from "@/components/elements/table/actions_switch";
import route_paths from "@/helper/route_paths";
import { Badge, TableProps } from "antd";
import Link from "next/link";

const columns: TableProps["columns"] = [
    {
        title: "Name",
        dataIndex: "name",
    },
    {
        title: "Description",
        dataIndex: "description",
    },
    {
        title: "Is Singleton",
        dataIndex: "isSingleton",
        render(value) {
            return value ? (
                <Badge status="success" text="Singleton" />
            ) : (
                <Badge status="processing" text="Transient" />
            );
        },
    },
    {
        title: "Feilds",
        dataIndex: "id",
        align: "right",
        render(value) {
            return <Link href={`${route_paths.modules}/detail/${value}`}>Feilds</Link>
        },
    },
    {
        title: "Actions",
        width: 90,
        dataIndex: "id",
        align: "right",
        render(value: any, record: any, _: any) {
            return (<DtActionContainer>
                <DtDelete url={api_points.module.delete} data={record} />
                <DtEdit data={record} url={`${route_paths.modules}/edit`} />
            </DtActionContainer>)
        },
    }
];

export default columns;