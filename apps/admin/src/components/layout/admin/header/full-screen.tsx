"use client";;
import { ExpandOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React, { useEffect, useRef } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';


const EFullScreen: React.FC<{}> = () => {
    const handle = useFullScreenHandle();
    const elem = useRef();
    function toggle_fullscreen() {
        if (!document.fullscreenElement) {
            document.body.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    return (
        <Tooltip title="Full Screen">
            <div style={{ cursor: "pointer" }} onClick={toggle_fullscreen}>
                <ExpandOutlined />
            </div>
        </Tooltip>
    );
};

export default EFullScreen;