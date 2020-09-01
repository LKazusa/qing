export default {
    state:{
        friends:[]
    },
    reducer:{
        updateFriendsList(state,{payload}){
            return payload
        }
    },
    effects: {
        *getFriendList({payload}, {call,put}) {
            const friends = yield call(getFriendList);
            yield put({type:'updateFriendsList',payload:friends})
        }
    }
}
async function getFriendList () {
    const user_id = localStorage.getItem('userData');
    
}