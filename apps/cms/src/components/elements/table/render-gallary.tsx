"use client";

import EnumPlaces from "@/abstracts/file.enum";
import { RootState } from "@/lib/redux-toolkit/store";
import { AntDesignOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Image } from "antd";
import { useSelector } from "react-redux";

export default function GallaryRender({
    value,
    folderName
}: {
    value: string[],
    folderName: EnumPlaces
}) {
    const site = useSelector((state: RootState) => state.site);

    return (
        <Avatar.Group shape="square">
            {
                value.map((item, index) =>
                    <Avatar key={index} size={'large'}
                    src={`${process.env.NEXT_PUBLIC_CDN}/${site.slug}/${folderName}/${item}`} shape='square' />
                )
            }
        </Avatar.Group>
    );
}
