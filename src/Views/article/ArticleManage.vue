<script setup>
import request from '@/Utils/request.js'
import {
    Edit,
    Delete,
    Download,
    UploadFilled,
    Search
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
        "id": '',
        "url": '',
        "publisher": '',
        "count": ''
    }
])

const articleA = ref({
    "title": '',
    "author": '',
    "url": '',
    "publisher": ''
})

const downloadA = ref({
    "url": ''
})

const dialogVisible = ref(false)
const editDialog = ref(false)
const searchContent = ref('')
const select = ref('1')

import { articleFind, addArticleD, deleteArticleD, editArticleD, downloadArticleD, articleSearch, authorSearch, publisherSearch } from '@/API/article';
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
    let result = await addArticleD(articleA.value);
    ElMessage.success(result.msg?result.msg:'添加成功')

    articleF();
    dialogVisible.value = false;
}

const editArticle = async()=>{
    //调用接口
    let result = await editArticleD(articleA.value);
    ElMessage.success(result.msg?result.msg:'修改成功')

    articleF();
    editDialog.value = false;
}

import { ElMessageBox } from 'element-plus';

const handleEdit = (aid)=>{
    articleA.value.id = aid;
    console.log(aid);
    editDialog.value = true;
    articleF();
}

const handleDownload = (aid, url)=>{
    downloadArticleD({ id: aid });
    if (url) {
        window.open(url, '_blank');
    } else {
        ElMessage.error('下载链接获取失败');
    }
    articleF();
}

const deleteArticle = (aid)=>{
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
        let result = await deleteArticleD({ id: aid })
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

const uploadFile = (file, fileList) => {
    console.log(file, fileList);
    const formData = new FormData();
    formData.append('file', file.raw);
    request({
        url: '/upload',
        method: 'post',
        data: formData,
    }).then(res => {
        console.log(res);
        articleA.value.url = res.data;
    }).catch(err => {
        console.log(err);
    })
}

const searchArticle = () => {
    if(select.value === '1') {
        articleSearch({ title: searchContent.value }).then(res => {
            article.value = res.data;
        }).catch(err => {
            console.log(err);
        })
    } else if(select.value === '3') {
        publisherSearch({ publisher: searchContent.value }).then(res => {
            article.value = res.data;
        }).catch(err => {
            console.log(err);
        })
    } else if(select.value === '2') {
        authorSearch({ author: searchContent.value }).then(res => {
            article.value = res.data;
        }).catch(err => {
            console.log(err);
        })
    }
}
const selectChange = () => {
    searchContent.value = '';
    articleF();
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
            <div class="input1">
                <el-input
                v-model="searchContent"
                style="max-width: 600px"
                placeholder="查找内容"
                class="search1"
                @input="searchArticle"
                >
                <template #prepend>
                    <el-button :icon="Search" />
                </template>
                <template #append>
                    <el-select v-model="select" placeholder="Select" style="width: 115px"
                    @change="selectChange">
                    <el-option label="论文题目" value="1" />
                    <el-option label="作者" value="2" />
                    <el-option label="会议/期刊" value="3" />
                    </el-select>
                </template>
                </el-input>
            </div>
        </template>
        <el-table :data="article" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="文章名称" prop="title"></el-table-column>
            <el-table-column label="作者" prop="author"></el-table-column>
            <el-table-column label="会议/期刊" prop="publisher"></el-table-column>
            <el-table-column label="下载次数" prop="count"></el-table-column>
            <el-table-column label="操作" width="150">
                <template #default="{ row }">
                    <el-button :icon="Download" circle plain type="success" @click="handleDownload(row.id, row.url)"></el-button>
                    <el-button :icon="Edit" circle plain type="primary" @click="handleEdit(row.id)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteArticle(row.id)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <el-dialog v-model="dialogVisible" title="添加论文" width="100%">
            <el-form :model="articleA"  label-width="100px" style="padding-right: 30px">
                <el-form-item label="文章名称" prop="title">
                    <el-input v-model="articleA.title" minlength="1" maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="作者" prop="author">
                    <el-input v-model="articleA.author" minlength="1" maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="会议/期刊" prop="publisher">
                    <el-input v-model="articleA.publisher" minlength="1" maxlength="30"></el-input>
                </el-form-item>
                <el-upload class="uploadfile"
                    drag
                    action="none"
                    multiple
                    :auto-upload="false"
                    :on-change="(file, fileList) => { uploadFile(file, fileList) }">
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text">
                    Drop file here or <em>click to upload</em>
                    </div>
                    <template #tip>
                    <div class="el-upload__tip">
                        请上传论文文件
                    </div>
                    </template>
                </el-upload>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible= false">取消</el-button>
                    <el-button type="primary" @click="addArticle"> 确认 </el-button>
                </span> 
            </template>
        </el-dialog>

        <el-dialog v-model="editDialog" title="修改论文" width="100%">
            <el-form :model="articleA"  label-width="100px" style="padding-right: 30px">
                <el-form-item label="文章名称" prop="title">
                    <el-input v-model="articleA.title" minlength="1" maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="作者" prop="author">
                    <el-input v-model="articleA.author" minlength="1" maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="会议期刊" prop="publisher">
                    <el-input v-model="articleA.publisher" minlength="1" maxlength="30"></el-input>
                </el-form-item>
                <el-upload class="uploadfile"
                    drag
                    action="none"
                    multiple
                    :auto-upload="false"
                    :on-change="(file, fileList) => { uploadFile(file, fileList) }">
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text">
                    Drop file here or <em>click to upload</em>
                    </div>
                    <template #tip>
                    <div class="el-upload__tip">
                        请上传论文文件
                    </div>
                    </template>
                </el-upload>
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