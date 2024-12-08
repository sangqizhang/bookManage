//定制请求的示例
import axios from 'axios';
//定义baseURL:公共前缀
const baseURL = 'http://localhost:8080';
const instance = axios.create({baseURL});

import router from '@/router/index.js'
//添加响应拦截器
instance.interceptors.response.use(
    result => {
        return result.data;
    },
    err => {
        //若响应状态码为401，判断为未登录，跳转到登录页面
        if(err.response.status === 401){
            ElMessage.error('请先登录')
            router.push('/login')
        }else{
            console.error("请求错误信息:", err); 
            ElMessage.error('服务异常');
        }
        return Promise.reject(err);//异步的状态转化成失败的状态
    }
)
export default instance;

//添加请求拦截器
import { useTokenStore } from '@/stores/token';
import { ElMessage } from 'element-plus';
instance.interceptors.request.use(
    (config)=>{
        //请求前的回调
        //添加token
        const tokenStore = useTokenStore();
        //判断是否有token
        if(tokenStore.token){
            config.headers.Authorization = tokenStore.token
        }
        return config;
    },
    (err)=>{
        //请求错误的回调
        Promise.reject(err)
    }
)