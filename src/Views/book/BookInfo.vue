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
        "bookid": '',
        "userid": '',
        "kaesutime": '',
        "karutime": '',
        "title": '',
        "author": '',
        "id": '',
        "title": '',
        "publishtime": '',
        "count": '',
        "total": '',
        "available": '',
        "status": '',
        "hito": ''
    }
])

const viewBook = ref(
    {
        "bookid": '',
        "userid": '',
        "kaesutime": '',
        "karutime": '',
        "title": '',
        "author": '',
        "id": '',
        "title": '',
        "publishtime": '',
        "count": '',
        "total": '',
        "available": '',
        "status": '',
        "hito": ''
    }
)

const getDialog = ref(false);
const userType = sessionStorage.getItem('userType');
const intervalId = ref(null);
const currentPage = ref(1);
const pageSize = ref(10);
const recordTotal = ref(0);

import { recordFind, getBookD, borrowBookD, returnBookD, borrowedBookD, recordTotalD, bookFind } from '@/API/book';
import { userFindService } from '@/API/user';

const recordF = async ()=>{
    let result = await recordFind( {page: currentPage.value, pageSize: pageSize.value} );
    let result2 = await recordTotalD();
    recordTotal.value = result2.data;
    book.value = result.data.rows;
    updateAllRecord();
}
onMounted(() => {
    recordF();
    });

const GetBook = async(row)=>{
    //调用接口
    getDialog.value = true;
    let result = await getBookD(row.bookid);
    viewBook.value = result.data;
}

const updateAllRecord = async(row)=>{
    let userid = Number(sessionStorage.getItem('userId'));
    // console.log(row.id);
    // if(row.id == undefined) {ElMessage.error('errprrrrrrr');}
    for (let item of book.value) {
        let result = await userFindService(item.userid);
        item.hito = result.data.username;
    }
    for (let item of book.value) {
        let result = await getBookD(item.bookid);
        item.title = result.data.title;
        item.author = result.data.author;
    }
}

const borrowBook = async(row)=>{
    let result = await borrowBookD( {bookId: row.bookid} );
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
    recordF();
}

const returnBook = async(row)=>{
    let result = await returnBookD( {bookId: row.bookid} );
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
    recordF();
}
const getStatusType = (type) => {
    if (type === 1) {
    return '未归还';
    } else if (type === 0) {
    return '已归还';
    } else {
    return '错误';
    }
}
</script>

<template>
    
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>借阅信息</span>
            </div>
             
        </template>
        <el-table :data="book" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column :sortable="true" label="图书名称" prop="title"></el-table-column>
            <el-table-column label="图书作者" prop="author"></el-table-column>
            <el-table-column label="借阅者" prop="hito"></el-table-column>
            <el-table-column label="借阅时间" prop="karutime"></el-table-column>
            <el-table-column label="归还时间" prop="kaesutime"></el-table-column>
            <el-table-column :sortable="true" label="图书状态">
                <template #default="{ row }">
                    {{ getStatusType(row.status) }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button v-if="row.status==1" :icon="Sell" circle plain type="danger" @click="returnBook(row)"></el-button>
                    <el-button v-else :icon="SoldOut" circle plain type="success" @click="borrowBook(row)"></el-button>
                    <el-button :icon="View" circle plain type="primary" @click="GetBook(row)"></el-button>   
                 </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>

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
      :total="recordTotal"
      @change="recordF"
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