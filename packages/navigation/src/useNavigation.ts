"use client";

import {
  usePathname,
} from "next/navigation";

import {
  useNavigationContext,
} from "./NavigationProvider";

export function useNavigation() {

  const pathname = usePathname();

  const navigation = useNavigationContext();

  const isActive = (path: string) => {

    return pathname.startsWith(path);

  };

  return {

    ...navigation,

    pathname,

    isActive,

  };

}