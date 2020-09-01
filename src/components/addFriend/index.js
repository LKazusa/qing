import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Tabs, Input, List, Avatar, Button, message, Col, Row, Modal } from 'antd'
import AddGroup from '../containers/addGroupContainer';
import './index.less';
import axios from 'axios';
const { TabPane } = Tabs;
const { Search } = Input;

const AddFriend = props => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const [searchFriendsResult, setSearchFriendsResult] = useState([]);
    const [searchGroupResult, setSearchGroupResult] = useState([]);
    const [flag, setFlag] = useState(false);
    //查找
    const handleSearch = value => {
        axios.get('http://localhost:12306/api/queryUserOrGroup', {
            params: {
                query_str: value
            }
        }).then(res => {
            const result = res.data.queryResult;
            const group = [];
            const friends = [];
            const nowFriend = window.userData.friends ? window.userData.friends.split(',') : [];
            const nowGroup = window.userData.group ? window.userData.group.split(',') : [];
            result.forEach(item => {
                if (item.group_name && !nowGroup.includes(item.id)) {
                    group.push(item)
                } else if (item.nickname && !nowFriend.includes(item.id)) {
                    friends.push(item)
                }
            })
            setSearchFriendsResult(friends);
            setSearchGroupResult(group);
            setFlag(true);
        }).catch(err => {
            console.log(err);
        })
    }
    //加入群聊
    const handleJoinGroup = (group) => {
        window.socket.emit('userApplyJoinGroup', {
            from: userData.id,
            to: group.lead_id,
            payload: {
                group_id: group.id,
                group_name: group.group_name
            }
        }, () => {
            message.success('入群申请已发送')
        });
    }
    //添加好友
    const handleAddFriend = (friend) => {
        window.socket.emit('sendAddFriend', {
            from: userData.id,
            to: friend.id
        }, () => {
            message.success('好友申请已发送')
        });
    }
    const renderFriendsContent = () => {
        return <>
            <Row className='add_title' style={{ textAlign: 'center', margin: '10px 0 0 0' }}>
                <Col span={12}>用户列表</Col>
                <Col span={12}>群组列表</Col>
            </Row>
            <div className='add_friends_list_wrapper'>
                <div className='add_friends'>
                    <List
                        itemLayout="horizontal"
                        dataSource={searchFriendsResult}
                        size='small'
                        bordered={true}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.avatar} />}
                                    description={item.nickname}
                                />
                                <Button type="primary" shape="circle" size='small' ghost onClick={handleAddFriend.bind(this, item)}>+</Button>
                            </List.Item>
                        )}
                    />
                </div>
                <div className='add_group'>
                    <List
                        itemLayout="horizontal"
                        dataSource={searchGroupResult}
                        size='small'
                        bordered={true}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.avatar} />}
                                    description={item.group_name}
                                />
                                <Button type="primary" shape="circle" size='small' ghost onClick={handleJoinGroup.bind(this, item)}>+</Button>
                            </List.Item>
                        )}
                    />
                </div>
            </div>
        </>
    }
    return (
        <Modal
            title=''
            visible={props.showModal}
            onCancel={props.hideAddFriend}
            style={{ textAlign: 'center' }}
            footer={null}>
            <Tabs defaultActiveKey="1">
                <TabPane tab="查找" key="1">
                    <Search
                        placeholder="查找好友/群"
                        onSearch={handleSearch}
                        style={{ width: 200 }}
                    />
                    {flag && renderFriendsContent()}
                </TabPane>
                <TabPane tab="创建群聊" key="2">
                    <AddGroup hideAddFriend={props.hideAddFriend} />
                </TabPane>
            </Tabs>
        </Modal>
    )
}

AddFriend.propTypes = {
    hideAddFriend: PropTypes.func,
    showModal: PropTypes.bool
}

export default AddFriend
