"use client";

import api_points from "@/api/points";
import DtDelete from "@/components/elements/table/actions_container";
import DtActionContainer from "@/components/elements/table/actions_delete";
import DtEdit from "@/components/elements/table/actions_edit";
import DtEditModal from "@/components/elements/table/actions_edit_modal";
import { TableProps } from "antd";

const columns : TableProps["columns"] = [
    {
      title : "Language",
      dataIndex : "name",
      width: 200,
      render: (text: string, record: any,_:any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ 
            display: 'inline-block',
            padding: '2px 8px',
            backgroundColor: '#F7931E',
            color: 'white',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}>
            {record.slug}
          </span>
          <span style={{ fontWeight: 500 }}>{text}</span>
        </div>
      )
    },
    {
      title : "Language Code",
      dataIndex : "slug",
      width: 120,
      render: (text: string) => (
        <span style={{ 
          fontFamily: 'monospace',
          backgroundColor: '#f1f5f9',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '13px'
        }}>
          {text}
        </span>
      )
    },
   {
        title: "Actions",
        width: 90,
        dataIndex: "id",
        align: "right",
        render(value: any, record: any, _: any) {
            return (<DtActionContainer>
                <DtDelete url={api_points.service.deleteLanguage} data={record} />
                <DtEditModal data={record} />
            </DtActionContainer>)
        },
    }
  ];

export default columns;