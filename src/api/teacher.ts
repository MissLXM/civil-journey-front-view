import request from "./request";


// 首页获取讲师信息
export function getTeacher() {
    return request({
        url: '/user-center-service/front/user/getTeacher',
        method: 'GET'
    })
}

// 讲师弹出框(讲师基本信息)
export function getTeacherInfoById(teacherId: any) {
    return request({
        url: `/user-center-service/front/user/getTeacherInfoById/${teacherId}`,
        method: 'GET'
    })
}

// 修改讲师自身的简介
export function updateIntroduction(introduction: any) {
    return request({
        url: '/user-center-service/front/user/updateTeacherIntroduction',
        method: 'GET',
        params: {
            teacherIntroduction: introduction
        }
    })       
}

// 讲师弹出框(讲师历史课程信息)
export function getTeacherHistoryCourseInfo(teacherId: any, pageParams: any) {
    return request({
        url: `/user-center-service/front/user/getTeacherHistoryCourseInfo/${teacherId}`,
        method: 'POST',
        data: pageParams
    })
}

