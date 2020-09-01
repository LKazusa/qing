import React, { useEffect, useState } from 'react'
import axios from 'axios';
import PropTypes from 'prop-types'
import _ from 'lodash';
import { Skeleton, Card, Icon, message } from 'antd';
import moment from 'moment'
const { Meta } = Card;

function Alert(props) {
    const [alertList, setAlertList] = useState([]);
    useEffect(() => {
        //清除未读的通知红标
        axios.get('http://localhost:12306/api/getAllAlert', {
            params: {
                user_id: window.userData.id
            }
        }).then(res => {
            let list = [];
            list = res && res.data && res.data.alertList;
            setAlertList(list);
            const len = _.filter(list, item => !item.is_look && item.type === 'addFriend').length;
            props.clearRedPoint(len);
        });

    }, []);
    const handleAgree = (alertItem) => {
        window.socket.emit('agreeAddFriend', alertItem, () => {
            const list = _.cloneDeep(alertList);
            _.each(list, item => {
                if (item._id === alertItem._id) {
                    item.is_look = true;
                }
            });
            const len = _.filter(alertList, item => !item.is_look && item.type === 'addFriend').length;
            props.clearRedPoint(len - 1, alertItem._id);
            setAlertList(list);
            message.success('您已添加了一位好友')
        })
    }

    const handleDisagree = (alertItem) => {
        window.socket.emit('disAgreeAddFriend', alertItem, () => {
            console.log(alertItem)
            const list = _.cloneDeep(alertList);
            _.each(list, item => {
                if (item._id === alertItem._id) {
                    item.is_look = true;
                }
            });
            const len = _.filter(list, item => !item.is_look && item.type === 'addFriend').length;
            props.clearRedPoint(len - 1, alertItem._id);
            setAlertList(list);
            message.success('您已拒绝了好友申请')
        });
    }

    return (
        <div>
            {_.map(alertList, (item) => {
                return <Card
                    style={{ marginTop: 16 }}
                    title={item.title}
                    actions={item.type === 'addFriend' && !item.is_look ? [
                        <div style={{ color: '#5cb85c' }} onClick={handleAgree.bind(null, item)}>
                            <Icon type="check" />
                            <span>同意</span>
                        </div>,
                        <div style={{ color: '#d9534f' }} onClick={handleDisagree.bind(null, item)}>
                            <Icon type="close" />
                            <span>拒绝</span>
                        </div>
                    ] : null}
                    extra={item.is_look ? <span style={{ color: '#5cb85c' }}>已读</span> : <span style={{ color: '#d9534f' }}>未读</span>}
                >
                    <Meta
                        description={item.content}
                    />
                    <p style={{ textAlign: 'right' }}>{moment(parseInt(item.time)).format("YYYY-MM-DD")}</p>
                </Card>
            })}
        </div>
    )
}

Alert.propTypes = {
    clearRedPoint: PropTypes.func
}

export default Alert;
