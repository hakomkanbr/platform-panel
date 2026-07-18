'use client';;
import { useEffect, useState, useTransition } from 'react';
import { Divider, Select } from 'antd';
import api from '@/api/api-context';
import api_points from '@/api/points';
import { getCookie, setCookie } from '@/app/actions/set-cookie';
import { valueType } from 'antd/es/statistic/utils';
import Link from 'next/link';
import route_paths from '@/helper/route_paths';
import enumCreateUpdate from '@/abstracts/create-update';
import { SiteId, SiteSlug } from '@/abstracts/siteSlug';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/redux-toolkit/store';
import { setLoading } from '@/lib/redux-toolkit/slice/ui-slice';
import { onChangeSite, setWebsites } from '@/lib/redux-toolkit/slice/site-slice';
import { useRouter } from 'next/navigation';
import { toQueryString } from '@/helper/toQueryString';

const SiteSelect = () => {
    const dispatch = useDispatch();
    const sites = useSelector((state: RootState) => state.site);
    const router = useRouter();
    const [value, setValue] = useState<{ slug: string, name: string } | undefined>();
    const [isPending, startTransition] = useTransition();

    const fetchSites = async () => {
        try {
            const siteSlug = await getCookie(SiteSlug);
            const p = {
                pageSize: 10,
                currentPage: 1
            };
            const { data } = (await api.get(api_points.webSite.getAll + `?${toQueryString(p)}`)).data;

            // نحفظها في Redux
            dispatch(setWebsites(data));

            if (siteSlug && siteSlug.length) {
                setValue(data.find((i: any) => i.slug == siteSlug));
            }
        } catch {}
    };

    const onChange = (e: valueType) => {
        if (e) {
            const site = sites.list.find(z => z.slug == e.toString());
            setCookie(SiteId, site?.id.toString() ?? "");
            setCookie(SiteSlug, e.toString());
            setValue({ slug: e.toString(), name: site?.name ?? "" });
        } else {
            setValue(undefined);
            setCookie(SiteId, "");
            setCookie(SiteSlug, "");
        }

        // location.reload();
        dispatch(onChangeSite());
        dispatch(setLoading(true));
        setTimeout(() => dispatch(setLoading(false)), 500);
    };

    useEffect(() => {
        startTransition(fetchSites);
    }, [sites.changeSite]);

    return (
        <Select
            style={{ width: 300, marginTop: 12 }}
            placeholder={isPending ? "Wait..." : "Choose WEB Site"}
            onChange={onChange}
            allowClear
            size='large'
            value={value?.slug}
            labelInValue={false}
            loading={isPending}
            disabled={isPending}
            dropdownRender={(menu) => (
                <>
                    {menu}
                    <Divider style={{ margin: '8px 0' }} />
                    <Link
                        style={{ textAlign: "center", display: "block" }}
                        href={route_paths.webSites + "/" + enumCreateUpdate.create}
                    >
                        🆕 إنشاء موقع جديد
                    </Link>
                </>
            )}
            options={sites.list.map((item) => ({
                value: item.slug,
                label: (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                        <span style={{ fontSize: 16 }}>{item.name}</span>
                        <small style={{ fontSize: 12, color: item.published ? 'green' : 'red' }}>
                            {item.published ? 'منشور' : 'غير منشور'}
                        </small>
                    </div>
                )
            }))}
        />
    );
};

export default SiteSelect;