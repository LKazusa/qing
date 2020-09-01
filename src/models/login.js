import axios from 'axios';
import { encrypt } from '../common/util';
import { message } from 'antd';

export default {
    state: null,
    reducers: {
        setLoginUser(state, action) {
            return action.payload;
        }
    },
    effects: {
        *login({ payload }, { put }) {
            axios.get('http://localhost:12306/api/login', {
                params: {
                    username: payload.username,
                    password: encrypt(payload.password)
                }
            }).then(async loginResult => {
                if (loginResult.data.errorMsg) {
                    message.error(loginResult.data.errorMsg)
                } else {
                    //此处可能bug
                    await put({ type: 'setLoginUser', payload });
                    localStorage.setItem('token', loginResult.data[1]);
                    await put({ type: 'user/refreshUser', payload: loginResult.data[0] });
                    localStorage.setItem('userData', JSON.stringify(loginResult.data[0]))
                    return true;
                }

            }).catch(err => {
                message.error('登录异常');
            })
            return true;
        },
        *loginOut(action, { put }) {
            localStorage.removeItem('userData');
            localStorage.removeItem('token');
            yield put({ type: 'setLoginUser', payload: null })
        },
    },
    subscriptions: {
        syncLocalStorage({ dispatch }) {
            const userData = localStorage.getItem('userData');
            if (userData) { //判断是否刷新userData
                dispatch({ type: 'user/refreshUser', payload: userData })
            }
        }
    }
}