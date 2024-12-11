import {createRouter,createWebHistory} from 'vue-router'

//导入组件
import LoginVue from '@/Views/Login.vue'
import Layout from '@/Views/Layout.vue'

import ArticleManageVue from '@/Views/article/ArticleManage.vue'
import BookManageVue from '@/Views/book/BookManage.vue'
import BookInfoVue from '@/Views/book/BookInfo.vue'
import UserManageVue from '@/Views/user/UserManage.vue'

import UserAvatarVue from '@/Views/user/UserAvatar.vue'
import UserInfoVue from '@/Views/user/UserInfo.vue'
import UserResetPasswordVue from '@/Views/user/UserResetPassword.vue'

//定义路由关系
const routes = [
    {path:'/login',component:()=>import('@/Views/Login.vue')},
    {
        path:'/',
        component:Layout,
        redirect: '/article/article',
        //子路由
        children:[
            {path:'/article/article',component:ArticleManageVue},
            {path:'/book',component:BookManageVue},
            {path:'/book/info',component:BookInfoVue},
            {path:'/userManage',component:UserManageVue},
            {path:'/user/info',component:UserInfoVue},
            {path:'/article/avatar',component:UserAvatarVue},
            {path:'/user/passwd',component:UserResetPasswordVue}
        ]
    }
]

//创建路由器
const router = createRouter({
    history:createWebHistory(),
    routes:routes
})

//导出路由
export default router