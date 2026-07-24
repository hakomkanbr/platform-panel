export const decodeUrl = (obj: any) => {
    const newObj: any = {};
    Object.keys(obj).map((key: string) => {
        newObj[key] = decodeURI(obj[key]);
    });
    return newObj;
};
