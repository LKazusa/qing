import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Comment, Tooltip, List, Avatar } from 'antd';
import moment from 'moment';

/*
    {
        author: string,
        avatar: string,
        content: string,
        time: number
    }
*/
const Commonts = props => {
    const commentList = _.map(props.commentsList, comment => {
        return {
            author: comment.nickname,
            avatar: <Avatar
                src={comment.avatar}
            />,
            content: <p>{comment.message}</p>,
            datetime: (
                <Tooltip
                    title={moment(parseInt(comment.time)).format('YYYY-MM-DD HH:mm:ss')}>
                    <span>{moment(parseInt(comment.time)).fromNow()}</span>
                </Tooltip>
            )
        }
    });
    return (
        <p style={{ width: '100%' }}>
            <List
                className="comment-list"
                header={`${commentList.length} 回复`}
                itemLayout="horizontal"
                dataSource={commentList}
                renderItem={item => (
                    <li>
                        <Comment
                            actions={[]}
                            author={item.author}
                            avatar={item.avatar}
                            content={item.content}
                            datetime={item.datetime}
                        />
                    </li>
                )}
            />
        </p>
    )
}

Commonts.propTypes = {
    commentsList: PropTypes.array
}

export default Commonts
