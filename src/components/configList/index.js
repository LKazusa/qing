import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Col, Row, Button, Drawer, Badge } from 'antd';
import Alert from '../alert';
import StarCollection from '../starCollection';
import axios from 'axios';
import _ from 'lodash';
import './index.less';

const ConfigList = props => {
    //是否显示回到顶部
    const [toTop, setToTop] = useState(false);
    //确定右侧抽屉内的内容
    const [drawContent, setDrawContent] = useState('');
    //是否显示右侧抽屉
    const [visible, setVisible] = useState(false);
    //通知的右上角的红色标记数量
    const [redPoint, setRedPoint] = useState(0 + props.addFriendNumber);
    //未读通知
    const [noReadAlert, setNoReadAlert] = useState([]);

    const handleScroll = () => {
        let scrollTop = document.documentElement.scrollTop;
        if (scrollTop > 100) {
            setToTop(true)
        } else {
            setToTop(false);
        }
    }
    const onClose = () => {
        setVisible(false);
        setDrawContent('');
    }
    const backTo = () => {
        window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth',
        });
    }
    useEffect(() => {
        window.addEventListener('scroll', handleScroll, true);
    }, []);

    useEffect(() => {
        //获取当前未读的消息数量
        axios.get('http://localhost:12306/api/queryBeforeReadAlert', {
            params: {
                user_id: JSON.parse(localStorage.getItem('userData')).id
            }
        }).then(res => {
            res && setRedPoint(res.data.alertList.length);
            res && setNoReadAlert(res.data.alertList);
        })
    }, [props.addFriendNumber]);

    const handleClickAlert = () => {
        setVisible(true);
        setDrawContent('alert');
    }
    const handleClickStar = () => {
        setVisible(true);
        setDrawContent('star');
    }
    const checkNullArr = (arr) => {
        if(arr instanceof Array){
            let flag = true;
            if(arr.length > 0){
                _.each(arr,item => {
                    if(!item){
                        flag = false;
                    }
                });
                return flag;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }

    //在访问成功后清除未读的红色标记
    const clearRedPoint = (number, optionId) => {
        const alert_id = optionId ? [optionId] : _.map(noReadAlert, item => {
            if(item.type !== 'addFriend'){
                return item._id;
            }
        });
        
        checkNullArr(alert_id) && axios.get('http://localhost:12306/api/readAlert', {
            params: {
                alert_id
            }
        }).then(() => {
            setRedPoint(number);
        })
    }
    return (
        <div className='config-list-wrapper'>
            <Row span={4}>
                <Col>
                    <Badge count={redPoint}>
                        <Button
                            className='config-bell-btn'
                            icon='bell'
                            size='large'
                            onClick={handleClickAlert}>
                        </Button>
                    </Badge>
                </Col>
            </Row>
            <Row span={4}>
                <Col>
                    <Button
                        className={toTop ? 'config-star-btn' : 'config-star-btn-bottom'}
                        icon='star'
                        size='large'
                        onClick={handleClickStar}></Button>
                </Col>
            </Row>
            <Row span={4}>
                <Col>
                    {
                        toTop && <Button
                            className='config-top-btn'
                            icon="vertical-align-top"
                            size='large'
                            onClick={backTo}></Button>
                    }
                </Col>
            </Row>
            <Drawer
                title={drawContent === 'alert' ? '通知' : '收藏'}
                placement="right"
                closable={false}
                onClose={onClose}
                visible={visible}
                width={320}
            >
                {drawContent === 'alert' && <Alert clearRedPoint={clearRedPoint} />}
                {drawContent === 'star' && <StarCollection />}
            </Drawer>
        </div>
    )
}

ConfigList.propTypes = {
    addFriendNumber: PropTypes.number
}

export default ConfigList
