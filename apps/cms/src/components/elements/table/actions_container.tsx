"use client";;
import React from 'react';
import api from '@/api/api-context';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import { dtRefresh } from '@/lib/redux-toolkit/slice/datatable-slice';
import Swal from 'sweetalert2';
import { checkOutError, listHtmlAlert } from '@/helper/checkout-error';
import { DeleteOutlined } from '@ant-design/icons';

const DtDelete: React.FC<{ data: any, url: string, customDelete?: () => Promise<any> }> = ({ data, url, customDelete }) => {
    const dispatch = useDispatch();
    const deleteRow = async () => {
        Swal.fire({
            position: "center",
            icon: "warning",
            title: "Are you sure you want to delete?",
            showConfirmButton: true,
            showCancelButton: true,
        }).then((res) => {
            if (res.isConfirmed) {
                const deletePromise = customDelete ? customDelete() : api.delete(`${url}?id=${data.id}`);
                deletePromise.then(() => {
                    dispatch(dtRefresh());
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Row Deleted",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }).catch((err: any) => {
                    var errors = checkOutError(err);
                    var html = listHtmlAlert(errors);

                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "Row could not deleted",
                        html: html,
                        showConfirmButton: false,
                        showCancelButton: true
                    });
                });
            }
        });
    }
    return <>
        <Button icon={<DeleteOutlined />} style={{ padding: 0, background: "none" }} onClick={() => {
            deleteRow();
        }} />
    </>
};

export default DtDelete;