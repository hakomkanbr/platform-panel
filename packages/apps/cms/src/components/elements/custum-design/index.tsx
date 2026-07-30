"use client";

import { updateDesign } from "@/lib/redux-toolkit/slice/design-slice";
import { SettingOutlined } from "@ant-design/icons";
import { Button, ColorPicker, Drawer } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

export default function ECustumColor() {
    const [primary, setPrimary] = React.useState('#1677ff');
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    

    const showDrawer = () => {
      setOpen(true);
    };
  
    const onClose = () => {
      setOpen(false);
    };
    return (
        <div className="custum-design">
            <Button type="primary" onClick={showDrawer}>
                <SettingOutlined width={20}/>
            </Button>
            <Drawer title="Custum Design" placement="bottom" onClose={onClose} open={open}>
                <ColorPicker showText value={primary} onChangeComplete={(color) => {
                    dispatch(updateDesign({
                       green:"red"
                    }))
                }} />
            </Drawer>
        </div>
    );
}
