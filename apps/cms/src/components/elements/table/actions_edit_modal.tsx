"use client";;
import React from 'react';
import EButton from '../button';
import { useDispatch } from 'react-redux';
import { changeModalState } from '@/lib/redux-toolkit/slice/modal-slice';
import { EditOutlined } from '@ant-design/icons';

const DtEditModal: React.FC<{ data: any }> = ({ data }) => {
    const dispatch = useDispatch();
    return <>
        <EButton icon={<EditOutlined />} onClick={() => {
            dispatch(changeModalState({
                open: true,
                data: data
            }));
        }} type='text' />
    </>
};

export default DtEditModal;