import axios from "axios";
import CryptoJS from 'crypto-js';
import { Button, notification } from 'antd';

export const refreshData = () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    axios.get('http://localhost:12306/api/getUserById', {
        params: {
            id: userData.id
        }
    }).then(res => {
        localStorage.setItem('userData', JSON.stringify(res.data.result));
        window.userData = res.data.result;
    }).catch(error => {
        console.log(error);
    })
}

// export const refreshUserDynamic = () => {
//     const user_id =  window.userData && window.userData.id;
//     axios.get('http://localhost:12306/api/getUserDynamic',{
//         params:{
//             user_id
//         }
//     }).then(response => {
//         console.log(response.data)
//     }).catch(err => {
//         console.log(err)
//     })
// }

//加密
export const encrypt = (str) => {
    var key = CryptoJS.enc.Utf8.parse("56cc7f3c53dc459b");
    var srcs = CryptoJS.enc.Utf8.parse(str);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

//解密
export const decrypt = (str) => {
    var key = CryptoJS.enc.Utf8.parse("56cc7f3c53dc459b");
    var decrypt = CryptoJS.AES.decrypt(str, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}

export const handleNotice = (noticeData) => {
    notification.open({
        message: noticeData.title,
        description: noticeData.content,
    });
    refreshData()
}