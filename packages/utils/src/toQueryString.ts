export function toQueryString(obj: Record<string, any>) {
    const params = new URLSearchParams();
    for (const key in obj) {
        if (obj[key] !== undefined && obj[key] !== null) {
            params.append(key, obj[key].toString());
        }
    }
    return params.toString();
}
