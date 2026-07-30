"use client";;
import { Alert } from "antd";
import { useEffect } from "react";
import { CookiesKeys, IUserState } from "@/abstracts/auth";
import { deleteCookie } from "@/app/actions/set-cookie";

const EmailActivated = () => {

    useEffect(() => {
        setTimeout(() => {
            deleteCookie(CookiesKeys.authResult);
        }, 5000);
    }, [])


    return (
<Alert
  style={{ width: "100%", marginBottom: 20 }}
  showIcon
  message="Email activated"
  description="Your email has been successfully verified. You can now continue using the system."
  type="success"
/>    );
};

export default EmailActivated;