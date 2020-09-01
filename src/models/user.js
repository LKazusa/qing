export default {
    namespace: 'user',
    state: {
        id: '',
        nickname: '',
        username: '',
        photo: '',
        phone: '',
        email: '',
        sign: '',
        avatar: '',
        group: '',
        friends: ''
    },
    reducers: {
        refreshUser(state, { payload }) {
            return payload;
        }
    },
    effects: {
        *getUser(action, { call, put }) {
            const user = yield call(getNowUser);
            yield put({ type: 'refreshUser', payload: user });
        }
    }
}

function getNowUser() {
    //axios获取当前用户信息
}