"use client";

import { getCookie } from "@/app/actions/set-cookie";
import TabsSettings from "./setting-tabs";
import { SiteSlug } from "@/abstracts/siteSlug";

const SettingView = ({siteSlug}: {siteSlug: string | null}) => {
 
    
    return (
        <div className="settings-page">
            <TabsSettings siteSlug={siteSlug}/>
            
            <style jsx>{`
                .settings-page {
                    min-height: 100vh;
                    background: #f8fafc;
                }
            `}</style>
        </div>
    );
};

export default SettingView;