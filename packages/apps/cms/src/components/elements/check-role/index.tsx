"use client";
import { RootState } from "@/lib/redux-toolkit/store";
import { IRoleType, ROLE } from "@/abstracts/user/user";
import { useSelector } from "react-redux";
import React from "react";

export default function CheckRole({
    allowRoles  = [],
    children
}: {
    allowRoles : string[],
    children : React.ReactNode
}) {
    const user = useSelector((state: RootState) => state.user);
    const role = user.role as IRoleType;

    console.info("allowRoles => " , allowRoles);
    console.info("allowRoles => " , user);

    if(allowRoles.includes(role)){
        return children;
    }

    return null;
}
