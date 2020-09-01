import React from 'react'
import PropTypes from 'prop-types'
import {Avatar} from 'antd';
import './index.less';
/*
{
    nickname: string,
    message: string,
    id: string,
    avatar:'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    time:0
}
*/

const ChatItem = props => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const chatData = props.chatData;
    const renderImg = () => {
        return  <>
        <br/>
        <img src={chatData.img} style={{width:'280px'}}/>
    </>
    }
    if(chatData.id !== userData.id){ // 其他人发送的消息
        return (
            <div className='chat-item-wrapper'>
                <div className='chat-item-user-info'>
                    <Avatar src={chatData.avatar}/>
                    <div className='chat-item-user-nickname'>{chatData.nickname}</div>
                </div>
                <div className='chat-item-content'>{chatData.message}
                    {chatData.img && renderImg()}
                </div>
            </div>
        )
    }else { //自己发送的消息
        return(
            <div className='my-chat-item-wrapper'>
                <div className='chat-item-content'>{chatData.message}{chatData.img && renderImg()}</div>
                <div className='chat-item-user-info'>
                    <Avatar src={chatData.avatar}/>
                    <div className='chat-item-user-nickname'>{chatData.nickname}</div>
                </div>
            </div>
        )
    }
}

ChatItem.propTypes = {
    chatData: PropTypes.object
}

export default ChatItem
