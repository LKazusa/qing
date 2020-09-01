import React from 'react';
import NavLink from 'umi/navlink';
import styles from './header.less';
import { Row, Col, Icon, Menu } from 'antd';

export default function Header() {
    const headOptions = [
        {
            path: '/chat',
            name: '聊天',
            img: 'message'
        },
        {
            path: '/friends',
            name: '好友',
            img: 'team'
        },
        {
            path: '/circle',
            name: '朋友圈',
            img: 'cloud'
        }
    ];

    const renderHeaderOptions = () => {
        return <Menu mode='horizontal' className={styles.header}>
                {headOptions.map(ele => {
                    return <Menu.Item key={ele.path} className={styles.headerItem}>
                        <NavLink className={styles.headerOptions} title={ele.name} to={ele.path}>
                                {ele.name}&nbsp;<Icon type={ele.img} />
                        </NavLink>
                    </Menu.Item>
                })}
        </Menu>
    }
    return (
        <div className={styles.headerContent}>
            {renderHeaderOptions()}
        </div>
    )
}