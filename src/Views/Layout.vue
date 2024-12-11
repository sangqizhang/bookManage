<script setup>
import {
    Management,
    Promotion,
    Notebook,
    House,
    Document,
    UserFilled,
    User,
    Lock,
    Crop,
    SetUp,
    EditPen,
    SwitchButton,
    CaretBottom
} from '@element-plus/icons-vue';
import avatar from '@/assets/default.png';

import { useRouter } from 'vue-router';

import { ref,onMounted } from 'vue';

const router = useRouter();

const Info = ref([
    {
        
        "username": '',
        "type": '',
        "regtime": '',
        "name":'',
        "phone":'',
        "email":''
    }
]);

const userId=sessionStorage.getItem('userId');
//声明一个异步函数
import { userFindService } from '@/API/user';
const userInfo = async()=>{
    let result = await userFindService(userId);
    
    Info.value = result.data;
}

onMounted(() => {
    userInfo();
    });

const logout = ()=>{
    //清除用户信息
    sessionStorage.removeItem('userId');
    //跳转到登录页面
    router.push('/login');
}
const profile = ()=>{
    router.push('/user/info');
}
const password = ()=>{
    router.push('/user/passwd');
}
const handleCommand = (command) => {
    if (command === 'logout') {
        logout();
    } else if (command === 'profile') {
        profile();
    } else if (command === 'password') {
        password();
        // 处理重置密码
    }
};

const userType = sessionStorage.getItem('userType');
</script>

<template>
    <!-- element plus中的容器 -->
    <el-container class="layout-container">
        <!-- 左侧菜单 -->
        <el-aside width="200px">
            <div class="el-aside__logo"></div>
            <!-- element plus的菜单标签 -->
            <el-menu active-text-color="#ffd04b" background-color="#232323"  text-color="#fff"
                router>
                <el-menu-item index="/article/article">
                    <el-icon>
                        <Document />
                    </el-icon>
                    <span>论文管理</span>
                </el-menu-item>
                <el-menu-item index="/book">
                    <el-icon>
                        <Notebook />
                    </el-icon>
                    <span>书籍管理</span>
                </el-menu-item>
                <el-menu-item v-if="userType==1" index="/userManage">
                    <el-icon>
                        <User />
                    </el-icon>
                    <span>用户管理</span>
                </el-menu-item>
                
                <!-- 子菜单标签 -->
                <el-sub-menu >
                    <template #title>
                        <el-icon>
                            <House />
                        </el-icon>
                        <span>个人中心</span>
                    </template>
                    <el-menu-item index="/user/info">
                        <el-icon>
                            <SetUp />
                        </el-icon>
                        <span>基本资料</span>
                    </el-menu-item>
                    <el-menu-item index="/user/passwd">
                        <el-icon>
                            <Lock />
                        </el-icon>
                        <span>修改密码</span>
                    </el-menu-item>
                    
                </el-sub-menu>
            </el-menu>
        </el-aside>
        <!-- 右侧主区域 -->
        <el-container>
            <!-- 头部区域 -->   
            <el-header>
                <div>当前用户：<strong>{{Info.username}}</strong></div>
                <!-- 下拉菜单 -->
                <el-dropdown @command="handleCommand" placement="bottom-end">
                    <span class="el-dropdown__box">
                        <el-avatar :src="avatar" />
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="profile" :icon="User">基本资料</el-dropdown-item>
                            <el-dropdown-item command="password" :icon="EditPen">重置密码</el-dropdown-item>
                            <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <!-- 中间区域 -->
            <el-main>
                <router-view></router-view>
            </el-main>
            <!-- 底部区域 -->
        </el-container>
    </el-container>
</template>


<style lang="scss" scoped>
.layout-container {
    height: 100vh;

    .el-aside {
        background-color: #232323;

        &__logo {
            height: 120px;
            background: url('@/assets/logo.png') no-repeat center / 120px auto;
        }

        .el-menu {
            border-right: none;
        }
    }

    .el-header {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .el-dropdown__box {
            display: flex;
            align-items: center;

            .el-icon {
                color: #999;
                margin-left: 10px;
            }

            &:active,
            &:focus {
                outline: none;
            }
        }
    }

    .el-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;
    }
}
</style>