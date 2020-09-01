import { connect } from 'dva';
import Login from '../login';
import { routerRedux } from 'dva/router';

/*后端返回的数据：
    {
        data:[{
            id:string, 用户id
            username:string, 用户名
            password:string 密码
        }],
        status:'success' / '...'
    }
*/
const mapDispatchToProps = dispatch => ({
    async onLogin({ username, password }) {
        const result = await dispatch({ type: 'login/login', payload: { username, password } });
        if (result) {
            dispatch(routerRedux.push('/chat'));
        }
    }
});
export default connect(null, mapDispatchToProps)(Login);