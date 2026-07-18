"use client";

import { useEffect } from "react";

export default function HundleFullPage() {
    useEffect(() => {
        const fullUrl = window.location.host.split(".")[0];
        document.cookie = `Host=${fullUrl}; path=/; domain=.bremix.tech; SameSite=None; Secure`;
    }, []);

    return (
        <></>
    );
}
