"use client";;
import Link from 'next/link';
import { useEffect, useState } from 'react';


const RedirectWebSite = () => {
    const [user, setUser] = useState<{
        username: string,
        email: string,
        userId: string,
        siteId: string,
        image: string,
        siteUrl: string,
    }>();
    // useEffect(() => {
    //     const a = async () => {
    //         const session: any = (await getSession()) ?? {};
    //         setUser(session.token);
    //     }
    //     a();
    // }, []);

    if(!user?.siteUrl){
        return "";
    }
    return (
        <Link target='_blank' href={user?.siteUrl ?? ""}>
            View Site
        </Link>
    );
};

export default RedirectWebSite;