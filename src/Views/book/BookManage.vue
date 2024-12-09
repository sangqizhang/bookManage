<script setup>
import request from '@/Utils/request.js'
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import { useTokenStore } from '@/stores/token';
import { ElMessage } from 'element-plus';
const bookData = ref({
    page:'',
    pageSize:''
})

const book = ref([
    {
        "title": '',
        "author": '',
        "id": '',
        "title": '',
        "publishtime": '',
        "count": '',
        "total": '',
        "available": '',
    }
])

const dialogVisible = ref(false)
import { bookFind, addBookD, deleteBookD } from '@/API/book';
const BookF = async ()=>{
    let result = await bookFind();
    console.log(result);
    book.value = result.data;

}
onMounted(() => {
    BookF();
    });

const addBook = async()=>{
    //调用接口
    let result = await addBookD(book.value);
    ElMessage.success(result.msg?result.msg:'添加成功')

    bookF();
    dialogVisible.value = false;
}
import { ElMessageBox } from 'element-plus';
const deleteBook = (row)=>{
    //确认框
    ElMessageBox.confirm(
    '你确定要删除该图书吗？',
    '警告',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
    )
    .then(async() => {
        //点击确认后调用接口删除
        let result = await deleteBookD({ id: row.id })
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      //调用获取邮箱信息函数刷新页面
      bookF();
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
                <span>图书管理</span>
                <div class="extra">
                    <el-button type="primary" @click="dialogVisible = true">添加图书</el-button>
                </div>
            </div>
             
        </template>
        <el-table :data="book" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="图书id" prop="id"></el-table-column>
            <el-table-column label="图书名称" prop="title"></el-table-column>
            <el-table-column label="作者" prop="author"></el-table-column>
            <el-table-column label="总数量" prop="total"></el-table-column>
            <el-table-column label="可借阅数量" prop="available"></el-table-column>
            <el-table-column label="借阅次数" prop="count"></el-table-column>
            <el-table-column label="索书号" prop="index"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" ></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteBook(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <el-dialog v-model="dialogVisible" title="添加图书" width="100%">
            <el-form :model="book"  label-width="100px" style="padding-right: 30px">
                <el-form-item label="title" prop="title">
                    <el-input v-model="book.title" minlength="1" maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="author" prop="title">
                    <el-input v-model="book.author" minlength="1" maxlength="30"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible= false">取消</el-button>
                    <el-button type="primary" @click="addBook"> 确认 </el-button>
                </span> 
            </template>
        </el-dialog>

    </el-card>
</template>