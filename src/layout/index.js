import React, { useState, useEffect } from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import LoginFormContainer from '../components/containers/loginFormContainer';
import EditAvatar from '../components/editUser';
import EditUser from '../components/editUserDraw';
import Register from '../pages/register';
import OtherSet from '../components/otherSet';
import ConfigList from '../components/configList';
import * as umi from 'umi';
import io from 'socket.io-client';
import { Row, Col, Drawer, message, notification, Button } from 'antd';
import * as util from '../common/util';

export default function index(props) {
    if (props.location.pathname === '/login') {
        return <LoginFormContainer />;
    }
    if (props.location.pathname === '/register') {
        return <Register />;
    }

    const [visible, setVisible] = useState(false);
    const [addFriendNumber, setAddFriendNumber] = useState(0);

    useEffect(() => {
        const socket = window.socket = io.connect('http://127.0.0.1:9191');
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (userData && Object.keys(userData).length > 0) {
            window.userData = userData;
            socket.emit('online', { userId: userData.id });
            util.refreshData();
            socket.on('otherLogin', (content) => {
                message.error('您的账号已被其他用户登录，若非本人操作请及时修改密码')
                umi.router.push('/login');
            });
            socket.on('addFriendResult', util.handleNotice);
            socket.on('like', util.handleNotice);
            socket.on('dismissGroup', util.handleNotice);
            socket.on('createGroup', util.handleNotice);
            socket.on('addComments', util.handleNotice);
            socket.on('addFriend', (noticeData) => {
                setAddFriendNumber(addFriendNumber + 1);
                const key = `open${Date.now()}`;
                const btn = (
                    <>
                        <Button
                            type="primary"
                            size="small"
                            style={{ margin: '0 10px' }}
                            onClick={() => {
                                setAddFriendNumber(addFriendNumber - 1);
                                socket.emit('agreeAddFriend', noticeData, () => { util.refreshData() })
                                notification.close(key)
                            }}>
                            同意
                    </Button>
                        <Button
                            type="danger"
                            size="small"
                            style={{ margin: '0 10px' }}
                            onClick={() => {
                                setAddFriendNumber(addFriendNumber - 1);
                                socket.emit('disagreeAddFriend', noticeData)
                                notification.close(key)
                            }}>
                            拒绝
                    </Button>
                    </>
                );
                notification.open({
                    message: '好友申请',
                    description: noticeData.content,
                    btn,
                    key,
                    duration: 0
                });
            });
            socket.on('applyJoinGroup', (noticeData) => {
                setAddFriendNumber(addFriendNumber + 1);
                const key = `open${Date.now()}`;
                const btn = (
                    <>
                        <Button
                            type="primary"
                            size="small"
                            style={{ margin: '0 10px' }}
                            onClick={() => {
                                setAddFriendNumber(addFriendNumber - 1);
                                noticeData.type = 'agreeJoin';
                                socket.emit('replyApplyJoin', noticeData, () => { util.refreshData() })
                                notification.close(key)
                            }}>
                            同意
                    </Button>
                        <Button
                            type="danger"
                            size="small"
                            style={{ margin: '0 10px' }}
                            onClick={() => {
                                setAddFriendNumber(addFriendNumber - 1);
                                noticeData.type = 'disagreeJoin';
                                socket.emit('replyApplyJoin', noticeData)
                                notification.close(key)
                            }}>
                            拒绝
                    </Button>
                    </>
                );
                notification.open({
                    message: '入群申请',
                    description: noticeData.content,
                    btn,
                    key,
                    duration: 0
                });
            });
            socket.on('replyApplyJoin',util.handleNotice);
        } else {
            umi.router.push('/login');
        }
    }, []);


    const showDraw = () => {
        setVisible(true);
    }
    const onClose = () => {
        setVisible(false);
    }
    return (
        <>
            <Header />
            <Row>
                <Col span={18} offset={3}>{props.children}</Col>
            </Row>
            <EditAvatar showDraw={showDraw} />
            <Drawer
                width={300}
                title="用户信息"
                placement="left"
                closable={false}
                onClose={onClose}
                visible={visible}
            >
                <EditUser />
                <OtherSet />
            </Drawer>
            <div className='background-wrapper'>
                <img src={require('@/assets/back.jpg')} />
            </div>
            <ConfigList addFriendNumber={addFriendNumber} />
            <Footer />
        </>
    )
}
