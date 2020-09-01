import React from 'react'
import PropTypes from 'prop-types'
import {Avatar } from 'antd';

const EditUser = (props) => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    return (
        <div style={{'left':'25px','position':'fixed','bottom':'40px'}}>
            <Avatar 
                size="large" 
                style={{'cursor':'pointer'}}
                src={userData.avatar || 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'}
                onClick={props.showDraw} />
        </div>
    )
}

EditUser.propTypes = {
    showDraw : PropTypes.func
}

export default EditUser;
