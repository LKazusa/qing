import React, { useState, useEffect } from 'react';
import FriendList from '../../components/friendList';
import FriendOverview from '../../components/friendsOverview';
import AddFriend from '../../components/addFriend';
import { Button, Col, Row } from 'antd';
import _ from 'lodash';
import axios from 'axios';
import { refreshData } from '../../common/util';

export default function Friends() {
    const userData = window.userData || localStorage.getItem('userData');
    const [allList, setAllList] = useState([]);
    //当前选中的好友
    const [nowFriend, setNowFriend] = useState(null);
    //是否显示添加好友和创建群聊的界面
    const [showAddFriend, setShowAddFriend] = useState(false);

    useEffect(() => {
        refreshData();
        let ids = '';
        if (userData.friends) {
            ids += userData.friends;
        }
        if (userData.group) {
            ids += ',' + userData.group;
        }
        axios.get('http://localhost:12306/api/queryChatList', {
            params: { ids, user_id: userData.id }
        }).then(result => {
            setAllList(result.data.chat_list);
        }).catch(err => {
            console.log(err);
        });
        
    }, []);

    //查看好友详细信息
    const lookFriend = id => {
        const tempFriend = _.filter(allList, item => {
            return item.id === id;
        });
        if (tempFriend[0]) {
            axios.get('http://localhost:12306/api/getUserById', {
                params: {
                    id: tempFriend[0].id
                }
            }).then(result => {
                setNowFriend(result.data.result)
            }).catch(error => {
                console.log(error);
            })
        }
    }
    //查看群组详细信息
    const lookGroup = id => {
        const tempFriend = _.filter(allList, item => {
            return item.id === id;
        });
        if (tempFriend[0]) {
            axios.get('http://localhost:12306/api/findGroupById', {
                params: {
                    id: tempFriend[0].id
                }
            }).then(result => {
                setNowFriend(result.data.result)
            }).catch(error => {
                console.log(error);
            })
        }
    }
    //创建群聊，和添加好友
    const handleClickAdd = () => {
        setShowAddFriend(!showAddFriend);
    }
    const hideAddFriend = () => {
        setShowAddFriend(false);
    }

    const handleDeleteGroup = (group_id) => {
        const tempFriend = _.filter(allList, item => {
            return item.id !== group_id;
        });
        setAllList(tempFriend);
        if (nowFriend.id === group_id) {
            setNowFriend(null);
        }
    }

    //删除好友之后刷新列表
    const afterDeleteFriend = (id) => {
        const list = _.filter(allList, item => item.id !== id);
        setAllList(list);
    }
    
    //删除群成员
    const deleteMember = (user_id) => {
        const now = _.cloneDeep(nowFriend);
        now.member instanceof Array && _.filter(now.member, item => item !== user_id);
        setNowFriend(now);
    }

    return (
        <div>
            <Row>
                <Col span={8}>
                    <FriendList friendsData={allList} lookFriend={lookFriend} lookGroup={lookGroup} />
                </Col>
                <Col span={16}>
                    {nowFriend && <FriendOverview nowFriend={nowFriend} handleDeleteGroup={handleDeleteGroup} afterDeleteFriend={afterDeleteFriend}
                    deleteMember={deleteMember}/>}
                </Col>
            </Row>
            <Button
                type="primary"
                shape="circle"
                icon='plus'
                size='large'
                onClick={handleClickAdd}
                style={{ position: 'fixed', bottom: '40px', zIndex: '99' }}></Button>
            <AddFriend hideAddFriend={handleClickAdd} showModal={showAddFriend}/>
        </div>
    )
}