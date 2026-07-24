"use client";

import api from '@/api/api-context';
import { Tooltip } from 'antd';
import React from 'react';


const BtnMigrateDb: React.FC<{}> = () => {
    function toggle_fullscreen() {
        api.get("/admin/Authenticate/MigrateDB");
    }

    return (
        <Tooltip title="Full Screen">
            <div style={{ cursor: "pointer" }} onClick={toggle_fullscreen}>
                migrate db
            </div>
        </Tooltip>
    );
};

export default BtnMigrateDb;