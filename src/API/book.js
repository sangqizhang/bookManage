import request from '@/Utils/request.js'

//提供调用注册接口的函数
export const bookFind = (bookData) => {
    //借助于urlSearchParams完成传递
    const params = new URLSearchParams()
    for(let key in bookData){
        params.append(key,bookData[key]);
    }
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

export const getBookD = (bookId)=>{
    console.log(bookId);
    return request.post(`/book/${bookId}`);
}

export const borrowBookD = (bookData) => {
    const params = new URLSearchParams();
    for(let key in bookData){
        params.append(key,bookData[key]);
    }
    return request.post('/book/borrow',params);
}

export const returnBookD = (bookData) => {
    const params = new URLSearchParams();
    for(let key in bookData){
        params.append(key,bookData[key]);
    }
    return request.post('/book/return',params);
}

export const borrowedBookD = (bookData) => {
    console.log(bookData);
    const params = new URLSearchParams();
    for(let key in bookData){
        params.append(key,bookData[key]);
    }
    return request.post('/book/borrowed',params);
}

export const bookTotalD = () => {
    return request.get('/book/total');
}

export const recordFind = (recordData) => {
    //借助于urlSearchParams完成传递
    const params = new URLSearchParams()
    for(let key in recordData){
        params.append(key,recordData[key]);
    }
    return request.get('/book/record');
}

export const recordUserFind = (recordData) => {
    console.log(recordData);
    const params = new URLSearchParams()
    for(let key in recordData){
        params.append(key,recordData[key]);
    }
    return request.get('/book/recordu');
}

export const recordTotalD = () => {
    return request.get('/book/rtotal');
}

export const recordUserTotalD = (recordData) => {
    const params = new URLSearchParams()
    for(let key in recordData){
        params.append(key,recordData[key]);
    }
    return request.get('/book/rtotalu');
}