import React from 'react'
import Link from 'umi/link';
import PropTypes from 'prop-types'
import {Form, Input, Button,Icon,Col,Row} from 'antd';
import './index.less';

const Login = props => {
    const { getFieldDecorator } = props.form;
    const handleSubmit = e => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                props.onLogin && props.onLogin(values);
            }
          });
    }
    return (
        <div className='login-wrapper'>
            <div className='login-background'></div>
            <Row className='login-content'>
                <Col span={6} offset={10}>
                    <Form onSubmit={handleSubmit} className="login-form">
                        <Form.Item>
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: '请输入用户名啊！' }],
                        })(
                            <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Username"
                            />,
                        )}
                        </Form.Item>
                        <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '别忘了还有密码啊！' }],
                        })(
                            <Input
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            placeholder="Password"
                            />,
                        )}
                        </Form.Item>
                        <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
                        <span style={{'color':'#fff'}}>Or</span> <Link style={{'color':"deepskyblue"}} to="/register">还没有账号，申请一个！</Link>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

Login.propTypes = {

}

export default Form.create({ name: 'login' })(Login);
