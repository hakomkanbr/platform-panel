"use client";;
import React from 'react';
import Link from 'next/link';
import { EditOutlined } from '@ant-design/icons';
import EButton from '../button';

const DtEdit: React.FC<{data:any,url:string }> = ({data,url}) => {
    return <>
        <Link href={{pathname : url,query:{
            id:data.id
        }}}>
            <EButton icon={<EditOutlined />} />
        </Link>
    </>
};

export default DtEdit;