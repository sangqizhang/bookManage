<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { ref,onMounted } from 'vue'
const emails = ref([
    {
        "email":"12345@qq.com"
    },
    {
        "email":"12345@whu.edu.cn"
    },
    {
        "email":"12345@gmail.com"
    },
])

//声明一个异步函数
import { emailListService,addEmailService,deleteEmailService } from '@/API/wallet';
const emailList = async()=>{
    let result = await emailListService();
    emails.value = result.data;
}
onMounted(() => {
      emailList();
    });

//控制添加分类弹窗
const dialogVisible = ref(false)

//添加分类数据模型
const emailModel = ref({
    email: ''
})
//添加分类表单校验
const rules = {
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
    ],
}

//调用接口，提交表单
import { ElMessage } from 'element-plus';
const addEmail = async()=>{
    //调用接口
    let result = await addEmailService(emailModel.value);
    ElMessage.success(result.msg?result.msg:'添加成功')

    //调用获取邮箱信息函数刷新页面
    emailList();
    dialogVisible.value = false;
}

//定义变量控制标题展示
const title = ref('')

//展示编辑弹窗
const showDialog = (row)=>{
    dialogVisible.value = true;
    title.value = '修改邮箱地址'
    //数据拷贝
    emailModel.value.email = row.email;
}

//删除邮箱
import { ElMessageBox } from 'element-plus';
const deleteEmail = (row)=>{
    //确认框
    ElMessageBox.confirm(
    '你确定要删除该邮箱吗？',
    '警告',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
    )
    .then(async() => {
        //点击确认后调用接口删除
        let result = await deleteEmailService({ email: row.email })
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      //调用获取邮箱信息函数刷新页面
        emailList();
        dialogVisible.value = false;
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消操作',
      })
    })
}
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>邮箱</span>
                <div class="extra">
                    <el-button type="primary" @click="dialogVisible = true;title = '新增邮箱'">新增邮箱</el-button>
                </div>
            </div>
        </template>
        <el-table :data="emails" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="Email" prop="email"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteEmail(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 添加分类弹窗 -->
        <el-dialog v-model="dialogVisible" :title="title" width="30%">
            <el-form :model="emailModel" :rules="rules" label-width="100px" style="padding-right: 30px">
                <el-form-item label="邮箱地址" prop="email">
                    <el-input v-model="emailModel.email" minlength="1" maxlength="30"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="addEmail()"> 确认 </el-button>
                </span>
            </template>
        </el-dialog>
    </el-card>
</template>

<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
</style>