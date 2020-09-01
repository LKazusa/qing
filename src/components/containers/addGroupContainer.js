import { connect } from 'dva';
import AddGroup from '../addGroup';
import { message } from 'antd';
import axios from 'axios';
import Qs from 'qs';
import { refreshData } from "../../common/util";

const mapStateToProps = state => ({
    friends: ['123']
})
const mapDispatchToProps = dispatch => ({
    async submitAddGroup(obj, callback) {
        axios.post('http://localhost:12306/api/addGroup', Qs.stringify(obj)).then(res => {
            callback();
            refreshData();
            window.socket && window.socket.emit('createGroup', {
                from: window.userData.id,
                payload: {
                    group_id: obj.group_id,
                    group_name: obj.group_name,
                    ids: obj.member_ids
                }
            })
            message.success('创建成功');
        }).catch(err => {
            message.error('创建失败');
        });
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(AddGroup);