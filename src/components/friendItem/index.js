import React,{useState} from 'react'
import PropTypes from 'prop-types'

const FriendItem = props => {
    const [friendData, setFriendData] = useState(props.friend);

    return (
        <div className='friend-item' onClick={props.handleClickFriend.bind(this,friendData.id)}>
            <div className=''>{friendData.photo}</div>
            <div className='friend-item-content'>
                <div className='friend-item-content-nickname'>{friendData.nickname}</div>
                <div className='friend-item-content-sign'>{friendData.sign}</div>
            </div>
        </div>
    )
}

FriendItem.propTypes = {
    friend: PropTypes.object,
    handleClickFriend:PropTypes.func,
}

export default FriendItem