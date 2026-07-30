import React from "react";

export interface IDtResult<T> {
    data: T[];
    total: number;
}
interface BooleanState{
    [key:string] : string,
    color : string
}
export interface IColumn {
    title: string,
    dataIndex: string,
    type?: IColumnEnum,
    data?: BooleanState[],
    url?: string,
    edit_url?: string,
    confirm_email_url?: string,
    edit_modal_url?: boolean,
    delete_url?: string,
    align?: "right" | "left" | "center",
    width?:number,
    render?:(value:any) => any
}
export interface IDtRequest {
    "pageSize": number,
    "currentPage": number,
    "search": string,
    "sortField": string,
    "sortOrder": string
}
export enum IColumnEnum {
    switch,
    image,
    groupImage,
    language,
    actions,
    date,
    booleanState
}

export interface IDtResult<T> {
    data: T[];
    total: number;
}
export interface IColumn {
    title: string,
    dataIndex: string,
    type?: IColumnEnum
}
export interface IDtRequest {
    "pageSize": number,
    "currentPage": number,
    "search": string,
    "sortField": string,
    "sortOrder": string
}