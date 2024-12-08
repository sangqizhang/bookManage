<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { ref,onMounted } from 'vue'

const bankAccount = ref([])

//声明一个异步函数
import { bankAccountListService,addBankAccountService,deleteBankAccountService } from '@/API/wallet';
const bankAccountList = async()=>{
    let result = await bankAccountListService();
    bankAccount.value = result.data;
}
onMounted(() => {
    bankAccountList();
    });

 //控制添加分类弹窗
const dialogVisible_add = ref(false)
const dialogVisible_edit = ref(false)

//添加分类数据模型
const bankAccountModel = ref({
    bankAccount: '',
})
//添加分类表单校验
const rules = {
    bankAccount: [
        { required: true, message: '请输入银行卡号', trigger: 'blur' },
    ],
}
//调用接口，提交表单
import { ElMessage } from 'element-plus';
const addBankAccount = async()=>{
    //调用接口
    let result = await addBankAccountService(bankAccountModel.value);
    ElMessage.success(result.msg?result.msg:'添加成功')

    //调用获取邮箱信息函数刷新页面
    bankAccountList();
    dialogVisible_add.value = false;
}

//删除银行账户
import { ElMessageBox } from 'element-plus';
const deleteBankAccount = (row)=>{
    //确认框
    ElMessageBox.confirm(
    '你确定要删除该账户吗？',
    '警告',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
    )
    .then(async() => {
        //点击确认后调用接口删除
        let result = await deleteBankAccountService({ bankAccount: row.account })
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      //调用获取邮箱信息函数刷新页面
      bankAccountList();
      dialogVisible_add.value = false;
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
                <span>银行账户</span>
                <div class="extra">
                    <el-button type="primary" @click="dialogVisible_add = true">新增账户</el-button>
                </div>
            </div>
        </template>
        <el-table :data="bankAccount" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="账号" prop="account"></el-table-column>
            <el-table-column label="余额" prop="balance"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteBankAccount(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 添加分类弹窗 -->
        <el-dialog v-model="dialogVisible_add" title="新增银行账户" width="30%">
            <el-form :model="bankAccountModel" :rules="rules" label-width="100px" style="padding-right: 30px">
                <el-form-item label="银行卡号" prop="bankAccount">
                    <el-input v-model="bankAccountModel.bankAccount" minlength="1" maxlength="30"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="addBankAccount"> 确认 </el-button>
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