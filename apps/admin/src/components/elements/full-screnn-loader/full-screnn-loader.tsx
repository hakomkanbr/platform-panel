"use client";

import React, { useEffect, useTransition } from "react";
import styles from "./FullScreenLoader.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/redux-toolkit/store";
import { usePathname } from "next/navigation";
import { setLoading } from "@/lib/redux-toolkit/slice/ui-slice";

interface Props {
  tip?: string;
}

const FullScreenLoader: React.FC<Props> = ({ tip = "Please wait..." }) => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const loading = useSelector((state: RootState) => state.ui.loading);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    dispatch(setLoading(true));
    startTransition(() => {
      dispatch(setLoading(false));
    });
  }, [pathname]);

  if (!loading && !isPending) return null;

  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.spinner}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className={styles.loaderText}>{tip}</div>
    </div>
  );
};

export default FullScreenLoader;
