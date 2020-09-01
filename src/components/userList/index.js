import React,{useState} from 'react'
import PropTypes from 'prop-types'
import styles from './userlist.less'
import _ from 'lodash';
import { Card, Avatar } from 'antd';
import {Scrollbars } from 'react-custom-scrollbars';

const { Meta } = Card;

function UserList(props) {
    const [activeClass, setActiveClass] = useState(props.list[0].id)
    const handleClick = (user) => {
        props.changeChatContent(user);
        setActiveClass(user.id)
    }
    return (
        <div className={styles.userListScrollWrapper}>
            <Scrollbars style={{height:500}}>
                <div className={styles.userListWrapper}>
                {_.map(props.list, item => {
                    return <Card 
                        style={{ width: 300}} 
                        key={item.id} 
                        onClick={handleClick.bind(this,item)}
                        className={styles.chatListItem + ' ' + (activeClass === item.id && styles.activeClass)}
                        >
                        <Meta
                            avatar={
                            <Avatar src={item.avatar} />
                            }
                            title={item.nickname || item.group_name}
                        />
                    </Card>;
                })}
                </div>
            </Scrollbars>
            
        </div>
    )
}

UserList.propTypes = {
    list: PropTypes.array,
}

export default UserList


