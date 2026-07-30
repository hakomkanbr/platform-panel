import api_points from "@/api/points";
import DtDelete from "@/components/elements/table/actions_container";
import DtActionContainer from "@/components/elements/table/actions_delete";
import DtEdit from "@/components/elements/table/actions_edit";
import DtSwitch from "@/components/elements/table/actions_switch";
import route_paths from "@/helper/route_paths";
import { TableProps } from "antd";
import Link from "next/link";

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
            return <DtSwitch url={api_points.pages.changeState} id={record["id"]} value={value} />
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
                <DtDelete url={api_points.pages.delete} data={record} />
                <DtEdit data={record} url={`${route_paths.pages}/edit?id=${value}`} />
            </DtActionContainer>)
        },
    }
];

export default columns;