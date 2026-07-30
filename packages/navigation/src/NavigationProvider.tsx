"use client";

import {

    createContext,

    useContext,

    useMemo,

} from "react";


import {

    platformNavigation,

} from "./navigation";

import type {

    NavigationState,

} from "./types";
import { loadApplication } from "@repo/app-registry";


interface Props {

    appSlug?: string;

    children: React.ReactNode;

}

const Context = createContext<NavigationState | null>(null);

export function NavigationProvider({

    appSlug,

    children,

}: Props) {

    const value = useMemo(() => {

        const app = appSlug

            ? loadApplication(appSlug)

            : undefined;

        return {

            platform: platformNavigation,

            application: app?.navigation ?? [],

        };

    }, [appSlug]);

    return (

        <Context.Provider value={value}>

            {children}

        </Context.Provider>

    );

}

export function useNavigationContext() {

    const ctx = useContext(Context);

    if (!ctx) {

        throw new Error("NavigationProvider missing");

    }

    return ctx;

}