const deCodeUrlObj = (obj:any)=>{
    const newObj : any = {};
    Object.keys(obj).map((key:string) => {
        newObj[key] = decodeURI(obj[key]);
    });

    return newObj;
};


export default deCodeUrlObj;