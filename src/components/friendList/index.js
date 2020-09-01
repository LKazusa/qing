import React,{useState} from 'react'
import PropTypes from 'prop-types';
import FriendItem from '../friendItem';
import {Card,Avatar,Tabs} from 'antd';
import _ from 'lodash';
import './index.less';
const { Meta } = Card;
const { TabPane } = Tabs;

const FriendList = props => {
    const friends = _.filter(props.friendsData, item => item.nickname);
    const group = _.filter(props.friendsData, item => item.group_name);

    const [activeClass, setActiveClass] = useState('');

    const handleFriendClick = id => {
        props.lookFriend(id);
        setActiveClass(id);
    }
    const handleGroupClick = id => {
        props.lookGroup(id);
        setActiveClass(id);
    }
    const renderFriendItem = item => {
        let classname = 'list-item';
        if(activeClass && activeClass === item.id){
            classname += ' active';
        }
        return <Card
            style={{ width: 300}}
            key={item.id} 
            onClick={handleFriendClick.bind(this,item.id)}
            className={classname}>
            <Meta
                avatar={
                <Avatar src={item.avatar} />
                }
                title={item.nickname}
                description={item.sign}
            />
        </Card>;
    }
    const renderGroupItem = item => {
        let classname = 'list-item';
        if(activeClass && activeClass === item.id){
            classname += ' active';
        }
        return <Card style={{ width: 300}} 
            key={item.id} 
            onClick={handleGroupClick.bind(this,item.id)}
            className={classname}>
            <Meta
                avatar={
                <Avatar src={item.avatar} />
                }
                title={item.group_name}
            />
        </Card>;
    }
    return (
        <div className='friend-list-wrapper'>
            <Tabs defaultActiveKey="1" tabBarStyle={{textAlign:'center'}}>
                <TabPane tab="好友" key="1">
                {
                    _.map(friends, ele => {
                        return renderFriendItem(ele);
                    })
                }
                </TabPane>
                <TabPane tab="群组" key="2">
                {
                    _.map(group, ele => {
                        return renderGroupItem(ele);
                    })
                }
                </TabPane>
            </Tabs>
        </div>
    )
}

FriendList.propTypes = {
    friendsData: PropTypes.array,
    lookFriend: PropTypes.func,
    lookGroup: PropTypes.func
}

export default FriendList
