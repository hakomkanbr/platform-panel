import { toQueryString } from '@/helper/toQueryString';
import api from '../api-context';
import api_points from '../points';

export const repo_getLanguages = async () => {
    let p = {
        "pageSize": 10,
        "currentPage": 1,
        "search": "",
        "sortField": "",
        "sortOrder": "",
        "siteId": 0
    };
    const res = api.get(api_points.service.getLanguageList + `?${toQueryString(p)}`);

    return (await res).data;
}