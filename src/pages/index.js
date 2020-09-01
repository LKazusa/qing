/**
 * Routes:
 *      - src/router/PrivateRouter
 */
import React from 'react'
import axios from 'axios';
import * as umi from 'umi';

if (!localStorage.getItem('userData')) {
    umi.router.push('/login');
}
//对于所有请求数据的处理，添加token头
axios.interceptors.request.use(function (config) {
    config.withCredentials = false;
    config.headers['Authorization'] = localStorage.getItem('token');
    return config;
}, function (error) {
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    if (response.data === '请重新登录') {
        umi.router.push('/login');
        return;
    } else {
        return response;
    }
}, function (error) {
    return Promise.reject(error);
});

export default function index() {

    return (
        <div>
            <h1>欢迎页</h1>
        </div>
    )
}