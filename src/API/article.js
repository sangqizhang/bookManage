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
    const params = new URLSearchParams();
    for(let key in articleData){
        params.append(key,articleData[key]);
    }
    return request.post('/article/upload',params);
}


export const deleteArticleD = (articleId)=>{
    return request.delete('/article/delete', {
        data:articleId, 
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export const editArticleD = (articleData) => {
    const params = new URLSearchParams();
    for(let key in articleData){
        params.append(key,articleData[key]);
    }
    return request.put('/article',params);
}

export const downloadArticleD = (articleData) => {
    const params = new URLSearchParams();
    for(let key in articleData){
        params.append(key,articleData[key]);
    }
    request.post('/article/download',params);
}