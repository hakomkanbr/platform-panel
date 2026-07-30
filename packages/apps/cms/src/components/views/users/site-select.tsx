'use client';;
import { useEffect, useState } from 'react';
import { Form, Select } from 'antd';
import api from '@/api/api-context';
import api_points from '@/api/points';
import { getCookie } from '@/app/actions/set-cookie';


const SingleSiteSelect = () => {
    const form = Form.useFormInstance();
    const [items, setWebSites] = useState<{
        "id": number,
        "name": string,
        "link": string,
        "published": boolean,
        "userId": number
    }[]>([]);
    const [value, setValue] = useState<{
        id: number,
        name: string
    }>();
    const fetchSites = async () => {
        const { data, total } = (await api.post(api_points.webSite.getAll, {
            "pageSize": 10,
            "currentPage": 1,
            "search": "",
            "sortField": "",
            "sortOrder": ""
        })).data;
        var site = form.getFieldValue("sId");
        if (site) {
            setValue(data.find((i: any) => i.id == site));
        }
        setWebSites(data);
    }

    const onChange = (e: any) => {
        form.setFieldValue("sId", e)
    };

    useEffect(() => {
        setTimeout(()=>{
            fetchSites();
        },100)
    }, []);

    return (
        <Select
            placeholder={"choose webSite"}
            onChange={onChange}
            value={value?.id}
            // mode="multiple"
            labelInValue={false}
            options={items.map((item) => ({ label: item.name, value: item.id }))}
        />
    );
};

export default SingleSiteSelect;