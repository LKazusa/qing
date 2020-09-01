import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Avatar, Icon, message, List, Skeleton } from 'antd';
import Commonts from '../comments';
import AddComment from '../addComment';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';
import './index.less'

const IconText = ({ type, text, theme, onClick }) => (
    <span onClick={onClick}>
        <Icon type={type} style={{ marginRight: 8 }} theme={theme} />
        {text}
    </span>
);
let circleIds = '';

const Dynamic = props => {
    //是否展示添加评论
    const [showMessage, setShowMessage] = useState('');
    //已点赞的动态列表
    const [likeList, setLikeList] = useState({});
    //已收藏的动态列表
    const [starList, setStarList] = useState({});
    //所有动态
    const [dynamicList, setDynamicList] = useState([])

    const [loading, setLoading] = useState(true);

    const getDynamic = () => {
        props.circleIds.forEach(async id => {
            await axios.get('http://localhost:12306/api/findDynamicById', {
                params: {
                    dynamic_id: id
                }
            }).then(res => {
                setDynamicList(dynamicList => {
                    const temp = dynamicList.concat([res.data]);
                    const result = _.sortBy(temp, obj => -parseInt(obj.time))
                    setLoading(false);
                    return result;
                });
                if (res.data.like) { //初始化点赞
                    setLikeList(likeList => ({ [res.data.dynamic_id]: res.data.like, ...likeList }));
                } else {
                    setLikeList(likeList => ({ [res.data.dynamic_id]: [], ...likeList }));
                }
                if (res.data.star) { //初始化收藏
                    setStarList(starList => ({ [res.data.dynamic_id]: res.data.star, ...starList }));
                } else {
                    setStarList(starList => ({ [res.data.dynamic_id]: [], ...starList }));
                }
            }).catch(err => {
                console.log(err);
            })
        })
    }
    if (props.circleIds !== circleIds) {
        circleIds = props.circleIds;
        getDynamic();
    }

    //显示或隐藏添加评论
    const addMessage = (id) => {
        if (id === showMessage) {
            setShowMessage('')
        } else {
            setShowMessage(id);
        }
    }
    //修改是否点赞的状态
    const changeLikeState = (dynamic_id) => {
        if (likeList[dynamic_id].includes(window.userData.id)) { //取消点赞
            axios.get('http://localhost:12306/api/like', {
                params: {
                    dynamic_id,
                    id: window.userData.id,
                    like_type: '0'
                }
            }).then(() => {
                message.success('取消点赞~~', 0.5);
                const like = _.cloneDeep(likeList);
                like[dynamic_id] = _.filter(likeList[dynamic_id], (id) => id !== window.userData.id);
                setLikeList(like);
            })
        } else { //点赞
            axios.get('http://localhost:12306/api/like', {
                params: {
                    dynamic_id,
                    id: window.userData.id,
                    like_type: '1'
                }
            }).then(() => {
                message.success('点赞~~', 0.5);
                const like = _.cloneDeep(likeList);
                like[dynamic_id] = like[dynamic_id].concat(window.userData.id);
                setLikeList(like);
                window.socket && window.socket.emit('like', {
                    dynamic_id,
                    from: userData.id,
                    to: _.filter(dynamicList, dynamic => dynamic_id === dynamic.dynamic_id)[0].user_id
                });
            })
        }
    }

    //修改是否收藏改动态
    const changeStarState = (dynamic_id) => {
        if (starList[dynamic_id].includes(window.userData.id)) { //取消收藏
            axios.get('http://localhost:12306/api/star', {
                params: {
                    dynamic_id,
                    id: window.userData.id,
                    star_type: '0'
                }
            }).then(() => {
                message.success('取消收藏', 0.5);
                const star = _.cloneDeep(starList);
                star[dynamic_id] = _.filter(starList[dynamic_id], (id) => id !== window.userData.id);
                setStarList(star);
            })
        } else { //收藏
            axios.get('http://localhost:12306/api/star', {
                params: {
                    dynamic_id,
                    id: window.userData.id,
                    star_type: '1'
                }
            }).then(() => {
                message.success('已收藏本动态', 0.5);
                const star = _.cloneDeep(starList);
                star[dynamic_id] = star[dynamic_id].concat(window.userData.id);
                setStarList(star);
            })
        }
    }

    const afterMessage = (commentObj) => {
        const list = _.cloneDeep(dynamicList);
        _.each(list, item => {
            if (item.dynamic_id === commentObj.dynamic_id) {
                if (item.comments) {
                    item.comments.unshift(commentObj);
                } else {
                    item.comments = [commentObj]
                }
            }
        });
        setDynamicList(list);
    }

    const renderItem = () => {
        return <List
            itemLayout="vertical"
            size="large"
            dataSource={dynamicList}
            renderItem={dynamicData => (
                <Skeleton loading={loading} avatar active>
                    <div className='dynamic_item_wrapper'>
                        <List.Item
                            style={{ 'backgroundColor': '#fff', 'padding': '15px' }}
                            key={dynamicData.dynamic_id}
                            className={dynamicData.picture ? 'dynamic_item_pic' : 'dynamic_item_nopic'}
                            actions={[
                                <IconText
                                    type="star-o"
                                    text={starList[dynamicData.dynamic_id] ? starList[dynamicData.dynamic_id].length : 0}
                                    key="list-vertical-star-o"
                                    theme={starList[dynamicData.dynamic_id] && starList[dynamicData.dynamic_id].includes(window.userData.id) ? 'filled' : 'outlined'}
                                    onClick={changeStarState.bind(this, dynamicData.dynamic_id)} />,
                                <IconText
                                    type="like"
                                    text={likeList[dynamicData.dynamic_id] ? likeList[dynamicData.dynamic_id].length : 0}
                                    key="list-vertical-like-o"
                                    theme={likeList[dynamicData.dynamic_id] && likeList[dynamicData.dynamic_id].includes(window.userData.id) ? 'filled' : 'outlined'}
                                    onClick={changeLikeState.bind(this, dynamicData.dynamic_id)} />,
                                <IconText
                                    type="message"
                                    key="list-vertical-message"
                                    theme={showMessage === dynamicData.dynamic_id ? 'filled' : 'outlined'}
                                    onClick={addMessage.bind(this, dynamicData.dynamic_id)} />,
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
                        {dynamicData.comments && <Commonts commentsList={dynamicData.comments} />}
                        {showMessage === dynamicData.dynamic_id &&
                            <AddComment
                                dynamic_id={dynamicData.dynamic_id}
                                from_user_id={dynamicData.user_id}
                                afterMessage={afterMessage} />}
                    </div>
                </Skeleton>
            )}
        />
    }
    return (
        <div>
            {dynamicList.length > 0 && renderItem()}
        </div>
    )
}

Dynamic.propTypes = {
    circleIds: PropTypes.array
}

export default Dynamic;