"use client";;
import React, { useEffect, useState } from 'react';
import { Table, TableProps } from 'antd';
import { IDtResult } from './type';
import { useAppSelector } from '@/lib/redux-toolkit/hooks';
import { RootState } from '@/lib/redux-toolkit/store';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import api from '@/api/api-context';
import { toQueryString } from '@/helper/toQueryString';
const { Column } = Table;

const ETable: React.FC<{
    payload?: { [key: string]: string | number },
    columns: TableProps["columns"],
    url: string
}> = ({ columns, payload = {}, url }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const { datatable, user, site } = useAppSelector(state => state);
    const { languages } = useSelector((state: RootState) => state);
    const [localePayload, setLocalePayload] = useState<{
        pageSize: number,
        currentPage: number,
        search?: string,
        sortField?: string,
        sortOrder?: string,
    }>({
        pageSize: 10,
        currentPage: 1,
        search: "",
        sortField: "",
        sortOrder: "",
    });
    const [data, setData] = useState<IDtResult<any>>();
    const router = useRouter();

    const initDt = async () => {
        setLoading(true);
        const p = {
            ...localePayload,
            ...payload
        };
        const queryString = toQueryString(p);
        const response: any = await api.get(`${url}?${queryString}`, {
            data: {
                ...localePayload,
                ...payload
            }
        });
        const data = response.data;
        setLoading(false);
        setData(data);
    };

    useEffect(() => {
        initDt();
    }, [datatable, localePayload]);

    useEffect(() => {
        if (site.changeCount != 0) initDt();
    }, [site.changeCount]);

    return (<Table scroll={{
        x: true
    }} columns={columns} loading={loading} size='middle' pagination={{
        showTotal: (total: number, range: [number, number]) => {
            return (<>Showing {range[1]} out of {total}</>)
        },
        total: data?.total,
        onChange(page, pageSize) {
            setLocalePayload({
                currentPage: page,
                pageSize: pageSize
            })
        },
        hideOnSinglePage: true,
    }} dataSource={data?.data}>
    </Table>)
};

export default ETable;