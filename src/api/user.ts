import request from "./request";

// 用户信息
export function userInfo() {
    return request({
        url: '/user-center-service/front/user/userInfo',
        method: 'GET'
    })
} 

// 勋章信息
export function medalInfo() {
    return request({
        url: '/chart-center-service/front/medal/getAllMedal',
        method: 'GET'
    })
}

// 用户登出
export function userLogout() {
    return request({
        url: '/auth-center-service/auth/user/logout',
        method: 'GET'
    })
}

// 修改密码
export function updatePwd(newPassword: any) {
    return request({
        url: 'user-center-service/front/user/updateUserPassword',
        method: 'PUT',
        params: {
            password: newPassword
        }
    })
}

// 获取验证码
export function getEmailCode(emailName: any) {
    return request({
        url: '/auth-center-service/auth/user/getEmailCode',
        method: 'GET',
        params: {
            email: emailName
        }
    })
}

// 邮箱登录
export function emailLogin(loginParams: any) {
    return request({
        url: '/auth-center-service/auth/user/loginEmail',
        method: 'POST',
        data: loginParams
    })
}

// 账号登录
export function usernameLogin(loginParams: any) {
    return request({
        url: '/auth-center-service/auth/user/loginByUsername',
        method: 'POST',
        data: loginParams
    })
}

// 用户注册
export function userRegister(registerParams: any) {
    console.log(registerParams)
    return request({
        url: '/auth-center-service/auth/user/register',
        method: 'POST',
        data: registerParams
    })
}

// 修改信息
export function updateUserInfo(updateUserInfo: any) {
    return request({
        url: 'user-center-service/front/user/updateUserInfo',
        method: 'PUT',
        data: updateUserInfo
    })
}

// 申请讲师角色
export function applyTeacherRole(teacherInfoParams: any) {
    return request({
        url: 'user-center-service/front/user/applyTeacherRole',
        method: 'POST',
        data: teacherInfoParams
    })
}

// 申请讲师进度
export function showApplyTeacherReason() {
    return request({
        url: 'user-center-service/front/user/teacherApplyReason',
        method: 'GET'
    })
}

// 删除讲师申请
export function deleteApply() {
    return request({
        url: 'user-center-service/front/user/deleteTeacherApply',
        method: 'DELETE'
    })
}

// 获取所有在线客服列表
export function getOnlineCustom() {
    return request({
        url: 'user-center-service/front/user/getAllOnlineCustom',
        method: 'GET'
    })
}

// 获取所有聊天记录
export function getAllChatRecords(userId: any, adminId: any) {
    return request({
        url: `user-center-service/front/user/getAllChatRecords/${userId}/${adminId}`,
        method: 'GET'
    })
}