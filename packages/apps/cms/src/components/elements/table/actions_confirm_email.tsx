"use client";;
import React from 'react';
import { useDispatch } from 'react-redux';
import { changeModalState } from '@/lib/redux-toolkit/slice/modal-slice';
import api from '@/api/api-context';
import api_points from '@/api/points';

const DtConfirmEmail: React.FC<{data:any}> = ({data}) => {
    const dispatch = useDispatch();
    const sendCode = async ()=>{
        await api.get(api_points.users.sendCode + `?email=${data.email}`);
        dispatch(changeModalState({
            open : true,
            data: data
        }));
    }
    return <>
        <a href='javascript:void(0)' onClick={sendCode}>confirm</a>
    </>
};

export default DtConfirmEmail;