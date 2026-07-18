"use client";;
import React from 'react';
import { Flex } from 'antd';

const DtActionContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <Flex justify='end' gap={8}>
        {children}
    </Flex>
};

export default DtActionContainer;