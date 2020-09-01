import React,{useState,useEffect} from 'react';
import Dynamic from '../../components/dynamic';
import UploadDynamic from '../../components/uploadDynamic';
import {Col,Row,message} from 'antd';
import axios from 'axios';
import _ from 'lodash';

export default function Circle() {
    const [circleIds, setCircleIds] = useState([]);

    //将当前用户的朋友ids和自身的id传入后端，返回所有的动态id
    const getCircleIds = async () => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if(userData.friends){
            await axios.get('http://localhost:12306/api/getDynamicId',{
                params:{
                    friends:userData.friends + ',' + userData.id
                }
            }).then(response => {
                setCircleIds(response.data.dynamic_ids);
            }).catch(err => {
                message.error('请求出错')
            })
        }
    }
    useEffect(() => {
        getCircleIds();
    },[])

    return (
        <div>
            <Row>
                <Col span={9} offset={8}>
                    <UploadDynamic refreshData={getCircleIds}/>
                </Col>
            </Row>
            <Row>
                <Col span={18} offset={3}>
                    {circleIds.length > 0 && <Dynamic circleIds={circleIds}/>}
                </Col>    
            </Row>
        </div>
    )
}
