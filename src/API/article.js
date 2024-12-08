import request from '@/Utils/request.js'

//提供调用注册接口的函数
export const articleFind = () => {
    //借助于urlSearchParams完成传递
    // const params = new URLSearchParams()
    // for(let key in articleData){
    //     params.append(key,articleData[key]);
    // }
    return request.get('/article');
}
export const addArticleD = (articleData)=>{
    const params = new URLSearchParams()
    for(let key in articleData){
        params.append(key,articleData[key]);
    }
    return request.post('/article/upload',params)
}

//删除邮箱数据
export const deleteArticleD = (articleId)=>{
    return request.delete('/article/delete', {
        data:articleId, // 直接将 emailData 作为 JSON 数据体发送
        headers: {
            'Content-Type': 'application/json', // 确保 Content-Type 为 JSON
        },
    });
}