import React,{useState} from 'react'
import PropTypes from 'prop-types';
import EditItem from '../editItem';
import {List,Input,Avatar,Upload,Icon} from 'antd';
import './index.less';

function index(props) {
    const userData = JSON.parse(localStorage.getItem('userData'));

    const data = [
        {
            title:'头像',
            type:'avatar',
            content:userData.avatar
        },
        {
            title:'昵称',
            type:'nickname',
            content:userData.nickname
        },
        {
            title:'签名',
            type:'sign',
            content:userData.sign
        },{
            title:'电话',
            type:'phone',
            content:userData.phone
        },{
            title:'email',
            type:'email',
            content:userData.email
        }
    ];

    const [loading, setLoading] = useState(false);
    const [imgUrl, setImgUrl] = useState(userData.avatar);
    const beforeUpload = file => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.error('只可以上传 JPG/PNG 的图片哦!');
        }
        const isLt4M = file.size / 1024 / 1024 < 4;
        if (!isLt4M) {
          message.error('图片要小于 4MB!');
        }
        return isJpgOrPng && isLt4M;
    }
    const handlePictureChange = info => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
          }
          if (info.file.status === 'done') {
            const avatar = info.file.response;
            getBase64(info.file.originFileObj, img =>{
                setImgUrl(avatar);
                setLoading(false);
            });
          }
    }
    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    
    const renderAvatar = () => {
        return <Upload
        name="picture"
        listType="picture-card"
        className="avatar-update-loader"
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handlePictureChange}
        data={{id:userData.id,origin:userData.avatar}}
        action='http://localhost:12306/api/updateAvatar'
    >
        <img src={imgUrl} style={{width:'100%',borderRadius: '50%'}} />
    </Upload>
    }

    return (
        <div className='edit-user-base-wrapper'>
           <List
            dataSource={data}
            renderItem = {item => (
                <List.Item>
                {item.type === 'avatar' ? renderAvatar() : <EditItem editObj={item}/>}
                </List.Item>
              )}
           /> 
        </div>
    )
}

index.propTypes = {

}

export default index

