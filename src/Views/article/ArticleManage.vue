<script setup>
import request from '@/Utils/request.js'
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import { useTokenStore } from '@/stores/token';
import { ElMessage } from 'element-plus';
const articleData = ref({
    page:'',
    pageSize:''
})

const article = ref([
    {
        "title": '',
        "author": '',
        "id": ''
    }
])

const dialogVisible = ref(false)
const editDialog = ref(false)

import { articleFind, addArticleD, deleteArticleD, editArticleD } from '@/API/article';
const articleF = async ()=>{
    let result = await articleFind();
    console.log(result)
    article.value = result.data;

}
onMounted(() => {
    articleF();
    });

const addArticle = async()=>{
    //调用接口
    let result = await addArticleD(article.value);
    ElMessage.success(result.msg?result.msg:'添加成功')

    articleF();
    dialogVisible.value = false;
}

const editArticle = async()=>{
    //调用接口
    let result = await editArticleD(article.value);
    ElMessage.success(result.msg?result.msg:'修改成功')

    articleF();
    editDialog.value = false;
}

import { ElMessageBox } from 'element-plus';

const handleEdit = (row)=>{
    article.value.id = row.id;
    editDialog.value = true;
}

const deleteArticle = (row)=>{
    //确认框
    ElMessageBox.confirm(
    '你确定要删除该论文吗？',
    '警告',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
    )
    .then(async() => {
        //点击确认后调用接口删除
        let result = await deleteArticleD({ id: row.id })
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      //调用获取邮箱信息函数刷新页面
      articleF();
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
                <span>论文管理</span>
                <div class="extra">
                    <el-button type="primary" @click="dialogVisible = true">添加论文</el-button>
                </div>
            </div>
            
        </template>
        <el-table :data="article" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="文章id" prop="id"></el-table-column>
            <el-table-column label="文章名称" prop="title"></el-table-column>
            <el-table-column label="作者" prop="author"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="handleEdit(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteArticle(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <el-dialog v-model="dialogVisible" title="添加论文" width="100%">
            <el-form :model="article"  label-width="100px" style="padding-right: 30px">
                <el-form-item label="title" prop="title">
                    <el-input v-model="article.title" minlength="1" maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="author" prop="author">
                    <el-input v-model="article.author" minlength="1" maxlength="30"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible= false">取消</el-button>
                    <el-button type="primary" @click="addArticle"> 确认 </el-button>
                </span> 
            </template>
        </el-dialog>

        <el-dialog v-model="editDialog" title="修改论文" width="100%">
            <el-form :model="article"  label-width="100px" style="padding-right: 30px">
                <el-form-item label="title" prop="title">
                    <el-input v-model="article.title" minlength="1" maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="author" prop="author">
                    <el-input v-model="article.author" minlength="1" maxlength="30"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editDialog= false">取消</el-button>
                    <el-button type="primary" @click="editArticle"> 确认 </el-button>
                </span> 
            </template>
        </el-dialog>

    </el-card>
</template>