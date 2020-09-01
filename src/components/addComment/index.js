import React,{useState} from 'react'
import PropTypes from 'prop-types'
import {Input, Button } from 'antd';
import axios from 'axios';
import Qs from 'qs';
const { TextArea } = Input;

const AddComment = props => {
    const [commentvalue, setCommentvalue] = useState('');
    const userData = JSON.parse(localStorage.getItem('userData'));

    const sendComment = () => {
        const commentObj = {
            user_id:userData.id,
            nickname:userData.nickname,
            avatar:userData.avatar,
            dynamic_id:props.dynamic_id,
            message:commentvalue,
            time:Date.now(),
            at:'',
        }
        
        axios.post('http://localhost:12306/api/addComment',Qs.stringify(commentObj)).then(res => {
            window.socket && window.socket.emit('addComments',{
                from:userData.id,
                to:props.from_user_id,
                payload:{
                    dynamic_id:props.dynamic_id
                }
            })
            setCommentvalue('');
            props.afterMessage && props.afterMessage(commentObj);
        }).catch(err => {
            console.log(err);
        })
    }
    return (
        <div style={{width: '100%','margin':'20px 0',textAlign:'right'}}>
            <TextArea 
                placeholder='添加你的精彩评论吧~~' 
                onChange={({ target: { value } }) => setCommentvalue(value) } 
                value={commentvalue} style={{width:'80%'}}/>
            <Button type='primary' onClick={sendComment} style={{margin:'10px 20px'}}>评论</Button>
        </div>
    )
}

AddComment.propTypes = {
    dynamic_id:PropTypes.string,
    from_user_id:PropTypes.string,
    afterMessage:PropTypes.func
}

export default AddComment