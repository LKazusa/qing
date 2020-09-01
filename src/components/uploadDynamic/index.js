import React,{useState} from 'react'
import PropTypes from 'prop-types'
import {Col,Row,Upload, message, Input,Button,Icon} from 'antd';

import axios from 'axios';
import Qs from 'qs'
import './index.less';

const UploadDynamic = props => {
    const [loading, setLoading] = useState(false);
    const [pictureFlag, setPictureFlag] = useState(false);
    const [imgUrl, setImgUrl] = useState('');
    const [value, setValue] = useState('');
    const userData = JSON.parse(localStorage.getItem('userData'));

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
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
            const dynamicItem = info.file.response;
            //此时的dynamicItem : {
            //     dynamic_id:string,
            //     picture:string
            // }
            setPictureFlag(true);
            
            getBase64(info.file.originFileObj, img =>{
                setImgUrl(dynamicItem.picture);
                setLoading(false);
            });
          }
    }

    const handleSubmit = async () => {
        if(loading){
            message.error('请等待图片上传完毕后再发布哦')
            return;
        }
        if(!value.trim()){
            message.error('请填写内容哦');
            return;
        }
        const data = {
            user_id:userData.id,
            content:value.trim(),
            time:Date.now(),
            like:[],
            comments:[]
        }
        if(pictureFlag) { //上传了图片
            data.picture = imgUrl;
        }else { //没有上传图片
            data.picture = '';
        }
        await axios.post('http://localhost:12306/api/insertDynamic',Qs.stringify(data),{
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(response => {
            if(response.data.msg === 'success'){
                message.success('发表成功！');
                setValue('');
                props.refreshData();
            }else{
                message.error('发表失败');
            }
        }).catch(err => {
            message.error(err);
        })
    }
    const inputChange = e => {
        setValue(e.target.value);
    }
    const uploadButton = () => (
        <div style={{fontSize:'20px'}}>
            <Icon type={loading ? 'loading' : 'picture'} />
        </div>
      );

    return (
        <div>
            <Row>
                <Col span={16}>
                    <Input.TextArea 
                        value={value} 
                        onChange={inputChange} 
                        placeholder='说点什么吧~'
                        autoSize={{minRows: 3, maxRows: 3}}/>
                </Col>
                <Col span={4}>
                <Upload
                    name="picture"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handlePictureChange}
                    data={{id:userData.id}}
                    action='http://localhost:12306/api/addDymanicPiture'
                >
                    {imgUrl ? <img src={imgUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton()}
                </Upload>
                </Col>
                <Col span={4}>
                <Button 
                    style={{width:'73px',height:'73px'}} 
                    type='primary'
                    onClick = {handleSubmit}>发表</Button>
            </Col>
            </Row>
        </div>
    )
}

UploadDynamic.propTypes = {
    refreshData:PropTypes.func
}

export default UploadDynamic;
