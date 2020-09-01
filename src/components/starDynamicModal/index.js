import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Modal, Card, Col, Row, List, Avatar, Icon, message } from 'antd'
import moment from 'moment'
import axios from 'axios'
import Commonts from '../comments';
import AddComment from '../addComment';
import { Scrollbars } from 'react-custom-scrollbars';
import _ from 'lodash';

const { Meta } = Card;

const IconText = ({ type, text, theme, onClick }) => (
    <span onClick={onClick}>
        <Icon type={type} style={{ marginRight: 8 }} theme={theme} />
        {text}
    </span>
);
const index = props => {
    const [likeList, setLikeList] = useState(props.dynamic.like ? props.dynamic.like : []);
    const [starList, setStarList] = useState(props.dynamic.star ? props.dynamic.star : []);
    const [comment, setComment] = useState('');
    const [commentsList, setCommentsList] = useState([]);
    const [showAddComments, setShowAddComments] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:12306/api/findComments', {
            params: {
                dynamic_id: props.dynamic.dynamic_id
            }
        }).then(res => {
            if (res.data && res.data.list && res.data.list instanceof Array) {
                setCommentsList(res.data.list);
            }
        }).catch(err => {
            message.error('获取评论失败')
            console.log(err);
        })
    }, []);

    //处理收藏
    const handleStar = (dynamic_id) => {
        const user_id = window.userData.id;
        if (starList.includes(user_id)) { //取消收藏
            axios.get('http://localhost:12306/api/star', {
                params: {
                    dynamic_id,
                    id: user_id,
                    star_type: '0'
                }
            }).then(() => {
                message.success('取消收藏', 0.5);
                setStarList(_.filter(starList, (item) => item !== user_id))
            })
        } else { //收藏
            axios.get('http://localhost:12306/api/star', {
                params: {
                    dynamic_id,
                    id: user_id,
                    star_type: '1'
                }
            }).then(() => {
                message.success('收藏', 0.5);
                setStarList(starList.concat(user_id))
            })
        }
    }
    //处理点赞
    const handleLike = (dynamic_id) => {
        const user_id = window.userData.id;
        if (likeList.includes(user_id)) { //取消点赞
            axios.get('http://localhost:12306/api/like', {
                params: {
                    dynamic_id,
                    id: user_id,
                    like_type: '0'
                }
            }).then(() => {
                message.success('取消点赞~~', 0.5);
                setLikeList(_.filter(likeList, (item) => item !== user_id))
            })
        } else { //点赞
            axios.get('http://localhost:12306/api/like', {
                params: {
                    dynamic_id,
                    id: user_id,
                    like_type: '1'
                }
            }).then(() => {
                message.success('点赞~~', 0.5);
                setLikeList(likeList.concat(user_id));
            })
        }
    }
    //发送评论
    const submitComment = () => {

    }

    //显示添加评论页面
    const showAddMessagePanel = () => {
        setShowAddComments(!showAddComments);
    }

    //发送评论成功
    const afterSendMessage = (sendObj) => {

    }

    //渲染内容
    const renderContent = () => {
        return <List
            itemLayout="vertical"
            size="large"
            dataSource={[props.dynamic]}
            renderItem={dynamicData => (
                <div className='dynamic_item_wrapper'>
                    <List.Item
                        style={{ 'backgroundColor': '#fff', 'padding': '15px' }}
                        key={dynamicData.dynamic_id}
                        actions={[
                            <IconText
                                type="star-o"
                                text={starList.length}
                                key="list-vertical-star-o"
                                theme={starList.includes(window.userData.id) ? 'filled' : 'outlined'}
                                onClick={handleStar.bind(this, dynamicData.dynamic_id)} />,
                            <IconText
                                type="like"
                                text={likeList.length}
                                key="list-vertical-like-o"
                                theme={likeList.includes(window.userData.id) ? 'filled' : 'outlined'}
                                onClick={handleLike.bind(this, dynamicData.dynamic_id)} />,
                            <IconText
                                type="message"
                                key="list-vertical-message"
                                theme={showAddComments ? 'filled' : 'outlined'}
                                onClick={showAddMessagePanel} />,
                        ]}
                        extra={
                            <img
                                width={272}
                                src={dynamicData.picture}
                            />
                        }
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={dynamicData.avatar} />}
                            title={<span>{dynamicData.nickname}</span>}
                            description={moment(parseInt(dynamicData.time)).format("YYYY-MM-DD")}
                        />
                        {dynamicData.content}
                    </List.Item>
                    {commentsList.length > 0 && <Commonts commentsList={commentsList} />}
                    {showAddComments &&
                        <AddComment
                            dynamic_id={dynamicData.dynamic_id}
                            from_user_id={dynamicData.user_id}
                            afterMessage={afterSendMessage} />}
                </div>
            )}
        />
    }
    return (
        <Modal
            title="收藏动态"
            visible={props.visible}
            width={800}
            footer={null}
            onOk={props.closeFunc}
            onCancel={props.closeFunc}>
            <Scrollbars style={{ height: 300 }}>
                {renderContent()}
            </Scrollbars>
        </Modal>
    )
}

index.propTypes = {
    dynamic: PropTypes.object,
    visible: PropTypes.bool,
    closeFunc: PropTypes.func
}

export default index