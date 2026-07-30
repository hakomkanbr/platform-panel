"use client";

import api_points from "@/api/points";
import DtDelete from "@/components/elements/table/actions_container";
import DtActionContainer from "@/components/elements/table/actions_delete";
import DtEdit from "@/components/elements/table/actions_edit";
import DtSwitch from "@/components/elements/table/actions_switch";
import route_paths from "@/helper/route_paths";
import { TableProps } from "antd";

const columns: TableProps["columns"] = [
    {
        title: "Name",
        dataIndex: "name",
    },
    {
        title: "Publish State",
        dataIndex: "published",
        align: "right",
        width: 100,
        render(value: any, record: any, _: any) {
            return <DtSwitch url={api_points.webSite.changeState} id={record["id"]} value={value} />
        },
    },
    {
        title: "Actions",
        width: 90,
        dataIndex: "id",
        align: "right",
        render(value: any, record: any, _: any) {
            return (<DtActionContainer>
                <DtDelete url={api_points.webSite.delete} data={record} />
                <DtEdit data={record} url={`${route_paths.webSites}/edit`} />
            </DtActionContainer>)
        },
    }
];

export default columns;