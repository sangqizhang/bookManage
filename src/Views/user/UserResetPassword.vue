<template>
  <el-card>
    <el-form :model="form" :rules="rules" ref="form1" label-width="100px">
      <el-form-item label="原密码" prop="oldPassword">
        <el-input v-model="form.oldPassword" type="password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="form.newPassword" type="password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="重复新密码" prop="confirmPassword">
        <el-input v-model="form.confirmPassword" type="password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form1')">提交</el-button>
        <el-button @click="resetForm('form1')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { ref } from 'vue';
import { userUpdateService, userFindService } from '@/API/user';
import { ElMessage } from 'element-plus';
export default {
  setup() {
    const form = ref({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    const info = ref({
        userId: '',
        password: ''
    });
    const userpw = ref({
        password: ''
    });
    const rules = ref({
      oldPassword: [
        { required: true, message: '请输入原密码', trigger: 'blur' }
      ],
      newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请再次输入新密码', trigger: 'blur' },
        { validator: (rule, value, callback) => {
            if (value !== form.value.newPassword) {
              callback(new Error('两次输入的新密码不一致'));
            } else {
              callback();
            }
          }, trigger: 'blur'
        }
      ]
    });
    const form1 = ref(null);
    const submitForm = (formName) => {
      form1.value.validate((valid) => {
        if (valid) {
          // 提交表单逻辑
          info.value.userId = sessionStorage.getItem('userId');
          userFindService(info.value.userId)
            .then((result) => {
              userpw.value = result.data;
              console.log(form.value);
              console.log(userpw.value.password);
              if (form.value.oldPassword != userpw.value.password) {
                  ElMessage({
                  message: '原密码错误',
                  type: 'error',
                  });
                  return false;
              }
              // 更新密码
              info.value.password = form.value.newPassword;
              userUpdateService(info.value)
                .then(() => {
                  ElMessage({
                    message: '提交成功',
                    type: 'success',
                  });
                })
                .catch((error) => {
                  ElMessage({
                    message: '提交失败: ' + error.message,
                    type: 'error',
                  });
                });
            })
            .catch((error) => {
              ElMessage({
                message: '获取用户信息失败: ' + error.message,
                type: 'error',
              });
            });
        } else {
          ElMessage({
            message: '密码非法',
            type: 'error',
          });
          return false;
        }
      });
    };

    const resetForm = (formName) => {
      form1.value.resetFields();
    };

    return {
      form,
      rules,
      form1,
      submitForm,
      resetForm
    };
  }
};
</script>

<style scoped>
.el-card {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}
</style>