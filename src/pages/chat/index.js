import React, { useState, useEffect } from 'react'
import UserList from '../../components/userList';
import ChatContent from '../../components/chatContent';
import { connect } from 'dva';
import axios from 'axios';
import { Col, Row } from 'antd';
import { refreshData } from '../../common/util';

function Chat(props) {
    const userData = window.userData || JSON.parse(localStorage.getItem('userData'));

    const [chatUserList, setChatUserList] = useState([]);
    const [chat, setChat] = useState({});
    const [groupMap, setGroupMap] = useState([])

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
            setChatUserList(result.data.chat_list);
            setGroupMap(result.data.group_map);

            if (result.data.group_map[0].friend_id === result.data.chat_list[0].id) {
                setChat(result.data.group_map[0]);
            } else {
                setChat({
                    group_id: result.data.chat_list[0].id,
                    is_group: true
                });
            }

        }).catch(err => {
            console.log(err);
        });
    }, []);

    //当点击不同的人物时，相应的改变聊天框的内容
    const changeChatContent = (item) => {
        if (item.group_name) {
            setChat({
                group_id: item.id,
                is_group: true
            })
        } else {
            groupMap.forEach(group => {
                if (group.friend_id == item.id) {
                    setChat(group)
                }
            })
        }

    }

    const renderList = () => {
        return <UserList list={chatUserList} changeChatContent={changeChatContent} />;
    }

    const renderChatContent = () => {
        if (Object.keys(chat).length === 0) return;
        return <ChatContent group={chat} socket={window.socket} />;
    }
    return (
        <Row>
            <Col span={8}>{chatUserList.length > 0 && renderList()}</Col>
            <Col span={16}>{renderChatContent()}</Col>
        </Row>
    )
}

export default Chat;