import request from '@/Utils/request.js'
import { useTokenStore } from '@/stores/token'

//邮箱查询
export const emailListService = ()=>{
    //const tokenStore = useTokenStore();
    //在pinia中定义的响应式数据均不需要.value，可以直接使用
    //return request.get('/user/email',{headers:{'Authorization':tokenStore.token}})
    return request.get('/user/email')
}

//银行账户查询
export const bankAccountListService = ()=>{
    //const tokenStore = useTokenStore();
    //在pinia中定义的响应式数据均不需要.value，可以直接使用
    //return request.get('/user/bankAccount',{headers:{'Authorization':tokenStore.token}})
    return request.get('/user/bankAccount')
}

//个人信息查询
export const walletInfoService = (userId)=>{
    //const tokenStore = useTokenStore();
    //在pinia中定义的响应式数据均不需要.value，可以直接使用
    //return request.get('/user/info',{headers:{'Authorization':tokenStore.token}})
    
    return request.get('/user/'+userId)
}

//新增邮箱数据
export const addEmailService = (emailData)=>{
    const params = new URLSearchParams()
    for(let key in emailData){
        params.append(key,emailData[key]);
    }
    return request.post('/user/email',params)
}

//新增银行账户数据
export const addBankAccountService = (bankAccountData)=>{
    const params = new URLSearchParams()
    for(let key in bankAccountData){
        params.append(key,bankAccountData[key]);
    }
    return request.post('/user/bankAccount',params)
}

//删除邮箱数据
export const deleteEmailService = (emailData)=>{
    return request.delete('/user/email', {
        data:emailData, // 直接将 emailData 作为 JSON 数据体发送
        headers: {
            'Content-Type': 'application/json', // 确保 Content-Type 为 JSON
        },
    });
}

//删除银行账户数据
export const deleteBankAccountService = (bankAccountData)=>{
    return request.delete('/user/bankAccount', {
        data:bankAccountData, // 直接将 bankAccountData 作为 JSON 数据体发送
        headers: {
            'Content-Type': 'application/json', // 确保 Content-Type 为 JSON
        },
    });
}

