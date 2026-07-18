"use client";;
import ICategory from "@/abstracts/categories";
import { IError } from "@/abstracts/error-types";
import api from "@/api/api-context";
import api_points from "@/api/points";
import WriteError from "@/components/elements/error-message/error-message";
import { checkOutError } from "@/helper/checkout-error";
import route_paths from "@/helper/route_paths";
import { useAppDispatch } from "@/lib/redux-toolkit/hooks";
import { dtRefresh } from "@/lib/redux-toolkit/slice/datatable-slice";
import { changeModalState } from "@/lib/redux-toolkit/slice/modal-slice";
import { RootState } from "@/lib/redux-toolkit/store";
import { Alert, Flex, Form, Input, Modal } from "antd";
import { useForm } from "antd/es/form/Form";
import { OTPProps } from "antd/es/input/OTP";
import Title from "antd/es/typography/Title";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import slugify from "slugify";
import Swal from "sweetalert2";

export default function ConfirmUserEmail() {
    const dispatch = useAppDispatch();
    const [form] = useForm();
    const { modal } = useSelector((state: RootState) => state);
    const [open, setOpen] = useState<boolean>();
    const router = useRouter();
    const [code, setCode] = useState<string>();
    const [errorCode, setErrorCode] = useState<IError[]>([]);
    const onSubmit = async () => {
        try {
            if (!code || (code && code?.length < 6)) {
                Swal.fire({
                    title: "please enter correct code",
                }).then(() => {
                    router.push(`${route_paths.users}`);
                })
            }
            (await api.get(`${api_points.users.confirmEmail}?email=${modal.data.email}&code=${code}`));
            await dispatch(dtRefresh());
            Swal.fire({
                title: "Email Success",
                timer: 3000
            }).then(()=>{
                dispatch(changeModalState({
                    open: false
                }));
            })
        } catch (err: any) {
            setErrorCode(checkOutError(err));
        } finally {
        }
     
    };
    const onChange: OTPProps['onChange'] = (text) => {
        setCode(text);
        console.log('onKeyUp:', text);
    };
    const sharedProps: OTPProps = {
        onChange,
    };
    useEffect(() => {
        if (modal.open) {
            console.info("modal.data => ", modal.data);
            form.setFieldsValue(modal.data);
        } else {
            form.resetFields();
        }
    }, [modal]);
    return (
        <>
            <Modal title="Email Confirmation" open={modal.open} onOk={()=>{
                form.submit();
            }} onCancel={() => {
                dispatch(changeModalState({ open: false }));
            }}>
                <Form
                    onFinish={onSubmit}
                    form={form}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    layout="vertical"
                    size="middle"
                >
                    <Flex gap="middle" justify="center" vertical>
                        <Title level={5}>Email Confirmation</Title>
                        <Alert 
  message="Check your email" 
  description={`We've sent a code to ${modal.data?.email}. Please enter it here.`} 
  type="info" 
/>
                        <Input.OTP value={code} {...sharedProps} />
                        <WriteError errors={errorCode} />
                    </Flex>
                </Form>
            </Modal>
        </>
    );
}
