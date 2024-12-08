<template>
    <el-dialog :visible.sync="dialogVisible" title="添加论文">
        <el-form :model="form">
            <el-form-item label="论文标题">
                <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="论文作者">
                <el-input type="textarea" v-model="form.content"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitForm">提交</el-button>
        </span>
    </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import request from '@/Utils/request.js'

const dialogVisible = ref(false)
const form = ref({
    title: '',
    content: ''
})

const submitForm = async () => {
    try {
        const response = await request.post('/article', form.value)
        if (response.status === 200) {
            alert('论文添加成功')
            dialogVisible.value = false
        } else {
            alert('论文添加失败')
        }
    } catch (error) {
        alert('论文添加失败')
    }
}
</script>

<style scoped>
.dialog-footer {
    text-align: right;
}
</style>