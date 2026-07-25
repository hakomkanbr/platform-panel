"use client";

import ILanguage from "@/abstracts/language";
import api_points from "@/api/points";
import DtLanguage from "@/components/elements/table/action_language";
import DtDelete from "@/components/elements/table/actions_container";
import DtActionContainer from "@/components/elements/table/actions_delete";
import DtEdit from "@/components/elements/table/actions_edit";
import DtEditModal from "@/components/elements/table/actions_edit_modal";
import DtSwitch from "@/components/elements/table/actions_switch";
import { IColumn, IColumnEnum } from "@/components/elements/table/type";
import route_paths from "@/helper/route_paths";
import { TableProps } from "antd";

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
        title: "Language",
        dataIndex: "language",
        align: "right",
        width: 50,
        render: (language: ILanguage, record: any) => (
            <DtLanguage value={language?.slug || record?.languageCode || ""} />
        ),
    },
    {
        title: "Publish State",
        dataIndex: "published",
        align: "right",
        width: 100,
        render(value: any, record: any, _: any) {
            return <DtSwitch url={api_points.category.changeState} id={record["id"]} value={value} />
        },
    },
    {
        title: "Actions",
        width: 90,
        dataIndex: "id",
        align: "right",
        render(value: any, record: any, _: any) {
            return (<DtActionContainer>
                <DtDelete url={api_points.category.delete} data={record} />
                <DtEditModal data={record} />
            </DtActionContainer>)
        },
    }
];

export default columns;