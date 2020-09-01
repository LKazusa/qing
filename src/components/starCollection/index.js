import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios';
import _ from 'lodash';
import { message, Card, Icon, Avatar } from 'antd';
import moment from 'moment';
import StarDynamicModal from '../starDynamicModal';
const { Meta } = Card;

const StarCollection = props => {
    const [starList, setStarList] = useState([]);
    const [likeArr, setLikeArr] = useState([]);
    const [visiable, setVisiable] = useState(false);
    const [nowDynamic, setNowDynamic] = useState(null);
    useEffect(() => {
        axios.get('http://localhost:12306/api/getStarList', {
            params: {
                user_id: window.userData.id
            }
        }).then(res => {
            const list = res.data.list;
            setStarList(list);
            //初始化like列表
            setLikeArr(_.map(list, item => {
                if (item.like && item.like instanceof Array && item.like.length > 0) {
                    if (item.like.includes(window.userData.id)) {
                        return item.dynamic_id
                    }
                }
            }));
        }).catch(err => {
            message.error('获取收藏列表失败')
        })
    }, []);

    const handleClickLike = (dynamic_id, type) => {
        axios.get('http://localhost:12306/api/like', {
            params: {
                dynamic_id,
                id: window.userData.id,
                like_type: type ? '0' : '1'
            }
        }).then(() => {
            if (type) {
                message.success('取消点赞~~', 0.5);
                setLikeArr(_.filter(likeArr, id => id !== dynamic_id))
            } else {
                message.success('点赞~~', 0.5);
                setLikeArr(likeArr.concat(dynamic_id))
            }
        })
    }

    const handleClickStar = (dynamic_id) => {
        axios.get('http://localhost:12306/api/star', {
            params: {
                dynamic_id,
                id: window.userData.id,
                star_type: '0'
            }
        }).then(() => {
            message.success('取消收藏', 0.5);
            setStarList(_.filter(starList, item => item.dynamic_id !== dynamic_id))
        })
    }

    const handleClickDynamic = (dynamic) => {
        setVisiable(true);
        setNowDynamic(dynamic);
    }

    const closeDynamic = () => {
        setVisiable(false);
    }

    const renderList = () => {
        return _.map(starList, item => {
            let like = false;
            if (likeArr.includes(item.dynamic_id)) {
                like = true;
            }
            return <Card
                style={{ marginTop: 16 }}
                actions={[
                    <Icon type="like"
                        key="like"
                        theme={likeArr.includes(item.dynamic_id) ? 'filled' : 'outlined'}
                        onClick={handleClickLike.bind(null, item.dynamic_id, like)} />,
                    <Icon type="star"
                        key="star"
                        theme='filled'
                        onClick={handleClickStar.bind(null, item.dynamic_id)} />
                ]}
            >
                <Meta
                    avatar={
                        <Avatar src={item.avatar} />
                    }
                    title={item.content}
                    description={moment(parseInt(item.time)).format("YYYY-MM-DD")}
                    onClick={handleClickDynamic.bind(this,item)}
                    style={{cursor:'pointer'}}
                />
                <div style={{position:'relative',right:'15px'}}>{item.nickname}</div>
            </Card>
        })
    }
    return (
        <div>
            {starList.length > 0 && renderList()}
            {visiable && <StarDynamicModal dynamic={nowDynamic} visible={visiable} closeFunc={closeDynamic}/>}
        </div>
    )
}

StarCollection.propTypes = {

}

export default StarCollection
