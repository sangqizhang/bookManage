<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { computed } from 'vue';
//控制注册与登录表单的显示， 默认显示注册
const isRegister = ref(false)
//定义数据模型
const registerData = ref({
    username:'',
    password:'',
    rePassword:''
})

//校验密码函数
const checkRePassword = (rule,value,callback)=>{
    if(value == ''){
        callback(new Error('请在此确认密码'))
    }else if(value !== registerData.value.password){
        callback(new Error('两次输入密码不一致'))
    }else{
        callback()
    }
}

//定义表单校验规则
const rules = {
    username:[
        {required:true,message:'请输入用户名',trigger:'blur'},
        {min:5,max:16,message:'长度为5~16位非空字符',trigger:'blur'}
    ],
    password:[
    {required:true,message:'请输入密码',trigger:'blur'},
    {min:5,max:16,message:'长度为5~16位非空字符',trigger:'blur'}
    ],
    rePassword:[
        {validator:checkRePassword,trigger:'blur'}
    ]
}

//调用后台接口，完成注册 
import {userRegisterService,userLoginService} from '@/API/user.js'
const register = async () => {
    //registerData是一个响应式对象，获取值需要.value
    let result = await userRegisterService(registerData.value)
    
}

//绑定登录数据，复用注册表单的数据模型
//表单数据校验，同样可复用注册表单
//登录函数
import { useTokenStore } from '@/stores/token';
import {useRouter} from 'vue-router'
import { ElMessage } from 'element-plus';
const router = useRouter()
const tokenStore = useTokenStore()
const login = async ()=>{
    let result = await userLoginService(registerData.value);
    console.log(result)
    if(result.code == 200 && result.data.token){
        //将得到的token存储到pinia中
        console.log(result.data.id)
        sessionStorage.setItem('userId',result.data.id)
        sessionStorage.setItem('userType',result.data.type)
        tokenStore.setToken(result.data.token)
        //跳转到主页
        router.push('/')
        //alert(result.msg?result.msg:'登录成功')
        ElMessage.success('登录成功')
    }else{
        ElMessage.error(result.message?result.message:'系统错误')
    }
}

//定义函数清空数据模型数据
const clearRegisterData = () => {
    registerData.value = {
        username:'',
        password:'',
        rePassword:''
    }
}

//校验数据长度，不合规时无法提交
const isFormValid = computed(() => {
    return registerData.value.username.length >= 5 && registerData.value.username.length <= 16 &&
           registerData.value.password.length >= 5 && registerData.value.password.length <= 16 &&
           (registerData.value.password === registerData.value.rePassword || isRegister.value === false);
});
</script>

<template>
    <el-row class="login-page">
        <el-col :span="12" class="bg"></el-col>
        <el-col :span="6" :offset="3" class="form">
            <!-- 注册表单 -->
            <el-form ref="form" size="large" autocomplete="off" v-if="isRegister" :model="registerData" :rules="rules">
                <el-form-item>
                    <h1>注册</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="registerData.password"></el-input>
                </el-form-item>
                <el-form-item prop="rePassword">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入再次密码" v-model="registerData.rePassword"></el-input>
                </el-form-item>
                <!-- 注册按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="register">
                        注册
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = false;clearRegisterData()">
                        ← 返回
                    </el-link>
                </el-form-item>
            </el-form>
            <!-- 登录表单 -->
            <el-form ref="form" size="large" autocomplete="off" v-else :model="registerData" :rules="rules">
                <el-form-item>
                    <h1>登录</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="registerData.password"></el-input>
                </el-form-item>
                <el-form-item class="flex">
                    <div class="flex">
                        <el-checkbox>记住我</el-checkbox>
                        <el-link type="primary" :underline="false">忘记密码？</el-link>
                    </div>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="login">登录</el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = true;clearRegisterData()">
                        注册 →
                    </el-link>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style lang="scss" scoped>
/* 样式 */
.login-page {
    height: 100vh;
    background-color: #fff;

    .bg {
    background: url('@/assets/login.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
    }

    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;

        .title {
            margin: 0 auto;
        }

        .button {
            width: 100%;
        }

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>