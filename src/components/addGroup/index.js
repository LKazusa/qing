import React,{useState,useEffect} from 'react'
import PropTypes from 'prop-types'
import {Form,Input,Row,Col,Button,Card,Avatar,List} from 'antd';
import axios from 'axios';
import './index.less';
import _ from 'lodash';
const { Meta } = Card;

const AddGroup = props => {
  const userData = window.userData;
    const [friendList, setFriendList] = useState([]);
    const [groupList, setGroupList] = useState([]);
    const [groupName, setGroupName] = useState('');
    
    const handleChange = e => {
      setGroupName(e.target.value);
    }
    const handleSubmit = () => {
      const submitObj = {
        lead_id:userData.id,
        group_name: groupName,
        member_ids:groupList.map(item => item.id),
        group_id:Date.now().toString() + Math.floor(Math.random() * 1000),
        is_group:true
      }
      props.submitAddGroup(submitObj,() => {
        props.hideAddFriend()
      })
      //结束执行hideAddFriend
    }

    useEffect(() => {
      axios.get('http://localhost:12306/api/getFriends',{
        params:{
          ids:userData.friends
        }
      }).then(res => {
        setFriendList(res.data.friend_list);
      })
    },[]);
    //添加群聊名单
    const addToList = id => {
      const newFriendList = _.filter(friendList,item => item.id !== id);
      const newGroupList = groupList.concat(_.filter(friendList,item => item.id === id));
      setGroupList(newGroupList)
      setFriendList(newFriendList);
    }
    //删除群聊名单
    const removeToList = id => {
      const newGroupList = _.filter(groupList,item => item.id !== id);
      const newFriendList = friendList.concat(_.filter(groupList,item => item.id === id));
      setFriendList(newFriendList);
      setGroupList(newGroupList);
    }


    return (
        <div className='add_group_wrapper'>
          <Input placeholder='请填入群名称' style={{ width: 200 }} onChange={handleChange}/>
          <Row className='add_title' style={{ textAlign: 'center', margin: '10px 0 0 0' }}>
                <Col span={12}>好友列表</Col>
                <Col span={12}>群成员列表</Col>
            </Row>
          <div className='add_group_list_wrapper'>
              <div className='add_group_left_friends'>
                <List
                  itemLayout="horizontal"
                  dataSource={friendList}
                  size='small'
                  bordered={true}
                  renderItem={item => (
                    <List.Item onClick={addToList.bind(this,item.id)}>
                      <List.Item.Meta
                        avatar={<Avatar src={item.avatar} />}
                        description={item.nickname}
                      />
                    </List.Item>
                    )}
                  />
              </div>
              <div className='add_group_right_friends'>
                <List
                  itemLayout="horizontal"
                  dataSource={groupList}
                  size='small'
                  bordered={true}
                  renderItem={item => (
                    <List.Item onClick={removeToList.bind(this,item.id)}>
                      <List.Item.Meta
                        avatar={<Avatar src={item.avatar} />}
                        description={item.nickname}
                      />
                    </List.Item>
                    )}
                  />
              </div>
          </div>
          
          <Button onClick={handleSubmit}>创建</Button>
        </div>
    )
}

AddGroup.propTypes = {
  hideAddFriend:PropTypes.func
}

export default Form.create({ name: 'addGroup' })(AddGroup); 
