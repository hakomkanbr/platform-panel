"use client";

import api_points from "@/api/points";
import DtLanguage from "@/components/elements/table/action_language";
import DtDelete from "@/components/elements/table/actions_container";
import DtActionContainer from "@/components/elements/table/actions_delete";
import DtEdit from "@/components/elements/table/actions_edit";
import { IColumn, IColumnEnum } from "@/components/elements/table/type";
import route_paths from "@/helper/route_paths";
import { TableProps, Tag } from "antd";
import ILanguage from "@/abstracts/language";
import DtSwitch from "@/components/elements/table/actions_switch";



export const cols: TableProps["columns"] = [
  {
    title: "Categories",
    dataIndex: "categories",
    render: (value) => {
      if (Array.isArray(value)) {
        return <>
          {
            value.map((item, index) => <Tag key={index} className="flex flex-col">
              {item.name}
            </Tag>
            )
          }
        </>;
      }
      return "";
    },
  },
  {
    title: "Publish State",
    dataIndex: "published",
    align: "right",
    width: 100,
    render(value:any,record:any,_:any) {
      return <DtSwitch url={api_points.content.changeState} id={record["id"]} value={value}/>
    },
  },
  {
    title: "Language",
    dataIndex: "language",
    align: "right",
    width: 50,
    render(language:ILanguage, record:any) {
      const slug = language?.slug || record?.languageCode || "";
      return <DtLanguage value={slug}/>;
    },
  },
  {
    title: "Actions",
    width: 90,
    dataIndex: "id",
    align: "right",
    render(value:any,record:any,_:any) {
      return (<DtActionContainer>
        <DtDelete url={api_points.content.delete} data={record} />
        <DtEdit data={record} url={`${route_paths.admin}/${record["moduleId"]}${route_paths.contents}/edit`} />
      </DtActionContainer>)
    },
  }
];
