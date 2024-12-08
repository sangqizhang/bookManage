<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { ref,onMounted } from 'vue'

const Info = ref([
    {
        
        "username": '',
        "phoneNumber": '',
        "mainAccount": '',
        "balance":''
    }
])
const userId=sessionStorage.getItem('userId');
//声明一个异步函数
import { walletInfoService } from '@/API/wallet';
const walletInfo = async()=>{
    let result = await walletInfoService(userId);
    
    Info.value = result.data;
}
onMounted(() => {
    walletInfo();
    });
</script>

<template>
    <h1>基本资料</h1>
    <div v-if="Info">
      用户名：{{ Info.username || '未知' }}
      <br><br>
      手机号码：{{ Info.phoneNumber || '未知' }}
      <br><br>
      主要资金来源账户：{{ Info.mainAccount || '未知' }}
      <br><br>
      余额：{{ Info.balance !== undefined ? Info.balance : '未知' }}
    </div>
    <div v-else>
      加载中...
    </div>
  </template>