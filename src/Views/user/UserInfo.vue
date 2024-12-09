<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { ref,onMounted } from 'vue'

const Info = ref([
    {
        
        "username": '',
        "type": '',
        "regtime": '',
        "name":'',
        "phone":'',
        "email":''
    }
])
const userId=sessionStorage.getItem('userId');
//声明一个异步函数
import { userFindService, userInfoUpdateService } from '@/API/user';
import { ElMessage } from 'element-plus';
const userInfo = async()=>{
    let result = await userFindService(userId);
    
    Info.value = result.data;
}
onMounted(() => {
    userInfo();
    });

const getUserType = (type) => {
    if (type === 1) {
    return '管理员';
    } else if (type === 2) {
    return '普通用户';
    } else if (type === 3) {
    return '未知';
    } else {
    return '未知';
    }
}
const dialogVisible = ref(false);
const editForm = ref({
    userId: '',
    name: '',
    phone: '',
    email: ''
});

const submitEdit = () => {
    editForm.value.userId = userId;
    userInfoUpdateService(editForm.value)
    .then(() => {
        ElMessage({
        message: '资料修改成功',
        type: 'success',
        });
        userInfo();
        dialogVisible.value = false;
    })
    .catch((error) => {
        ElMessage({
        message: '资料修改失败: ' + error.message,
        type: 'error',
        });
    });
};

</script>


<template>
    <h1>基本资料</h1>
    <div v-if="Info">
      用户名：{{ Info.username || '未知' }}
      <br><br>
      姓名：{{ Info.name || '未知' }}
      <br><br>
      手机：{{ Info.phone || '未知' }}
      <br><br>
      邮箱：{{ Info.email || '未知' }}
      <br><br>
      注册时间：{{ Info.regtime || '未知' }}
      <br><br>
      用户属性：{{ getUserType(Info.type) }}
      <br><br>
      <el-button type="primary" @click="dialogVisible = true">修改资料</el-button>
    </div>
    <div v-else>
      加载中...
    </div>

    <el-dialog v-model="dialogVisible" title="修改资料">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitEdit">确认</el-button>
        </span>
      </template>
    </el-dialog>

  </template>