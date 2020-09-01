import React,{useState} from 'react'
import {Button,Modal,Form,Input,message} from 'antd';
import * as umi  from 'umi';
import axios from 'axios';
import qs from 'qs';
import {encrypt} from '../../common/util';
import './index.less';

 function OtherSet(props) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const [visible, setVisible] = useState(false);
    const [confirmDirty, setConfirmDirty] = useState(false);
    const { getFieldDecorator } = props.form;

    const showModal = () => {
        setVisible(true);
    }
    const handleCancel = () => {
        setVisible(false);
    }
    const handleSubmit = e => {
        e.preventDefault();
        props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            const sendData = {
                oldPassword:encrypt(values.oldPassword),
                newPassword:encrypt(values.newPassword),
                id:userData.id
            }
            axios.post('http://localhost:12306/api/updatePassword',qs.stringify(sendData))
                .then(res => {
                    message.success('修改成功');
                    setVisible(false);
                }).catch(err => {
                    message.error('修改失败')
                })
          }
        });
    };
    const compareToFirstPassword = (rule, value, callback) => { //密码相同校验
        const { form } = props;
        if (value && value !== form.getFieldValue('newPassword')) {
          callback('两次输入的密码要相同!');
        } else {
          callback();
        }
    };
    const validateToNextPassword = (rule, value, callback) => {
        const { form } = props;
        if (value && confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      };
    const handleConfirmBlur = e => {
        const { value } = e.target;
        setConfirmDirty(confirmDirty || !!value);
    };

    
    const confirmExit = () => {
        Modal.confirm({
            title:'您确定要退出当前用户吗？',
            okText:'确认',
            cancelText:'取消',
            onOk() {
                localStorage.clear();
                window.userData = null;
                window.socket.on('disconnect');
                umi.router.push('/login');
            }
        })
    }
    const editPassord = () => {
        return <Form onSubmit={handleSubmit}>
            <Form.Item label="原密码" hasFeedback>
                {getFieldDecorator('oldPassword', {
                    rules: [
                    {
                        required: true,
                        message: '需要填写原密码!',
                    },
                    {
                        validator: validateToNextPassword,
                    },
                    ],
                })(<Input.Password />)}
            </Form.Item>
            <Form.Item label="密码" hasFeedback>
            {getFieldDecorator('newPassword', {
                rules: [
                {
                    required: true,
                    message: '需要填写新密码!',
                },
                {
                    validator: validateToNextPassword,
                },
                ],
            })(<Input.Password />)}
            </Form.Item>
            <Form.Item label="确认密码" hasFeedback>
            {getFieldDecorator('confirm', {
                rules: [
                {
                    required: true,
                    message: '两次密码怎么不一样!',
                },
                {
                    validator: compareToFirstPassword,
                },
                ],
            })(<Input.Password onBlur={handleConfirmBlur} />)}
            </Form.Item>
        </Form>
    }
    return (
        <div className='export-login-wrapper'>
            <Button icon='edit' type='primary'onClick={showModal}>修改密码</Button>
            <Button icon='export' type='danger' onClick={confirmExit}>退出登录</Button>
            <Modal
                title="修改密码"
                visible={visible}
                onOk={handleSubmit}
                onCancel={handleCancel}
                okText='确定'
                cancelText='取消'
            >
                {editPassord()}
            </Modal>
        </div>
    )
}

export default Form.create({ name: 'editPassord' })(OtherSet);