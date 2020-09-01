import React,{useState} from 'react'
import PropTypes from 'prop-types'
import {Input, Icon, Button, message} from 'antd';
import axios from 'axios';
import qs from 'qs';
import './index.less';

function EditItem(props) {
    const [showInput, setShowInput] = useState(false);
    const [value, setValue] = useState(props.editObj.content)

    const handleClick = () => {
        setShowInput(true);
    }
    const submitChange = () => {
        const data = {
            type:props.editObj.type,
            message:value,
            id:JSON.parse(localStorage.getItem('userData')).id
        }
        
        axios.post('http://localhost:12306/api/updateUserData',qs.stringify(data))
            .then(value => {
                message.success('修改成功');

                const userData = JSON.parse(localStorage.getItem('userData'));
                userData[data.type] = data.message;
                localStorage.setItem('userData',JSON.stringify(userData));

                setShowInput(false);
            })
            .catch(err => {
                message.error('修改失败');
            });
    }
    const cancleChange = () => {
        setValue(props.editObj.content);
        setShowInput(false);
    }
    const handleChange = (e) => {
        setValue(e.target.value)
    }

    const renderEdit = () => {
        return <>
            <Input value={value} onChange={handleChange} type={props.editObj.type === 'phone' ? 'number' :'text'}/>
            <div className='submit-edit-wrapper'>
                <Button type="primary" size='small' onClick={submitChange}>确定</Button>
                <Button type="danger" size='small' onClick={cancleChange}>取消</Button>
            </div>
        </>
    }
    const renderBase = () => {
        return <div className='edit-item-base-wrapper'> 
            <div className='edit-item-title'>{props.editObj.title}</div>
            {showInput ? renderEdit() : <>
                <div>{value}</div>
                <div className='edit-icon-wrapper'>
                    <Icon className='edit-icon' type='edit' onClick={handleClick}/>
                </div>
            </>}
        </div>
    }
    return (
        <div style={{'width':'100%'}}>
           {renderBase()} 
        </div>
    )
}

EditItem.propTypes = {
    editObj:PropTypes.object,
}

export default EditItem

