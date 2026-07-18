"use client";;
import React, { useState } from 'react';
import { Switch } from 'antd';
import api from '@/api/api-context';
import api_points from '@/api/points';
import Swal from 'sweetalert2';

const DtSwitch: React.FC<{ value: boolean, id: number, url?: string }> = ({ value, id, url }) => {
    const [state, setState] = useState<boolean>(value);
    const onChange = async (e: any) => {
        await api.put(url + `?id=${id}&state=${e}`);
        setState(e);
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Row Updated",
            showConfirmButton: false,
            timer: 1500
        });
    };
    return <>
        <Switch onChange={onChange} value={state} />
    </>
};

export default DtSwitch;