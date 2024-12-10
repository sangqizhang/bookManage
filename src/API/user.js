import request from '@/Utils/request.js'

//提供调用注册接口的函数
export const userRegisterService = (registerData) => {
    //借助于urlSearchParams完成传递
    const params = new URLSearchParams()
    for(let key in registerData){
        params.append(key,registerData[key]);
    }
    return request.post('/register',params);
}

//提供调用登录接口的函数
export const userLoginService = (loginData) => {
    const params = new URLSearchParams()
    for(let key in loginData){
        params.append(key,loginData[key]);
    }
    return request.post('/login',params);
}

export const userFindService = (userId) => {
    return request.get(`/user/${userId}`);
}

export const userUpdateService = (userData) => {
    const params = new URLSearchParams();
    for(let key in userData){
        params.append(key,userData[key]);
    }
    return request.put('/user/passwd',params);
}

export const userInfoUpdateService = (userData) => {
    const params = new URLSearchParams();
    for(let key in userData){
        params.append(key,userData[key]);
    }
    return request.put('/user',params);
}

export const userFind = () => {
    return request.get('/user');
}

export const adduserD = (userData) => {
    console.log(userData);
    return request.post('/user', userData, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}


export const deleteuserD = (userId)=>{
    console.log(userId);
    return request.delete(`/user/${userId}`);
}

export const getUserD = (userId)=>{
    console.log(userId);
    return request.get(`/user/${userId}`);
}

export const edituserD = (userData) => {
    console.log(userData.userId)
    const params = new URLSearchParams();
    for(let key in userData){
        params.append(key,userData[key]);
    }
    return request.put('/user/edit',params);
}