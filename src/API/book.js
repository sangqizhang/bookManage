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

export const addBookD = (bookData) => {
    console.log(bookData);
    return request.post('/book/add', bookData, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}


export const deleteBookD = (bookId)=>{
    console.log(bookId);
    return request.delete(`/book/delete/${bookId}`);
}
