import React,{PureComponent} from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash';
const axios = require('axios');
import ChatItem from '../chatItem';
import {Scrollbars } from 'react-custom-scrollbars';
import { Input,Button,Popover,Avatar,Row,Col,Upload,Icon,message } from 'antd';

const { TextArea } = Input;

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}
export default class ChatContent extends PureComponent {
    messagesBottom = React.createRef();

    static propTypes = {
        group: PropTypes.object,
        socket:PropTypes.object,
    }
    state = {
        group_id:this.props.group.group_id,
        socket:this.props.socket,
        chatList:[],
        imgUrl:'',
        loading:false,
        message:''
    }
    /*{
        nickname: '试用用户',
        message:'我来试用一下',
        id: '123213',
        avatar:'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        img ?:'',
        time:0
    }*/

    //获取到消息列表
    getChatMessage = (group_id) => {
        axios.get('http://localhost:12306/api/findChatsByGroupId',{
            params:{
                group_id
            }
        }).then(result => {
            this.setState({
                chatList:result.data.result,
                group_id
            },() => {
                this.messagesBottom.current.scrollToBottom();
            })
        }).catch(err => {
            console.log(err);
        })
    }   
    //发送消息
    sendMessage = () => {
        const group = this.props.group;
        const message = this.state.message.trim();
        if(message || this.state.imgUrl){
            //push到chat_list中
            const time = new Date().getTime();
            const newChat = {
                id:this.userData.id,
                nickname:this.userData.nickname,
                message:message,
                avatar:this.userData.avatar,
                img:this.state.imgUrl,
                time
            }
        
            this.setState({
                chatList: this.state.chatList.concat(newChat)
            },() => {
                this.messagesBottom.current.scrollToBottom()
            })
            if(this.props.group.is_group){
                this.props.socket.emit('sendToGroup',{
                    group_id:this.state.group_id,
                    message:message,
                    from:this.userData.id,
                    to:group.group_id,
                    is_group:group.is_group,
                    img:this.state.imgUrl,
                    time
                });
            }else{
                this.props.socket.emit('send',{
                    group_id:this.state.group_id,
                    message:message,
                    from:this.userData.id,
                    to:group.friend_id,
                    is_group:group.is_group,
                    img:this.state.imgUrl,
                    time
                })
            }
        }
        this.setState({message:'',imgUrl:''})
    }
    changeMessage = e => {
        this.setState({
            message:e.target.value
        })
    }
    beforeUpload = file => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.error('只可以发送 JPG/PNG 的图片哦!');
        }
        const isLt4M = file.size / 1024 / 1024 < 4;
        if (!isLt4M) {
          message.error('图片要小于 4MB!');
        }
        return isJpgOrPng && isLt4M;
    }
    handlePictureChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({loading:true})
            return;
          }
          if (info.file.status === 'done') {
            const imgUrl = info.file.response;
            
            getBase64(info.file.originFileObj, img =>{
                this.setState({
                    imgUrl:imgUrl,
                    loading:false
                })
            });
          }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.group.group_id !== this.state.group_id){ //如果是在群组对话中切换
            this.getChatMessage(nextProps.group.group_id);
        }
        const socket = this.props.socket;
        if(nextProps.group.is_group && !this.props.group.is_group){ //如果是好友对话切换到群组对话
            socket.emit('join',nextProps.group.group_id);
        }
        if(!nextProps.group.is_group && this.props.group.is_group){ //如果是群组对话切换到好友对话
            socket.emit('leave',this.state.group_id)
        }
        if(nextProps.group.is_group && this.props.group.is_group && nextProps.group.group_id !== this.state.group_id) {
            socket.emit('leave',this.state.group_id);
            socket.emit('join',nextProps.group.group_id);
        }
    }
    componentDidMount() {
        this.userData = JSON.parse(localStorage.getItem('userData'));
        this.getChatMessage(this.state.group_id);

        this.props.socket.on('sendToPerson', data => {
            //判断是否是当前group的message
            if(this.props.group.friend_id === data.id) {
                this.setState({
                    chatList:this.state.chatList.concat(data)
                },() => {
                    this.messagesBottom.current.scrollToBottom();
                })
            }
        });
        this.props.socket.on('groupMessage',data => {
            this.setState({
                chatList:this.state.chatList.concat(data)
            },() => {
                this.messagesBottom.current.scrollToBottom();
            })
        })
        this.messagesBottom.current.scrollToBottom();
    }

    //渲染对话列表
    renderChatTop = () => {
        return <Scrollbars style={{height:500}} ref={this.messagesBottom}>
            <div className='chat-top'>
                {_.map(this.state.chatList, item => {
                    return <ChatItem chatData={item} key={item.time}/>
                })}
            </div>
        </Scrollbars>
    }
    uploadButton = () => (
        <div style={{fontSize:'20px'}}>
            <Icon type={this.state.loading ? 'loading' : 'picture'} /> 
        </div>
      );

    //渲染输入框
    renderChatBottom = () => {
        return <div className='chat-bottom'>
            <Row >
                <Col span={10} offset={4}>
                    <TextArea
                    rows={4} 
                    onPressEnter={this.sendMessage.bind(this)} 
                    autoSize={{minRows: 3, maxRows: 3 }}
                    onChange={this.changeMessage}
                    className='send-message-text'
                    value={this.state.message}/>
                </Col>
                <Col span={3}>
                    <Upload
                        name="picture"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        beforeUpload={this.beforeUpload}
                        onChange={this.handlePictureChange}
                        action='http://localhost:12306/api/uploadMessageImg'
                        style={{width:'53px'}}
                    >
                        {this.state.imgUrl ? <img src={this.state.imgUrl} style={{ width: '100%' }} /> : this.uploadButton()}
                    </Upload>
                </Col>
                <Col span={3}>
                    <Button onClick={this.sendMessage} type="primary" className='send-message-btn'style={{width:'73px',height:'73px'}} >发送</Button>
                </Col>
            </Row>
        </div>
    }

    render() {
        
        return (
            <div>
            <div className='chat-top-wrapper'>{this.renderChatTop()}</div>
            {this.renderChatBottom()}
            </div>
        )
    }
}
