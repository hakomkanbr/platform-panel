
"use client";;
import { IUser, IUserProps } from '@/abstracts/user/user';
import { logout } from '@/app/actions/login';
import route_paths from '@/helper/route_paths';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Flex, Space } from 'antd';
import Link from 'next/link';


const EUser = ({ user }: { user?: IUserProps }) => {
    return (
        <Dropdown menu={{
            items: [
                {
                    label: (
                        <Flex gap={5} style={{ height: 45 }}>
                            <Avatar size={38} src={process.env.NEXT_PUBLIC_CDN + `/user/${user?.image}`} icon={<UserOutlined />} />
                            <div>
                                <h5 style={{ margin: 0 }}>{user?.username}</h5>
                                <p style={{ margin: 0 }}>{user?.email}</p>
                            </div>
                        </Flex>
                    ),
                    key: '0',
                },
                {
                    label: <Link href={route_paths.profile}>Profile</Link>,
                    key: '1',
                },
                {
                    label: <a onClick={() => {
                        logout();
                    }}>Log out</a>,
                    key: '2',
                }
            ]
        }} trigger={['click']}>
            <a onClick={(e) => e.preventDefault()}>
                <Space>
                    {
                        user?.image ?
                            <Avatar src={process.env.NEXT_PUBLIC_CDN + `/user/${user.image}`} alt='user' icon={<UserOutlined />} /> :
                            <Avatar alt='user' icon={<UserOutlined />} />
                    }
                </Space>
            </a>
        </Dropdown>
    );
};

export default EUser;