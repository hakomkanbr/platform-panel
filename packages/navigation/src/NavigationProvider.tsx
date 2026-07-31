"use client";

import {
    createContext,
    useContext,
    useMemo,
    useState,
    useCallback,
} from "react";

import {
    platformNavigation,
} from "./navigation";

import type {
    NavigationState,
} from "./types";
import type { ApplicationDefinition } from "@repo/application-types";

interface Props {
    application?: ApplicationDefinition;
    children: React.ReactNode;
}

interface NavigationContextValue extends NavigationState {
    setApplication: (app: ApplicationDefinition | null) => void;
}

const Context = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({
    application: initialApp,
    children,
}: Props) {
    const [app, setApp] = useState<ApplicationDefinition | undefined>(initialApp);

    const setApplication = useCallback((application: ApplicationDefinition | null) => {
        setApp(application ?? undefined);
    }, []);

    const value = useMemo<NavigationContextValue>(() => ({
        platform: platformNavigation,
        application: app?.navigation ?? [],
        setApplication,
    }), [app, setApplication]);

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
