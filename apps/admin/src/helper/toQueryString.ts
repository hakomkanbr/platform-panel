/**
 * Converts an object into a query string.
 *
 * This function takes an object with key-value pairs and converts it into a URL-encoded query string.
 * Only keys with non-undefined and non-null values are included in the resulting query string.
 *
 * @param obj - The object to be converted into a query string. The keys are the parameter names and the values are the parameter values.
 * @returns A URL-encoded query string representing the input object.
 */
export function toQueryString(obj: Record<string, any>) {
    const params = new URLSearchParams();
    for (const key in obj) {
        if (obj[key] !== undefined && obj[key] !== null) {
            params.append(key, obj[key].toString());
        }
    }
    return params.toString();
}