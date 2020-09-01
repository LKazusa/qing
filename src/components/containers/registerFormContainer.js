import {connect} from 'dva';
import RegisterLayout from '../registerLayout';
import {message} from 'antd';
import axios from 'axios';
import Qs from 'qs'
import {routerRedux} from 'dva/router';
import {encrypt} from '../../common/util';


const mapDispatchToProps = dispatch => ({
    async onRegister (values) {
        values.id = Math.floor(Math.random()*1000) + Date.now(); 
        values.avatar = values.avatar || 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png';
        values.is_group = false;
        values.password = encrypt(values.password);
        const sendData = await axios.post('http://localhost:12306/api/register',Qs.stringify(values),{
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(async(data) => {
            console.log(data.data.token);
            localStorage.setItem('token',data.data.token);
            delete values.password;
            await localStorage.setItem('userData',JSON.stringify(values));
            dispatch(routerRedux.push('/chat'));
            message.success('注册成功');
            
        }).catch(err => {
            message.error('注册失败');
        });
        if(sendData && sendData.status && sendData.status === 200){
            delete values.password;
            dispatch({type:'login/login',payload:{...values}});
        }
    }
})

export default connect(null,mapDispatchToProps)(RegisterLayout);
