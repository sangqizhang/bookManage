<script setup>
import request from '@/Utils/request.js'
import {
    Edit,
    View,
    Delete
} from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import { useTokenStore } from '@/stores/token';
import { ElMessage } from 'element-plus';
const userData = ref({
    page:'',
    pageSize:''
})

const user = ref([
    {
        "username": '',
        "type": '',
        "regtime": '',
        "name": '',
        "phone": '',
        "email": '',
    }
])
const useradd = ref(
    {
        "username": '',
        "password": '',
        "type": '',
        "name": '',
        "phone": '',
        "email": '',
    }
)
const viewUser = ref(
    {
        "username": '',
        "password": '',
        "type": '',
        "name": '',
        "phone": '',
        "email": '',
    }
)
const dialogVisible = ref(false)
const getDialog = ref(false)
import { userFind, adduserD, deleteuserD, getUserD } from '@/API/user';
const userF = async ()=>{
    let result = await userFind();
    console.log(result)
    user.value = result.data;

}
onMounted(() => {
    userF();
    });

const adduser = async()=>{
    //调用接口
    let result = await adduserD(useradd.value);
    ElMessage.success(result.msg?result.msg:'添加成功')

    userF();
    dialogVisible.value = false;
}
import { ElMessageBox } from 'element-plus';
const deleteuser = (row)=>{
    //确认框
    ElMessageBox.confirm(
    '你确定要删除该用户吗？',
    '警告',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
    )
    .then(async() => {
        //点击确认后调用接口删除
        let result = await deleteuserD(row.id);
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      userF();
      dialogVisible.value = false;
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消操作',
      })
    })
}

const getUserType = (type) => {
    if (type === 1) {
    return '管理员';
    } else if (type === 2) {
    return '普通用户';
    } else if (type === 3) {
    return '游客';
    } else {
    return '未知';
    }
}

const getUser = async(row)=>{
    getDialog.value = true;
    let result = await getUserD(row.id);
    viewUser.value = result.data;
}
</script>

<template>
    
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>用户管理</span>
                <div class="extra">
                    <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
                </div>
            </div>
            
        </template>
        <el-table :data="user" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="用户名" prop="username"></el-table-column>
            <el-table-column label="注册时间" prop="regtime"></el-table-column>
            <el-table-column label="姓名" prop="name"></el-table-column>
            <el-table-column label="手机" prop="phone"></el-table-column>
            <el-table-column label="邮箱" prop="email"></el-table-column>
            <el-table-column label="用户类型">
                <template #default="{ row }">
                {{ getUserType(row.type) }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="getUser(row)" ></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteuser(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <el-dialog v-model="dialogVisible" title="添加用户" width="100%">
            <el-form :model="useradd"  label-width="100px" style="padding-right: 30px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="useradd.username" minlength="1" maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="useradd.password" minlength="1" maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="用户类型" prop="type">
                    <el-input v-model="useradd.type" minlength="1" maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名" prop="name">
                    <el-input v-model="useradd.name" minlength="1" maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="phone">
                    <el-input v-model="useradd.phone" minlength="1" maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="useradd.email" minlength="1" maxlength="30"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible= false">取消</el-button>
                    <el-button type="primary" @click="adduser"> 确认 </el-button>
                </span> 
            </template>
        </el-dialog>

        <el-dialog v-model="getDialog" title="查看用户信息" width="100%">
      <el-form :model="viewUser" label-width="100px" style="padding-right: 30px">
        <el-form-item label="用户名" prop="username">
            <el-input v-model="viewUser.username" minlength="1" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input v-model="viewUser.password" minlength="1" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="用户类型" prop="type">
            <el-input v-model="viewUser.type" minlength="1" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="name">
            <el-input v-model="viewUser.name" minlength="1" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
            <el-input v-model="viewUser.phone" minlength="1" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="viewUser.email" minlength="1" maxlength="30"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="getDialog = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    </el-card>
</template>