import React from 'react';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Space } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import DtEditModal from './actions_edit_modal';
import DtActionContainer from './actions_delete';
import { IColumn } from './type';
import DtEdit from './actions_edit';
import DtConfirmEmail from './actions_confirm_email';


const DtActions: React.FC<{ data: any, column: IColumn }> = ({ data, column }) => {
  const items: MenuProps["items"] = [];
  if (column.edit_modal_url) {
    items.push({
      key: '1',
      label: <DtEditModal data={data} />,
    });
  }
  if (column.confirm_email_url) {
    items.push({
      key: '4',
      label: <DtConfirmEmail data={data} />,
    });
  }
  if (column.edit_url) {
    items.push({
      key: '2',
      label: <DtEdit url={column.edit_url} data={data} />,
    });
  }

  if(!items.length) return null;
  return (
    <Space direction="vertical">
      <Dropdown menu={{
        items: items,
        // onClick : function(e){
        //   console.info("e => ", e);
        // }
      }} placement="bottom">
        <Button><SettingOutlined /></Button>
      </Dropdown>
    </Space>
  )
};

export default DtActions;