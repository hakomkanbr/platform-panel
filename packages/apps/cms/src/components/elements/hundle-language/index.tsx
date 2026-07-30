"use client";

import { setLanguages } from "@/lib/redux-toolkit/slice/language-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


export default function HundleLanguage({
    data,
}: {
    data?: any
}) {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setLanguages(data));
    }, []);

    return (<></>);
}