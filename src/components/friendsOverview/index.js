import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import moment from 'moment';
import axios from 'axios';
import { refreshData } from '../../common/util';
import './index.less';

import { Descriptions, Avatar, Card, List, Button, Modal, message } from 'antd';
const { confirm } = Modal;
const { Meta } = Card;

function FriendsOverview(props) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const handleDelete = (id) => {
        confirm({
            title: '您确定要删除此成员吗？',
            okText: '确定',
            okType: 'danger',
            cancelText: '算了',
            onOk() {
                axios.get('http://localhost:12306/api/deleteMember', {
                    params: { id: props.nowFriend.id, user_id: id }
                })
                    .then(res => {
                        props.deleteMember(id);
                        message.success('删除成功');
                    }).catch(err => {
                        message.error('删除失败');
                    })
            }
        })
    }

    const handleDeleteFriend = () => {
        confirm({
            title: '您确定要删除此好友吗？',
            okText: '确定',
            okType: 'danger',
            cancelText: '算了',
            onOk() {
                window.socket.emit('deleteFriend', {
                    type:'deleteFriend',
                    title:'删除好友',
                    from:window.userData.id,
                    to:props.nowFriend.id
                }, () => {
                    message.success('好友已删除');
                    refreshData();
                    props.afterDeleteFriend(props.nowFriend.id);
                })
            }
        })
    }

    const deleteGroup = () => {
        if (!props.nowFriend.group_name) {
            return;
        }
        axios.get('http://localhost:12306/api/deleteGroup', {
            params: {
                group_id: props.nowFriend.id,
                lead_id: props.nowFriend.lead_id,
                member: props.nowFriend.member.map(ele => ele.id)
            }
        }).then(res => {
            message.success('解散成功');
            window.socket && window.socket.emit('dismissGroup', {
                from: window.userData.id,
                payload: {
                    ids: props.nowFriend.member.map(ele => ele.id !== userData.id && ele.id),
                    group_id: props.nowFriend.id,
                    group_name: props.nowFriend.group_name
                }
            })
            refreshData();
            props.handleDeleteGroup(props.nowFriend.id);
        }).catch(err => {

        })
    }

    const renderGroupMember = (member) => {
        return <Card style={{ width: 100, margin: 10 }}
            actions={[<div>{member.nickname}</div>]}
        >
            <Meta
                avatar={
                    <Avatar src={member.avatar} />
                }
            />
        </Card>;
    }
    const renderLeadGroupMember = (item) => {
        return <Card
            bordered={false}
            style={{ width: 180 }}
            key={item.id}
            className='aaa'
        >
            <Meta
                avatar={
                    <Avatar src={item.avatar} />
                }
                title={item.nickname || item.group_name}
            />
            <Button onClick={handleDelete.bind(this, item.id)} type="danger" ghost>删除</Button>
        </Card>
    }
    const renderUserOverview = () => {
        return <Descriptions title='好友信息' column={1} >
            <Avatar src={props.nowFriend.avatar} />
            <Descriptions.Item label='昵称'>{props.nowFriend.nickname}</Descriptions.Item>
            <Descriptions.Item label='邮箱'>{props.nowFriend.email}</Descriptions.Item>
            <Descriptions.Item label='签名'>{props.nowFriend.sign}</Descriptions.Item>
            <Descriptions.Item label='电话'>{props.nowFriend.phone}</Descriptions.Item>
            <Descriptions.Item>
                <Button type='danger' onClick={handleDeleteFriend}>删除好友</Button>
            </Descriptions.Item>
        </Descriptions>
    }
    const renderGroupOverview = () => {
        return <Descriptions title='群组信息' column={1} >
            <Avatar src={props.nowFriend.avatar} />
            <Descriptions.Item label='名称'>{props.nowFriend.group_name}</Descriptions.Item>
            <Descriptions.Item label='创建时间'>{moment(parseInt(props.nowFriend.time)).format("MMM Do YY")}</Descriptions.Item>
            <Descriptions.Item label='人员'>
                <div className='friend-overview-member'>
                    {
                        props.nowFriend.member.map(item => item.id && renderGroupMember(item))
                    }
                </div>
            </Descriptions.Item>
        </Descriptions>
    }
    //当前用户是群主
    const renderLeaderGroupOverview = () => {
        return <Descriptions title='群组信息' column={1} >
            <Avatar src={props.nowFriend.avatar} />
            <Descriptions.Item label='名称'>{props.nowFriend.group_name}</Descriptions.Item>
            <Descriptions.Item label='创建时间'>{moment(parseInt(props.nowFriend.time)).format("MMM Do YY")}</Descriptions.Item>
            <Descriptions.Item>
                <div className='friend-overview-member lead-group'>
                    <List
                        bordered={false}
                        itemLayout="horizontal"
                        dataSource={props.nowFriend.member.map(item => item.id && item.id !== userData.id && renderLeadGroupMember(item))}
                        size='small'
                        bordered={true}
                        renderItem={item => (
                            <List.Item>
                                {item}
                            </List.Item>
                        )}
                    />
                </div>
            </Descriptions.Item>
            <Descriptions.Item>
                <Button type='danger' onClick={deleteGroup}>解散群聊</Button>
            </Descriptions.Item>
        </Descriptions>
    }
    const renderGroup = () => {
        if (props.nowFriend.lead_id === userData.id) {
            return renderLeaderGroupOverview()
        } else {
            return renderGroupOverview()
        }
    }

    return (
        <div>
            {props.nowFriend.nickname ? renderUserOverview() : renderGroup()}
        </div>
    )
}

FriendsOverview.propTypes = {
    nowFriend: PropTypes.object,
    afterDeleteFriend:PropTypes.func,
    deleteMember:PropTypes.func
}

export default FriendsOverview;



