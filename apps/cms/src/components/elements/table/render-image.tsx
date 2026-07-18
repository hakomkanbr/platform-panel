"use client";

import EnumPlaces from "@/abstracts/file.enum";
import { RootState } from "@/lib/redux-toolkit/store";
import { Avatar, Image } from "antd";
import { IoImageOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

export default function ImageRender({
    value,
    folderName
}: {
    value: string,
    folderName: EnumPlaces
}) {
    const site = useSelector((state: RootState) => state.site);
    if (!value) {
        return (
            <Avatar icon={<IoImageOutline />} size="large" shape="square" />
        );
    }
    return (
        <Image width={50} height={50} src={`${process.env.NEXT_PUBLIC_CDN}/${site.slug}/${folderName}/${value}`} />
    );
}
