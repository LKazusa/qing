import React,{useState} from 'react';
import {Form,Input,Tooltip,Icon,Row,Col,Button,AutoComplete} from 'antd';
const AutoCompleteOption = AutoComplete.Option;
import Link from 'umi/link';
import './index.less';

function RegisterLayout(props) {
    const [autoComplete, setAutoComplete] = useState([]);
    const [confirmDirty, setConfirmDirty] = useState(false);
    const handleSubmit = e => {
        e.preventDefault();
        props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            props.onRegister(values);
          }
        });
    };
    const compareToFirstPassword = (rule, value, callback) => { //密码相同校验
        const { form } = props;
        if (value && value !== form.getFieldValue('password')) {
          callback('两次输入的密码要相同!');
        } else {
          callback();
        }
    };
    const handleEmailChange = value => {
        let autoCompleteResult;
        if (!value) {
          autoCompleteResult = [];
        } else {
          autoCompleteResult = ['@163.com', '@qq.com', '@gmail.com'].map(domain => `${value}${domain}`);
        }
        setAutoComplete(autoCompleteResult);
    };
    const handleConfirmBlur = e => {
        const { value } = e.target;
        setConfirmDirty(confirmDirty || !!value);
      };
    const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      };
      const tailFormItemLayout = {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 16,
            offset: 8,
          },
        },
      };
    const { getFieldDecorator } = props.form;
    const emailOptions = autoComplete.map(email => (
        <AutoCompleteOption key={email}>{email}</AutoCompleteOption>
      ));
    const validateToNextPassword = (rule, value, callback) => {
        const { form } = props;
        if (value && confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      };
    return (
      <div className='login-wrapper'>
      <div className='login-background'></div>
        <Row className='register-wrapper'>
            <Col span={10} offset={6}>
                <Form {...formItemLayout} onSubmit={handleSubmit}>
                    <Form.Item label="用户名">
                    {getFieldDecorator('username', {
                        rules: [
                        {
                            required: true,
                            message: '用户名可是登录用哒!',
                        },
                        ],
                    })(<Input placeholder='只限英文的哦~'/>)}
                    </Form.Item>
                    <Form.Item label="密码" hasFeedback>
                    {getFieldDecorator('password', {
                        rules: [
                        {
                            required: true,
                            message: '密码可不能忘!',
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
                    <Form.Item
                    label={
                        <span>
                        昵称&nbsp;
                        <Tooltip title="好友能看得到的名字">
                            <Icon type="question-circle-o" />
                        </Tooltip>
                        </span>
                    }
                    >
                    {getFieldDecorator('nickname', {
                        rules: [{ required: true, message: '你想让其他人怎么称呼你啊?', whitespace: true }],
                    })(<Input />)}
                    </Form.Item>
                    <Form.Item label="电话号码">
                    {getFieldDecorator('phone')(<Input type='number' style={{ width: '100%' }} />)}
                    </Form.Item>
                    <Form.Item label="Email">
                    {getFieldDecorator('email', {
                        rules: [{ required: true, message: '怎么着得留个邮箱吧~' }],
                    })(
                        <AutoComplete
                        dataSource={emailOptions}
                        onChange={handleEmailChange}
                        >
                        <Input />
                        </AutoComplete>,
                    )}
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        注册
                    </Button> <span style={{'color':'#fff'}}>Or</span> <Link to="/login" style={{'color':"deepskyblue"}}>我有账号，回去登录吧！</Link>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
        </div>
    )
}
export default Form.create({ name: 'register' })(RegisterLayout);
