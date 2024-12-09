import request from '@/Utils/request.js'

//提供调用注册接口的函数
export const bookFind = () => {
    //借助于urlSearchParams完成传递
    // const params = new URLSearchParams()
    // for(let key in articleData){
    //     params.append(key,articleData[key]);
    // }
    return request.get('/book');
}

export const addBookD = (bookData)=>{
    const params = new URLSearchParams();
    for(let key in bookData){
        params.append(key,bookData[key]);
    }
    return request.post('/add',params);
}


export const deleteBookD = (bookId)=>{
    return request.delete('/book/delete', {
        data:bookId, 
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
