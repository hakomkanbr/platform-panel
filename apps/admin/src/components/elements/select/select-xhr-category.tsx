"use client";;
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Select, Spin } from "antd";
import type { SelectProps } from "antd/es/select";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux-toolkit/store";
import Swal from "sweetalert2";
import errorChooseLanguage from "@/data/errors/choose-category";

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, "options" | "children"> {
  fetchOptions: () => Promise<ValueType[]>;
  debounceTimeout?: number;
}

function DebounceSelectCategory<
  ValueType extends {
    key?: string;
    label: React.ReactNode;
    value: string | number;
  } = any
>({
  fetchOptions,
  // debounceTimeout = 800,
  ...props
}: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[][]>([]);
  const [oldLanguages, setOldLanguages] = useState<string[]>([]);
  const [langIndex, setLangIndex] = useState<number>(0);
  const { languages } = useSelector((state: RootState) => state);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = () => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions().then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }


        var hasOld = oldLanguages.findIndex(i => i == languages.selectedLang?.slug);
        if (hasOld == -1) {
          setOldLanguages((old) => [...old, languages.selectedLang?.slug ?? ""]);
        }

        if (options.length > 0) {
          setOptions([...options, newOptions]);
        } else {
          setOptions([newOptions]);
        }
        setFetching(false);
      });
    };
    return loadOptions
  }, [fetchOptions]);

  useEffect(() => {
    if (!languages.selectedLang?.slug) return;
    var hasOld = oldLanguages.findIndex(i => i == languages.selectedLang?.slug);
    if (hasOld != -1) return;
    debounceFetcher();
  }, [languages.selectedLang]);

  useEffect(() => {
    var hasOld = oldLanguages.findIndex(i => i == languages.selectedLang?.slug);
    if (hasOld != -1) {
      setLangIndex(hasOld);
    }
  }, [options, languages.selectedLang]);


  return (
    <Select
      allowClear
      labelInValue
      filterOption={false}
      // defaultValue={languages.selectedLang ?? undefined}
      onClick={() => {
        console.info("languages => ", languages);
        if (languages.list.length <= 1) {
          return
        }

        if (!languages.selectedLang) {
          Swal.fire({
            title: errorChooseLanguage[0].title,
            icon: "error",
            text: errorChooseLanguage[0].description
          })
        }
      }}
      mode="multiple"
      autoClearSearchValue
      placeholder="Choose Category"
      notFoundContent={
        fetching ? (
          <Spin size="small" />
        ) : options[langIndex] && options[langIndex].length === 0 ? (
          <span>No categories available</span>
        ) : null
      }
      {...props}
      options={options[langIndex]}
    />
  );
}

export default DebounceSelectCategory;
