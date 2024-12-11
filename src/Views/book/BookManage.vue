<script setup>
import request from '@/Utils/request.js'
import {
    Edit,
    View,
    Delete,
    Sell,
    SoldOut
} from '@element-plus/icons-vue';
import { ref, onMounted } from 'vue';
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
        "status": ''
    }
])

const newBook = ref(
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
)

const viewBook = ref(
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
)

const dialogVisible = ref(false);
const getDialog = ref(false);
const userType = sessionStorage.getItem('userType');
const intervalId = ref(null);
const currentPage = ref(1);
const pageSize = ref(10);
const bookTotal = ref(0);

import { bookFind, addBookD, deleteBookD, getBookD, borrowBookD, returnBookD, borrowedBookD, bookTotalD } from '@/API/book';

const BookF = async ()=>{
    let result = await bookFind( {page: currentPage.value, pageSize: pageSize.value} );
    let result2 = await bookTotalD();
    bookTotal.value = result2.data;
    book.value = result.data.rows;
    updateAllBookStatuses();
}
onMounted(() => {
    BookF();
    });

const addBook = async()=>{
    //调用接口
    let result = await addBookD(newBook.value);
    ElMessage.success(result.msg?result.msg:'添加成功')

    BookF();
    dialogVisible.value = false;
}

const GetBook = async(row)=>{
    //调用接口
    getDialog.value = true;
    let result = await getBookD(row.id);
    viewBook.value = result.data;
}

const updateAllBookStatuses = async(row)=>{
    let userid = Number(sessionStorage.getItem('userId'));
    // console.log(row.id);
    // if(row.id == undefined) {ElMessage.error('errprrrrrrr');}
    for (let item of book.value) {
        let result = await borrowedBookD({ userId: userid, bookId: item.id });
        console.log(result);
        item.status = result.data;
    }
}

const borrowBook = async(row)=>{
    let result = await borrowBookD( {bookId: row.id} );
    if(result.message == 'success'){
        ElMessage({
            type: 'success',
            message: '借阅成功',
        })
    }else{
        ElMessage({
            type: 'error',
            message: result.message,
        })
    }
    BookF();
}

const returnBook = async(row)=>{
    let result = await returnBookD( {bookId: row.id} );
    if(result.message == 'success'){
        ElMessage({
            type: 'success',
            message: '还书成功',
        })
    }else{
        ElMessage({
            type: 'error',
            message: result.message,
        })
    }
    BookF();
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
        let result = await deleteBookD(row.id);
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      //调用获取邮箱信息函数刷新页面
      BookF();
      dialogVisible.value = false;
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消操作',
      })
    })
}
const openDialog = () => {
      dialogVisible.value = true;
    };
</script>

<template>
    
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>图书管理</span>
                <div class="extra">
                    <el-button type="primary" @click="openDialog">添加图书</el-button>
                </div>
            </div>
             
        </template>
        <el-table :data="book" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column :sortable="true" label="图书名称" prop="title"></el-table-column>
            <el-table-column label="作者" prop="author"></el-table-column>
            <el-table-column label="总数量" prop="total"></el-table-column>
            <el-table-column label="可借阅数量" prop="available"></el-table-column>
            <el-table-column label="借阅次数" prop="count"></el-table-column>
            <el-table-column label="索书号" prop="index"></el-table-column>
            <el-table-column label="操作" width="150">
                <template #default="{ row }">
                    <el-button v-if="row.status==1" :icon="Sell" circle plain type="danger" @click="returnBook(row)"></el-button>
                    <el-button v-else :icon="SoldOut" circle plain type="success" @click="borrowBook(row)"></el-button>
                    <el-button :icon="View" circle plain type="primary" @click="GetBook(row)"></el-button>   
                    <el-button v-if="userType==1" :icon="Delete" circle plain type="danger" @click="deleteBook(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <el-dialog v-model="dialogVisible" title="添加图书" width="100%">
            <el-form :model="newBook"  label-width="100px" style="padding-right: 30px">
                <el-form-item label="图书名称" prop="title">
                    <el-input v-model="newBook.title" minlength="1" maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="作者" prop="author">
                    <el-input v-model="newBook.author" minlength="1" maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="总数量" prop="total">
                    <el-input v-model="newBook.total" minlength="1" maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="可借阅数量" prop="available">
                    <el-input v-model="newBook.available" minlength="1" maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="索书号" prop="index">
                    <el-input v-model="newBook.index" minlength="1" maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="出版时间" prop="index">
                    <el-input v-model="newBook.publishtime" minlength="1" maxlength="30"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible= false">取消</el-button>
                    <el-button type="primary" @click="addBook"> 确认 </el-button>
                </span> 
            </template>
        </el-dialog>

        <el-dialog v-model="getDialog" title="查看图书信息" width="100%">
      <el-form :model="viewBook" label-width="100px" style="padding-right: 30px">
        <el-form-item label="图书名称">
          <el-input v-model="viewBook.title" disabled></el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="viewBook.author" disabled></el-input>
        </el-form-item>
        <el-form-item label="总数量">
          <el-input v-model="viewBook.total" disabled></el-input>
        </el-form-item>
        <el-form-item label="可借阅数量">
          <el-input v-model="viewBook.available" disabled></el-input>
        </el-form-item>
        <el-form-item label="索书号">
          <el-input v-model="viewBook.index" disabled></el-input>
        </el-form-item>
        <el-form-item label="出版时间">
          <el-input v-model="viewBook.publishtime" disabled></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="getDialog = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    </el-card>
    <div class="pagination">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      background
      :size="size"
      :disabled="disabled"
      :background="background"
      layout="prev, pager, next, jumper"
      :total="bookTotal"
      @change="BookF"
    />
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.extra {
  margin-left: auto;
}
</style>