import { EnFieldType } from "@/abstracts/modules/module-input";
import { IField } from "@/types/page";
import { Input } from "antd";
import dynamic from "next/dynamic";

const feedInputs = {
    text : Input
};

export const hasImageBetweenInputs = (inputs:IField[])=>{
    return inputs.findIndex(i=> i.fieldType == EnFieldType.image) != -1;
}

export default feedInputs;